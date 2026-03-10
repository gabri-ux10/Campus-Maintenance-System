package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.ServiceDomain;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceDomainRepository extends JpaRepository<ServiceDomain, Long> {

    List<ServiceDomain> findAllByOrderBySortOrderAscLabelAsc();

    Optional<ServiceDomain> findByKeyIgnoreCase(String key);
}
