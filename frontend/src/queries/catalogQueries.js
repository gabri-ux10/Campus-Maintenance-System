import { useQuery } from "@tanstack/react-query";
import { buildingService } from "../services/buildingService";
import { catalogService } from "../services/catalogService";
import { adminConfigService } from "../services/adminConfigService";

export const catalogKeys = {
  activeBuildings: ["catalog", "buildings", "active"],
  operationalBuildings: ["catalog", "buildings", "operational"],
  serviceDomains: ["catalog", "service-domains"],
  activeRequestTypes: (serviceDomainKey = "all") => ["catalog", "request-types", "active", serviceDomainKey || "all"],
  allRequestTypes: ["catalog", "request-types", "all"],
  adminRequestTypes: ["catalog", "request-types", "admin"],
  supportCategories: ["catalog", "support-categories", "active"],
  adminSupportCategories: ["catalog", "support-categories", "admin"],
  adminBuildings: ["catalog", "buildings", "admin"],
};

export const useActiveBuildingsQuery = () => useQuery({
  queryKey: catalogKeys.activeBuildings,
  queryFn: () => buildingService.getBuildings(),
  staleTime: 60_000,
});

export const useOperationalBuildingsQuery = () => useQuery({
  queryKey: catalogKeys.operationalBuildings,
  queryFn: () => buildingService.getBuildings({ includeArchived: true }),
  staleTime: 60_000,
});

export const useServiceDomainsQuery = () => useQuery({
  queryKey: catalogKeys.serviceDomains,
  queryFn: catalogService.getServiceDomains,
  staleTime: 300_000,
});

export const useActiveRequestTypesQuery = (serviceDomainKey) => useQuery({
  queryKey: catalogKeys.activeRequestTypes(serviceDomainKey),
  queryFn: () => catalogService.getRequestTypes(serviceDomainKey),
  enabled: Boolean(serviceDomainKey),
  staleTime: 60_000,
});

export const useAllRequestTypesQuery = () => useQuery({
  queryKey: catalogKeys.allRequestTypes,
  queryFn: () => catalogService.getRequestTypes(),
  staleTime: 60_000,
});

export const useSupportCategoriesQuery = () => useQuery({
  queryKey: catalogKeys.supportCategories,
  queryFn: catalogService.getSupportCategories,
  staleTime: 60_000,
});

export const useAllSupportCategoriesQuery = () => useQuery({
  queryKey: catalogKeys.adminSupportCategories,
  queryFn: adminConfigService.getSupportCategories,
  staleTime: 60_000,
});

export const useAdminBuildingsQuery = () => useQuery({
  queryKey: catalogKeys.adminBuildings,
  queryFn: adminConfigService.getBuildings,
  staleTime: 60_000,
});
