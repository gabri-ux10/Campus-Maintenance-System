package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
}
