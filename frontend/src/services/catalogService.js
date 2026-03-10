import apiClient from "./apiClient";

export const catalogService = {
  async getServiceDomains() {
    const { data } = await apiClient.get("/catalog/service-domains");
    return Array.isArray(data) ? data : [];
  },

  async getRequestTypes(serviceDomainKey) {
    const query = serviceDomainKey ? `?serviceDomainKey=${encodeURIComponent(serviceDomainKey)}` : "";
    const { data } = await apiClient.get(`/catalog/request-types${query}`);
    return Array.isArray(data) ? data : [];
  },

  async getSupportCategories() {
    const { data } = await apiClient.get("/catalog/support-categories");
    return Array.isArray(data) ? data : [];
  },
};
