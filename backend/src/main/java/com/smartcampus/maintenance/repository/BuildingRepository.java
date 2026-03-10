package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.Building;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    List<Building> findByActiveTrueOrderBySortOrderAscNameAsc();

    List<Building> findAllByOrderBySortOrderAscNameAsc();

    Optional<Building> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
