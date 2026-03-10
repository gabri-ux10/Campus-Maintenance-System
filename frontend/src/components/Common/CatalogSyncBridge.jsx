import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth } from "../../hooks/useAuth";
import { apiBaseUrl } from "../../services/apiClient";
import { catalogKeys } from "../../queries/catalogQueries";

const MAX_RETRY_DELAY_MS = 30_000;
const BASE_RETRY_DELAY_MS = 1_000;

const invalidateCatalogResource = (queryClient, resource) => {
  switch (resource) {
    case "buildings":
      queryClient.invalidateQueries({ queryKey: catalogKeys.activeBuildings });
      queryClient.invalidateQueries({ queryKey: catalogKeys.operationalBuildings });
      queryClient.invalidateQueries({ queryKey: catalogKeys.adminBuildings });
      break;
    case "request-types":
      queryClient.invalidateQueries({ queryKey: ["catalog", "request-types"] });
      break;
    case "support-categories":
      queryClient.invalidateQueries({ queryKey: catalogKeys.supportCategories });
      queryClient.invalidateQueries({ queryKey: catalogKeys.adminSupportCategories });
      break;
    default:
      break;
  }
};

export const CatalogSyncBridge = () => {
  const { auth, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const accessTokenRef = useRef(auth?.accessToken);

  // Keep the token ref fresh so reconnects always use the latest token.
  useEffect(() => {
    accessTokenRef.current = auth?.accessToken;
  }, [auth?.accessToken]);

  useEffect(() => {
    if (!isAuthenticated || !auth?.accessToken) {
      return undefined;
    }

    const controller = new AbortController();
    let retryCount = 0;

    fetchEventSource(`${apiBaseUrl}/catalog/stream`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
      credentials: "include",

      onopen() {
        // Connection established — reset backoff counter.
        retryCount = 0;
      },

      onmessage(event) {
        if (!event.data) return;
        try {
          const payload = JSON.parse(event.data);
          invalidateCatalogResource(queryClient, payload.resource);
        } catch {
          // Ignore malformed sync messages.
        }
      },

      onerror() {
        retryCount += 1;
        const delayMs = Math.min(
          BASE_RETRY_DELAY_MS * Math.pow(2, retryCount - 1),
          MAX_RETRY_DELAY_MS
        );

        // Return the delay to let fetchEventSource retry automatically.
        // Returning a value (instead of throwing) tells the library to reconnect.
        return delayMs;
      },

      // Re-supply fresh token on every reconnect attempt.
      async onreconnect() {
        return {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        };
      },
    }).catch(() => {
      // Fatal connection errors are tolerated; a future auth change will remount.
    });

    return () => controller.abort();
  }, [isAuthenticated, auth?.accessToken, queryClient]);

  return null;
};
