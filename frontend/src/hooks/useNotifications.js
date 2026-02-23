import { useCallback, useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";

const POLL_MS = 20_000;

export const useNotifications = (enabled = true) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setError("");
    try {
      const [items, unread] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(items);
      setUnreadCount(unread);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    refresh();
    const timer = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(timer);
  }, [enabled, refresh]);

  const markRead = useCallback(async (id) => {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, loading, error, refresh, markRead, markAllRead };
};
