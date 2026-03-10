package com.smartcampus.maintenance.controller;

import com.smartcampus.maintenance.dto.catalog.RequestTypeResponse;
import com.smartcampus.maintenance.dto.catalog.ServiceDomainResponse;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryResponse;
import com.smartcampus.maintenance.service.CatalogService;
import com.smartcampus.maintenance.service.CatalogEventStreamService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CatalogService catalogService;
    private final CatalogEventStreamService catalogEventStreamService;

    public CatalogController(CatalogService catalogService, CatalogEventStreamService catalogEventStreamService) {
        this.catalogService = catalogService;
        this.catalogEventStreamService = catalogEventStreamService;
    }

    @GetMapping("/service-domains")
    public List<ServiceDomainResponse> getServiceDomains() {
        return catalogService.getServiceDomains();
    }

    @GetMapping("/request-types")
    public List<RequestTypeResponse> getRequestTypes(
            @RequestParam(value = "serviceDomainKey", required = false) String serviceDomainKey) {
        return catalogService.getActiveRequestTypes(serviceDomainKey);
    }

    @GetMapping("/support-categories")
    public List<SupportCategoryResponse> getSupportCategories() {
        return catalogService.getActiveSupportCategories();
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamCatalogEvents() {
        return catalogEventStreamService.subscribe();
    }
}
