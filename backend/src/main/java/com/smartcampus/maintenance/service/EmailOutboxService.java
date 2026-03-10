package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.entity.EmailOutbox;
import com.smartcampus.maintenance.entity.enums.EmailOutboxStatus;
import com.smartcampus.maintenance.repository.EmailOutboxRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class EmailOutboxService {

    private static final Logger log = LoggerFactory.getLogger(EmailOutboxService.class);

    private final EmailOutboxRepository emailOutboxRepository;
    private final EmailDeliveryService emailDeliveryService;
    private final boolean emailEnabled;
    private final int batchSize;
    private final int maxAttempts;
    private final long retentionDays;

    public EmailOutboxService(
            EmailOutboxRepository emailOutboxRepository,
            EmailDeliveryService emailDeliveryService,
            @Value("${app.email.enabled:false}") boolean emailEnabled,
            @Value("${app.email.outbox.batch-size:20}") int batchSize,
            @Value("${app.email.outbox.max-attempts:6}") int maxAttempts,
            @Value("${app.email.outbox.sent-retention-days:14}") long retentionDays) {
        this.emailOutboxRepository = emailOutboxRepository;
        this.emailDeliveryService = emailDeliveryService;
        this.emailEnabled = emailEnabled;
        this.batchSize = Math.max(1, batchSize);
        this.maxAttempts = Math.max(1, maxAttempts);
        this.retentionDays = Math.max(1, retentionDays);
    }

    @Transactional
    public void enqueue(String toEmail, String subject, String plainText, String htmlBody) {
        if (!StringUtils.hasText(toEmail) || !StringUtils.hasText(subject) || !StringUtils.hasText(plainText)) {
            log.warn("Skipping email outbox enqueue due to missing required fields. To={}, Subject={}", toEmail, subject);
            return;
        }
        if (!emailEnabled) {
            log.info(
                    "[EMAIL STUB] To: {}, Subject: {}, PlainTextChars: {}, HtmlIncluded: {}",
                    toEmail,
                    subject,
                    plainText.length(),
                    StringUtils.hasText(htmlBody));
            return;
        }
        EmailOutbox message = new EmailOutbox();
        message.setToEmail(toEmail.trim());
        message.setSubject(subject.trim());
        message.setPlainTextBody(plainText);
        message.setHtmlBody(StringUtils.hasText(htmlBody) ? htmlBody : null);
        emailOutboxRepository.save(message);
    }

    @Transactional
    public int processPendingBatch() {
        if (!emailEnabled) {
            return 0;
        }
        List<EmailOutbox> pending = emailOutboxRepository
                .findByStatusAndNextAttemptAtLessThanEqualOrderByCreatedAtAsc(
                        EmailOutboxStatus.PENDING,
                        LocalDateTime.now(),
                        PageRequest.of(0, batchSize));

        for (EmailOutbox message : pending) {
            deliver(message);
        }
        return pending.size();
    }

    @Transactional
    public long cleanupSentHistory() {
        return emailOutboxRepository.deleteByStatusAndCreatedAtBefore(
                EmailOutboxStatus.SENT,
                LocalDateTime.now().minusDays(retentionDays));
    }

    private void deliver(EmailOutbox message) {
        message.setLastAttemptAt(LocalDateTime.now());
        message.setAttemptCount(message.getAttemptCount() + 1);
        try {
            emailDeliveryService.send(
                    message.getToEmail(),
                    message.getSubject(),
                    message.getPlainTextBody(),
                    message.getHtmlBody());
            message.setStatus(EmailOutboxStatus.SENT);
            message.setSentAt(LocalDateTime.now());
            message.setLastError(null);
            message.setNextAttemptAt(LocalDateTime.now());
        } catch (RuntimeException ex) {
            int attempt = message.getAttemptCount();
            message.setLastError(safeError(ex.getMessage()));
            if (attempt >= maxAttempts) {
                message.setStatus(EmailOutboxStatus.FAILED);
                message.setNextAttemptAt(LocalDateTime.now());
                log.error("Email outbox message {} failed permanently after {} attempts", message.getId(), attempt);
            } else {
                long backoffMinutes = Math.min(60, 1L << Math.min(6, attempt));
                message.setNextAttemptAt(LocalDateTime.now().plusMinutes(backoffMinutes));
                log.warn("Email outbox message {} failed attempt {}. Retrying in {} minute(s).",
                        message.getId(), attempt, backoffMinutes);
            }
        }
        emailOutboxRepository.save(message);
    }

    private String safeError(String message) {
        if (!StringUtils.hasText(message)) {
            return "Unknown email delivery error";
        }
        return message.length() > 500 ? message.substring(0, 500) : message;
    }
}
