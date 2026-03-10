import apiClient from "./apiClient";

export const adminConfigService = {
  async getBuildings() {
    const { data } = await apiClient.get("/admin/config/buildings");
    return Array.isArray(data) ? data : [];
  },

  async createBuilding(payload) {
    const { data } = await apiClient.post("/admin/config/buildings", payload);
    return data;
  },

  async updateBuilding(id, payload) {
    const { data } = await apiClient.patch(`/admin/config/buildings/${id}`, payload);
    return data;
  },

  async getRequestTypes() {
    const { data } = await apiClient.get("/admin/config/request-types");
    return Array.isArray(data) ? data : [];
  },

  async createRequestType(payload) {
    const { data } = await apiClient.post("/admin/config/request-types", payload);
    return data;
  },

  async updateRequestType(id, payload) {
    const { data } = await apiClient.patch(`/admin/config/request-types/${id}`, payload);
    return data;
  },

  async getSupportCategories() {
    const { data } = await apiClient.get("/admin/config/support-categories");
    return Array.isArray(data) ? data : [];
  },

  async createSupportCategory(payload) {
    const { data } = await apiClient.post("/admin/config/support-categories", payload);
    return data;
  },

  async updateSupportCategory(id, payload) {
    const { data } = await apiClient.patch(`/admin/config/support-categories/${id}`, payload);
    return data;
  },
};
