import { useCallback, useEffect, useRef, useState } from "react";

export const useTickets = (loader, deps = []) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);
    setError("");
    try {
      const data = await loader();
      if (requestId !== requestIdRef.current) return;
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.response?.data?.message || "Failed to load tickets.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => () => {
    requestIdRef.current += 1;
  }, []);

  return { tickets, setTickets, loading, error, refresh };
};
