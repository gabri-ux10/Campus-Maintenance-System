package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.repository.StaffInviteRepository;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class StaffInviteCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(StaffInviteCleanupScheduler.class);

    private final StaffInviteRepository staffInviteRepository;
    private final long usedTokenRetentionHours;

    public StaffInviteCleanupScheduler(
            StaffInviteRepository staffInviteRepository,
            @Value("${app.auth.used-token-retention-hours:24}") long usedTokenRetentionHours) {
        this.staffInviteRepository = staffInviteRepository;
        this.usedTokenRetentionHours = usedTokenRetentionHours;
    }

    @Scheduled(cron = "${app.auth.staff-invite-cleanup-cron:0 35 * * * *}")
    @Transactional
    public void cleanupInvites() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime usedCutoff = now.minusHours(Math.max(0, usedTokenRetentionHours));

        long removedExpired = staffInviteRepository.deleteByExpiresAtBefore(now);
        long removedUsed = staffInviteRepository.deleteByUsedTrueAndAcceptedAtBefore(usedCutoff);
        long total = removedExpired + removedUsed;
        if (total > 0) {
            log.info("Staff invite cleanup removed {} record(s) (expired {}, used {}).",
                    total, removedExpired, removedUsed);
        }
    }
}
