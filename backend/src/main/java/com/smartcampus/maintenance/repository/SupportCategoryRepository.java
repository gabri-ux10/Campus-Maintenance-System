package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.SupportCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportCategoryRepository extends JpaRepository<SupportCategory, Long> {

    List<SupportCategory> findAllByOrderBySortOrderAscLabelAsc();

    List<SupportCategory> findByActiveTrueOrderBySortOrderAscLabelAsc();

    boolean existsByLabelIgnoreCase(String label);

    boolean existsByLabelIgnoreCaseAndIdNot(String label, Long id);
}
