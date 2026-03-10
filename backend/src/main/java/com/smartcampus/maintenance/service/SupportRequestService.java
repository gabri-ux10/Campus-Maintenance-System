package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.support.SupportContactRequest;
import com.smartcampus.maintenance.dto.support.SupportContactResponse;
import com.smartcampus.maintenance.entity.SupportRequest;
import com.smartcampus.maintenance.entity.SupportCategory;
import com.smartcampus.maintenance.repository.SupportRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final CatalogService catalogService;
    private final EmailService emailService;
    private final AuditEventService auditEventService;

    public SupportRequestService(
            SupportRequestRepository supportRequestRepository,
            CatalogService catalogService,
            EmailService emailService,
            AuditEventService auditEventService) {
        this.supportRequestRepository = supportRequestRepository;
        this.catalogService = catalogService;
        this.emailService = emailService;
        this.auditEventService = auditEventService;
    }

    @Transactional
    public SupportContactResponse submit(SupportContactRequest request, RequestMetadata metadata) {
        SupportCategory supportCategory = catalogService.requireActiveSupportCategory(request.supportCategoryId());
        SupportRequest entity = new SupportRequest();
        entity.setFullName(request.fullName().trim());
        entity.setEmail(request.email().trim());
        entity.setSupportCategory(supportCategory);
        entity.setCategory(supportCategory.getLabel());
        entity.setSubject(request.subject().trim());
        entity.setMessage(request.message().trim());

        SupportRequest saved = supportRequestRepository.save(entity);

        emailService.sendSupportRequestEmail(
            saved.getFullName(),
            saved.getEmail(),
            saved.getCategory(),
            saved.getSubject(),
            saved.getMessage()
        );
        auditEventService.record(
                "support.request.created",
                null,
                "support_request",
                String.valueOf(saved.getId()),
                metadata,
                java.util.Map.of(
                        "email", saved.getEmail(),
                        "category", saved.getCategory()));

        return new SupportContactResponse(saved.getId(), "Support request submitted successfully.");
    }
}
