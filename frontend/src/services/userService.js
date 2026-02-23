import apiClient from "./apiClient";

export const userService = {
  async getAllUsers() {
    const { data } = await apiClient.get("/users");
    return data;
  },
  async getMaintenanceUsers() {
    const { data } = await apiClient.get("/users/maintenance");
    return data;
  },
  async createStaffInvite(payload) {
    const { data } = await apiClient.post("/users/staff", payload);
    return data;
  },
  async createStaff(payload) {
    return this.createStaffInvite(payload);
  },
};
