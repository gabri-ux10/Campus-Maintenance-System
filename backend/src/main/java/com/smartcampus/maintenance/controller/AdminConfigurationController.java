package com.smartcampus.maintenance.controller;

import com.smartcampus.maintenance.dto.building.BuildingCreateRequest;
import com.smartcampus.maintenance.dto.building.BuildingResponse;
import com.smartcampus.maintenance.dto.building.BuildingUpdateRequest;
import com.smartcampus.maintenance.dto.catalog.RequestTypeCreateRequest;
import com.smartcampus.maintenance.dto.catalog.RequestTypeResponse;
import com.smartcampus.maintenance.dto.catalog.RequestTypeUpdateRequest;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryCreateRequest;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryResponse;
import com.smartcampus.maintenance.dto.catalog.SupportCategoryUpdateRequest;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.service.BuildingService;
import com.smartcampus.maintenance.service.CatalogService;
import com.smartcampus.maintenance.service.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/config")
public class AdminConfigurationController {

    private final CurrentUserService currentUserService;
    private final BuildingService buildingService;
    private final CatalogService catalogService;

    public AdminConfigurationController(
            CurrentUserService currentUserService,
            BuildingService buildingService,
            CatalogService catalogService) {
        this.currentUserService = currentUserService;
        this.buildingService = buildingService;
        this.catalogService = catalogService;
    }

    @GetMapping("/buildings")
    public List<BuildingResponse> getBuildings() {
        User actor = currentUserService.requireCurrentUser();
        return buildingService.getAllBuildings(actor);
    }

    @PostMapping("/buildings")
    @ResponseStatus(HttpStatus.CREATED)
    public BuildingResponse createBuilding(@Valid @RequestBody BuildingCreateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return buildingService.createBuilding(actor, request);
    }

    @PatchMapping("/buildings/{id}")
    public BuildingResponse updateBuilding(@PathVariable Long id, @Valid @RequestBody BuildingUpdateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return buildingService.updateBuilding(actor, id, request);
    }

    @GetMapping("/request-types")
    public List<RequestTypeResponse> getRequestTypes() {
        User actor = currentUserService.requireCurrentUser();
        return catalogService.getAllRequestTypes(actor);
    }

    @PostMapping("/request-types")
    @ResponseStatus(HttpStatus.CREATED)
    public RequestTypeResponse createRequestType(@Valid @RequestBody RequestTypeCreateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return catalogService.createRequestType(actor, request);
    }

    @PatchMapping("/request-types/{id}")
    public RequestTypeResponse updateRequestType(@PathVariable Long id,
            @Valid @RequestBody RequestTypeUpdateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return catalogService.updateRequestType(actor, id, request);
    }

    @GetMapping("/support-categories")
    public List<SupportCategoryResponse> getSupportCategories() {
        User actor = currentUserService.requireCurrentUser();
        return catalogService.getAllSupportCategories(actor);
    }

    @PostMapping("/support-categories")
    @ResponseStatus(HttpStatus.CREATED)
    public SupportCategoryResponse createSupportCategory(
            @Valid @RequestBody SupportCategoryCreateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return catalogService.createSupportCategory(actor, request);
    }

    @PatchMapping("/support-categories/{id}")
    public SupportCategoryResponse updateSupportCategory(@PathVariable Long id,
            @Valid @RequestBody SupportCategoryUpdateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return catalogService.updateSupportCategory(actor, id, request);
    }
}
