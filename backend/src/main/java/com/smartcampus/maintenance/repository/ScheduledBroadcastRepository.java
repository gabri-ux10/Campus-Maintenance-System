package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.ScheduledBroadcast;
import com.smartcampus.maintenance.entity.enums.ScheduledBroadcastStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduledBroadcastRepository extends JpaRepository<ScheduledBroadcast, Long> {

    List<ScheduledBroadcast> findAllByOrderByScheduledForAscCreatedAtAsc();

    List<ScheduledBroadcast> findByStatusAndScheduledForLessThanEqualOrderByScheduledForAsc(
            ScheduledBroadcastStatus status,
            LocalDateTime scheduledFor);
}
