package com.smartcampus.maintenance.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class EmailOutboxScheduler {

    private static final Logger log = LoggerFactory.getLogger(EmailOutboxScheduler.class);

    private final EmailOutboxService emailOutboxService;

    public EmailOutboxScheduler(EmailOutboxService emailOutboxService) {
        this.emailOutboxService = emailOutboxService;
    }

    @Scheduled(fixedDelayString = "${app.email.outbox.process-fixed-delay-ms:15000}")
    public void processPendingEmails() {
        int processed = emailOutboxService.processPendingBatch();
        if (processed > 0) {
            log.info("Processed {} email(s) from outbox.", processed);
        }
    }

    @Scheduled(cron = "${app.email.outbox.cleanup-cron:0 25 * * * *}")
    public void cleanupSentEmails() {
        long removed = emailOutboxService.cleanupSentHistory();
        if (removed > 0) {
            log.info("Removed {} sent email outbox record(s).", removed);
        }
    }
}
