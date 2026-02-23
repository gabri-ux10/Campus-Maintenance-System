import apiClient from "./apiClient";

export const notificationService = {
  async getNotifications() {
    const { data } = await apiClient.get("/notifications");
    return Array.isArray(data) ? data : [];
  },
  async getUnreadCount() {
    const { data } = await apiClient.get("/notifications/unread-count");
    return Number(data?.count || 0);
  },
  async markRead(notificationId) {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },
  async markAllRead() {
    await apiClient.put("/notifications/read-all");
  },
};
