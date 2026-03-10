import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

/**
 * Warns the user 5 minutes before their in-memory session expires.
 */
export const SessionExpiryWarning = () => {
  const { auth, logout } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!auth?.expiresAt) {
      return undefined;
    }

    const expMs = new Date(auth.expiresAt).getTime();
    if (Number.isNaN(expMs)) {
      return undefined;
    }

    const msUntilExpiry = expMs - Date.now();
    const warnAtMs = msUntilExpiry - 5 * 60 * 1000;

    if (warnAtMs <= 0) {
      if (msUntilExpiry > 0) {
        toast("Your session will expire soon. Save your work and sign in again if needed.", {
          duration: 8000,
        });
      }
      return undefined;
    }

    timerRef.current = setTimeout(() => {
      toast(
        (currentToast) => (
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold">Session expiring</p>
              <p className="text-xs text-gray-500">Your session expires in 5 minutes. Save your work.</p>
            </div>
            <button
              onClick={() => {
                toast.dismiss(currentToast.id);
                logout();
                window.location.href = "/login";
              }}
              className="rounded-lg bg-campus-500 px-3 py-1 text-xs font-semibold text-white hover:bg-campus-600"
            >
              Sign in again
            </button>
          </div>
        ),
        { duration: 5 * 60 * 1000, id: "session-expiry" }
      );
    }, warnAtMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [auth?.expiresAt, logout]);

  return null;
};
