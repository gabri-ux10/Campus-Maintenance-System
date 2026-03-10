package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.building.BuildingCreateRequest;
import com.smartcampus.maintenance.dto.building.BuildingResponse;
import com.smartcampus.maintenance.dto.building.BuildingUpdateRequest;
import com.smartcampus.maintenance.entity.Building;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.entity.enums.Role;
import com.smartcampus.maintenance.exception.ConflictException;
import com.smartcampus.maintenance.exception.ForbiddenException;
import com.smartcampus.maintenance.exception.NotFoundException;
import com.smartcampus.maintenance.repository.BuildingRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final CatalogEventStreamService catalogEventStreamService;
    private final AuditEventService auditEventService;

    public BuildingService(
            BuildingRepository buildingRepository,
            CatalogEventStreamService catalogEventStreamService,
            AuditEventService auditEventService) {
        this.buildingRepository = buildingRepository;
        this.catalogEventStreamService = catalogEventStreamService;
        this.auditEventService = auditEventService;
    }

    @Transactional(readOnly = true)
    public List<BuildingResponse> getActiveBuildings() {
        return buildingRepository.findByActiveTrueOrderBySortOrderAscNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BuildingResponse> getAllBuildings(User actor) {
        requireAdmin(actor);
        return buildingRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BuildingResponse> getOperationalBuildings(User actor) {
        requireOperationalUser(actor);
        return buildingRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BuildingResponse createBuilding(User actor, BuildingCreateRequest request) {
        requireAdmin(actor);
        String name = request.name().trim();
        String code = request.code().trim().toUpperCase();

        if (buildingRepository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Building '" + request.name() + "' already exists");
        }
        if (buildingRepository.existsByCodeIgnoreCase(code)) {
            throw new ConflictException("Building code '" + request.code() + "' already exists");
        }
        Building building = new Building();
        building.setName(name);
        building.setCode(code);
        building.setFloors(request.floors());
        building.setSortOrder(resolveSortOrder(request.sortOrder()));
        building = buildingRepository.save(building);
        catalogEventStreamService.publish("buildings", "CREATED", List.of(building.getId()));
        auditEventService.record(
                "building.created",
                actor,
                "building",
                String.valueOf(building.getId()),
                null,
                java.util.Map.of("name", building.getName(), "code", building.getCode()));
        return toResponse(building);
    }

    @Transactional
    public BuildingResponse updateBuilding(User actor, Long buildingId, BuildingUpdateRequest request) {
        requireAdmin(actor);
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new NotFoundException("Building not found"));

        String name = request.name().trim();
        String code = request.code().trim().toUpperCase();

        if (buildingRepository.existsByNameIgnoreCaseAndIdNot(name, buildingId)) {
            throw new ConflictException("Building '" + request.name() + "' already exists");
        }
        if (buildingRepository.existsByCodeIgnoreCaseAndIdNot(code, buildingId)) {
            throw new ConflictException("Building code '" + request.code() + "' already exists");
        }

        boolean wasActive = building.isActive();
        building.setName(name);
        building.setCode(code);
        building.setFloors(request.floors());
        building.setActive(Boolean.TRUE.equals(request.active()));
        building.setSortOrder(request.sortOrder());
        Building saved = buildingRepository.save(building);
        String action = !wasActive && saved.isActive()
                ? "RESTORED"
                : wasActive && !saved.isActive() ? "ARCHIVED" : "UPDATED";
        catalogEventStreamService.publish("buildings", action, List.of(saved.getId()));
        auditEventService.record(
                "building." + action.toLowerCase(),
                actor,
                "building",
                String.valueOf(saved.getId()),
                null,
                java.util.Map.of("name", saved.getName(), "code", saved.getCode(), "active", saved.isActive()));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Building requireActiveBuilding(Long buildingId) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new NotFoundException("Building not found"));
        if (!building.isActive()) {
            throw new ConflictException("Building is not active");
        }
        return building;
    }

    private BuildingResponse toResponse(Building b) {
        return new BuildingResponse(
                b.getId(),
                b.getName(),
                b.getCode(),
                b.getFloors(),
                b.isActive(),
                b.getSortOrder(),
                b.getCreatedAt());
    }

    private int resolveSortOrder(Integer requestedSortOrder) {
        if (requestedSortOrder != null) {
            return requestedSortOrder;
        }
        return buildingRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .mapToInt(Building::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private void requireAdmin(User actor) {
        if (actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("ADMIN role is required");
        }
    }

    private void requireOperationalUser(User actor) {
        if (actor.getRole() != Role.ADMIN && actor.getRole() != Role.MAINTENANCE) {
            throw new ForbiddenException("ADMIN or MAINTENANCE role is required");
        }
    }
}
