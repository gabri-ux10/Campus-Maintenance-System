package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.EmailOutbox;
import com.smartcampus.maintenance.entity.enums.EmailOutboxStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailOutboxRepository extends JpaRepository<EmailOutbox, Long> {

    List<EmailOutbox> findByStatusAndNextAttemptAtLessThanEqualOrderByCreatedAtAsc(
            EmailOutboxStatus status,
            LocalDateTime now,
            Pageable pageable);

    long deleteByStatusAndCreatedAtBefore(EmailOutboxStatus status, LocalDateTime cutoff);
}
