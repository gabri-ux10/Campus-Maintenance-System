package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.catalog.RequestTypeCreateRequest;
import com.smartcampus.maintenance.dto.catalog.RequestTypeResponse;
import com.smartcampus.maintenance.dto.catalog.RequestTypeUpdateRequest;
import com.smartcampus.maintenance.dto.catalog.ServiceDomainResponse;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryCreateRequest;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryResponse;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryUpdateRequest;
import com.smartcampus.maintenance.entity.RequestType;
import com.smartcampus.maintenance.entity.ServiceDomain;
import com.smartcampus.maintenance.entity.SupportCategory;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.entity.enums.Role;
import com.smartcampus.maintenance.exception.ConflictException;
import com.smartcampus.maintenance.exception.ForbiddenException;
import com.smartcampus.maintenance.exception.NotFoundException;
import com.smartcampus.maintenance.repository.RequestTypeRepository;
import com.smartcampus.maintenance.repository.ServiceDomainRepository;
import com.smartcampus.maintenance.repository.SupportCategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogService {

    private final ServiceDomainRepository serviceDomainRepository;
    private final RequestTypeRepository requestTypeRepository;
    private final SupportCategoryRepository supportCategoryRepository;
    private final CatalogEventStreamService catalogEventStreamService;
    private final AuditEventService auditEventService;

    public CatalogService(
            ServiceDomainRepository serviceDomainRepository,
            RequestTypeRepository requestTypeRepository,
            SupportCategoryRepository supportCategoryRepository,
            CatalogEventStreamService catalogEventStreamService,
            AuditEventService auditEventService) {
        this.serviceDomainRepository = serviceDomainRepository;
        this.requestTypeRepository = requestTypeRepository;
        this.supportCategoryRepository = supportCategoryRepository;
        this.catalogEventStreamService = catalogEventStreamService;
        this.auditEventService = auditEventService;
    }

    @Transactional(readOnly = true)
    public List<ServiceDomainResponse> getServiceDomains() {
        return serviceDomainRepository.findAllByOrderBySortOrderAscLabelAsc().stream()
                .map(this::toServiceDomainResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestTypeResponse> getActiveRequestTypes(String serviceDomainKey) {
        List<RequestType> requestTypes = serviceDomainKey == null || serviceDomainKey.isBlank()
                ? requestTypeRepository.findByActiveTrueOrderByServiceDomainSortOrderAscServiceDomainLabelAscSortOrderAscLabelAsc()
                : requestTypeRepository.findByServiceDomain_KeyIgnoreCaseAndActiveTrueOrderBySortOrderAscLabelAsc(
                        serviceDomainKey.trim());
        return requestTypes.stream()
                .map(this::toRequestTypeResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestTypeResponse> getAllRequestTypes(User actor) {
        requireAdmin(actor);
        return requestTypeRepository.findAllByOrderByServiceDomainSortOrderAscServiceDomainLabelAscSortOrderAscLabelAsc()
                .stream()
                .map(this::toRequestTypeResponse)
                .toList();
    }

    @Transactional
    public RequestTypeResponse createRequestType(User actor, RequestTypeCreateRequest request) {
        requireAdmin(actor);
        ServiceDomain serviceDomain = serviceDomainRepository.findByKeyIgnoreCase(request.serviceDomainKey().trim())
                .orElseThrow(() -> new NotFoundException("Service domain not found"));
        String label = request.label().trim();
        if (requestTypeRepository.existsByServiceDomain_IdAndLabelIgnoreCase(serviceDomain.getId(), label)) {
            throw new ConflictException("Request type '" + label + "' already exists in " + serviceDomain.getLabel());
        }

        RequestType requestType = new RequestType();
        requestType.setServiceDomain(serviceDomain);
        requestType.setLabel(label);
        requestType.setSortOrder(resolveRequestTypeSortOrder(request.sortOrder(), serviceDomain.getKey()));
        RequestType saved = requestTypeRepository.save(requestType);
        catalogEventStreamService.publish("request-types", "CREATED", List.of(saved.getId()));
        auditEventService.record(
                "request_type.created",
                actor,
                "request_type",
                String.valueOf(saved.getId()),
                null,
                java.util.Map.of("label", saved.getLabel(), "serviceDomain", saved.getServiceDomain().getKey()));
        return toRequestTypeResponse(saved);
    }

    @Transactional
    public RequestTypeResponse updateRequestType(User actor, Long requestTypeId, RequestTypeUpdateRequest request) {
        requireAdmin(actor);
        RequestType requestType = requestTypeRepository.findById(requestTypeId)
                .orElseThrow(() -> new NotFoundException("Request type not found"));
        String label = request.label().trim();
        Long serviceDomainId = requestType.getServiceDomain().getId();
        if (requestTypeRepository.existsByServiceDomain_IdAndLabelIgnoreCaseAndIdNot(serviceDomainId, label,
                requestTypeId)) {
            throw new ConflictException("Request type '" + label + "' already exists in "
                    + requestType.getServiceDomain().getLabel());
        }

        boolean wasActive = requestType.isActive();
        requestType.setLabel(label);
        requestType.setActive(Boolean.TRUE.equals(request.active()));
        requestType.setSortOrder(request.sortOrder());
        RequestType saved = requestTypeRepository.save(requestType);
        String action = !wasActive && saved.isActive()
                ? "RESTORED"
                : wasActive && !saved.isActive() ? "ARCHIVED" : "UPDATED";
        catalogEventStreamService.publish("request-types", action, List.of(saved.getId()));
        auditEventService.record(
                "request_type." + action.toLowerCase(),
                actor,
                "request_type",
                String.valueOf(saved.getId()),
                null,
                java.util.Map.of("label", saved.getLabel(), "active", saved.isActive()));
        return toRequestTypeResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SupportCategoryResponse> getActiveSupportCategories() {
        return supportCategoryRepository.findByActiveTrueOrderBySortOrderAscLabelAsc().stream()
                .map(this::toSupportCategoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SupportCategoryResponse> getAllSupportCategories(User actor) {
        requireAdmin(actor);
        return supportCategoryRepository.findAllByOrderBySortOrderAscLabelAsc().stream()
                .map(this::toSupportCategoryResponse)
                .toList();
    }

    @Transactional
    public SupportCategoryResponse createSupportCategory(User actor, SupportCategoryCreateRequest request) {
        requireAdmin(actor);
        String label = request.label().trim();
        if (supportCategoryRepository.existsByLabelIgnoreCase(label)) {
            throw new ConflictException("Support category '" + label + "' already exists");
        }

        SupportCategory supportCategory = new SupportCategory();
        supportCategory.setLabel(label);
        supportCategory.setSortOrder(resolveSupportCategorySortOrder(request.sortOrder()));
        SupportCategory saved = supportCategoryRepository.save(supportCategory);
        catalogEventStreamService.publish("support-categories", "CREATED", List.of(saved.getId()));
        auditEventService.record(
                "support_category.created",
                actor,
                "support_category",
                String.valueOf(saved.getId()),
                null,
                java.util.Map.of("label", saved.getLabel()));
        return toSupportCategoryResponse(saved);
    }

    @Transactional
    public SupportCategoryResponse updateSupportCategory(User actor, Long supportCategoryId,
            SupportCategoryUpdateRequest request) {
        requireAdmin(actor);
        SupportCategory supportCategory = supportCategoryRepository.findById(supportCategoryId)
                .orElseThrow(() -> new NotFoundException("Support category not found"));
        String label = request.label().trim();
        if (supportCategoryRepository.existsByLabelIgnoreCaseAndIdNot(label, supportCategoryId)) {
            throw new ConflictException("Support category '" + label + "' already exists");
        }

        boolean wasActive = supportCategory.isActive();
        supportCategory.setLabel(label);
        supportCategory.setActive(Boolean.TRUE.equals(request.active()));
        supportCategory.setSortOrder(request.sortOrder());
        SupportCategory saved = supportCategoryRepository.save(supportCategory);
        String action = !wasActive && saved.isActive()
                ? "RESTORED"
                : wasActive && !saved.isActive() ? "ARCHIVED" : "UPDATED";
        catalogEventStreamService.publish("support-categories", action, List.of(saved.getId()));
        auditEventService.record(
                "support_category." + action.toLowerCase(),
                actor,
                "support_category",
                String.valueOf(saved.getId()),
                null,
                java.util.Map.of("label", saved.getLabel(), "active", saved.isActive()));
        return toSupportCategoryResponse(saved);
    }

    @Transactional(readOnly = true)
    public RequestType requireActiveRequestType(Long requestTypeId) {
        RequestType requestType = requestTypeRepository.findById(requestTypeId)
                .orElseThrow(() -> new NotFoundException("Request type not found"));
        if (!requestType.isActive()) {
            throw new ConflictException("Request type is not active");
        }
        return requestType;
    }

    @Transactional(readOnly = true)
    public SupportCategory requireActiveSupportCategory(Long supportCategoryId) {
        SupportCategory supportCategory = supportCategoryRepository.findById(supportCategoryId)
                .orElseThrow(() -> new NotFoundException("Support category not found"));
        if (!supportCategory.isActive()) {
            throw new ConflictException("Support category is not active");
        }
        return supportCategory;
    }

    private int resolveRequestTypeSortOrder(Integer requestedSortOrder, String serviceDomainKey) {
        if (requestedSortOrder != null) {
            return requestedSortOrder;
        }
        return requestTypeRepository.findByServiceDomain_KeyIgnoreCaseAndActiveTrueOrderBySortOrderAscLabelAsc(
                serviceDomainKey).stream()
                .mapToInt(RequestType::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private int resolveSupportCategorySortOrder(Integer requestedSortOrder) {
        if (requestedSortOrder != null) {
            return requestedSortOrder;
        }
        return supportCategoryRepository.findAllByOrderBySortOrderAscLabelAsc().stream()
                .mapToInt(SupportCategory::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private ServiceDomainResponse toServiceDomainResponse(ServiceDomain serviceDomain) {
        return new ServiceDomainResponse(
                serviceDomain.getId(),
                serviceDomain.getKey(),
                serviceDomain.getLabel(),
                serviceDomain.getSortOrder());
    }

    private RequestTypeResponse toRequestTypeResponse(RequestType requestType) {
        return new RequestTypeResponse(
                requestType.getId(),
                requestType.getLabel(),
                requestType.isActive(),
                requestType.getSortOrder(),
                requestType.getServiceDomain().getId(),
                requestType.getServiceDomain().getKey(),
                requestType.getServiceDomain().getLabel());
    }

    private SupportCategoryResponse toSupportCategoryResponse(SupportCategory supportCategory) {
        return new SupportCategoryResponse(
                supportCategory.getId(),
                supportCategory.getLabel(),
                supportCategory.isActive(),
                supportCategory.getSortOrder());
    }

    private void requireAdmin(User actor) {
        if (actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("ADMIN role is required");
        }
    }
}
