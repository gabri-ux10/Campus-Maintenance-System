package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.entity.Ticket;
import com.smartcampus.maintenance.exception.ForbiddenException;
import com.smartcampus.maintenance.util.FileStorageService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class TicketAttachmentAccessService {

    public enum AttachmentType {
        BEFORE("before"),
        AFTER("after");

        private final String pathSegment;

        AttachmentType(String pathSegment) {
            this.pathSegment = pathSegment;
        }

        public String pathSegment() {
            return pathSegment;
        }

        public static AttachmentType fromPathSegment(String value) {
            for (AttachmentType type : values()) {
                if (type.pathSegment.equalsIgnoreCase(value)) {
                    return type;
                }
            }
            throw new ForbiddenException("Attachment access is invalid or has expired.");
        }
    }

    private final FileStorageService fileStorageService;
    private final byte[] signingKey;
    private final long ttlSeconds;

    public TicketAttachmentAccessService(
            FileStorageService fileStorageService,
            @Value("${app.upload.signing-secret:${jwt.secret}}") String signingSecret,
            @Value("${app.upload.signed-url-ttl-seconds:300}") long ttlSeconds) {
        this.fileStorageService = fileStorageService;
        this.signingKey = signingSecret.getBytes(StandardCharsets.UTF_8);
        this.ttlSeconds = Math.max(30, ttlSeconds);
    }

    public String buildSignedUrl(Ticket ticket, AttachmentType type, String storedPath) {
        String canonicalReference = fileStorageService.canonicalStoredReference(storedPath);
        if (!StringUtils.hasText(canonicalReference) || ticket == null || ticket.getId() == null) {
            return null;
        }
        long expiresAt = Instant.now().plusSeconds(ttlSeconds).getEpochSecond();
        String signature = sign(ticket.getId(), type, canonicalReference, expiresAt);
        return "/api/tickets/%d/attachments/%s?expires=%d&signature=%s".formatted(
                ticket.getId(),
                type.pathSegment(),
                expiresAt,
                signature);
    }

    public void validate(Ticket ticket, AttachmentType type, String storedPath, Long expiresAt, String signature) {
        String canonicalReference = fileStorageService.canonicalStoredReference(storedPath);
        if (ticket == null
                || ticket.getId() == null
                || !StringUtils.hasText(canonicalReference)
                || expiresAt == null
                || expiresAt <= Instant.now().getEpochSecond()
                || !StringUtils.hasText(signature)) {
            throw new ForbiddenException("Attachment access is invalid or has expired.");
        }

        String expected = sign(ticket.getId(), type, canonicalReference, expiresAt);
        boolean valid = MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                signature.trim().getBytes(StandardCharsets.UTF_8));
        if (!valid) {
            throw new ForbiddenException("Attachment access is invalid or has expired.");
        }
    }

    private String sign(Long ticketId, AttachmentType type, String canonicalReference, long expiresAt) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(signingKey, "HmacSHA256"));
            byte[] digest = mac.doFinal(
                    ("%d:%s:%s:%d".formatted(ticketId, type.pathSegment(), canonicalReference, expiresAt))
                            .getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to sign ticket attachment URL", ex);
        }
    }
}
