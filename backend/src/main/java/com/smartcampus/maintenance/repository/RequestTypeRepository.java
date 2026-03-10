package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.RequestType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestTypeRepository extends JpaRepository<RequestType, Long> {

    List<RequestType> findAllByOrderByServiceDomainSortOrderAscServiceDomainLabelAscSortOrderAscLabelAsc();

    List<RequestType> findByActiveTrueOrderByServiceDomainSortOrderAscServiceDomainLabelAscSortOrderAscLabelAsc();

    List<RequestType> findByServiceDomain_KeyIgnoreCaseAndActiveTrueOrderBySortOrderAscLabelAsc(String serviceDomainKey);

    @EntityGraph(attributePaths = "serviceDomain")
    Optional<RequestType> findFirstByServiceDomain_KeyIgnoreCaseOrderBySortOrderAscIdAsc(String serviceDomainKey);

    boolean existsByServiceDomain_IdAndLabelIgnoreCase(Long serviceDomainId, String label);

    boolean existsByServiceDomain_IdAndLabelIgnoreCaseAndIdNot(Long serviceDomainId, String label, Long id);
}
