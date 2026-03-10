package com.smartcampus.maintenance.controller;

import com.smartcampus.maintenance.dto.building.BuildingCreateRequest;
import com.smartcampus.maintenance.dto.building.BuildingResponse;
import com.smartcampus.maintenance.dto.building.BuildingUpdateRequest;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.service.BuildingService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;
    private final CurrentUserService currentUserService;

    public BuildingController(BuildingService buildingService, CurrentUserService currentUserService) {
        this.buildingService = buildingService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<BuildingResponse> getBuildings(
            @RequestParam(value = "includeArchived", defaultValue = "false") boolean includeArchived) {
        if (includeArchived) {
            User actor = currentUserService.requireCurrentUser();
            return buildingService.getOperationalBuildings(actor);
        }
        return buildingService.getActiveBuildings();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BuildingResponse createBuilding(@Valid @RequestBody BuildingCreateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return buildingService.createBuilding(actor, request);
    }

    @PatchMapping("/{id}")
    public BuildingResponse updateBuilding(@PathVariable Long id, @Valid @RequestBody BuildingUpdateRequest request) {
        User actor = currentUserService.requireCurrentUser();
        return buildingService.updateBuilding(actor, id, request);
    }
}
