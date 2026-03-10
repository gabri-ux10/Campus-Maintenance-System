import apiClient from "./apiClient";

export const buildingService = {
  async getBuildings(options = {}) {
    const query = options.includeArchived ? "?includeArchived=true" : "";
    const { data } = await apiClient.get(`/buildings${query}`);
    return Array.isArray(data) ? data : [];
  },
};
