package com.smartcampus.maintenance.controller;

import com.smartcampus.maintenance.dto.support.SupportContactRequest;
import com.smartcampus.maintenance.dto.support.SupportContactResponse;
import com.smartcampus.maintenance.service.PublicEndpointSecurityService;
import com.smartcampus.maintenance.service.RequestMetadata;
import com.smartcampus.maintenance.service.RequestMetadataResolver;
import com.smartcampus.maintenance.service.SupportRequestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicSupportController {

    private final SupportRequestService supportRequestService;
    private final PublicEndpointSecurityService publicEndpointSecurityService;
    private final RequestMetadataResolver requestMetadataResolver;

    public PublicSupportController(
            SupportRequestService supportRequestService,
            PublicEndpointSecurityService publicEndpointSecurityService,
            RequestMetadataResolver requestMetadataResolver) {
        this.supportRequestService = supportRequestService;
        this.publicEndpointSecurityService = publicEndpointSecurityService;
        this.requestMetadataResolver = requestMetadataResolver;
    }

    @PostMapping("/contact-support")
    @ResponseStatus(HttpStatus.CREATED)
    public SupportContactResponse submitSupportRequest(@Valid @RequestBody SupportContactRequest request,
            HttpServletRequest servletRequest) {
        RequestMetadata metadata = requestMetadataResolver.resolve(servletRequest);
        publicEndpointSecurityService.guardSupport(request.email(), request.captchaToken(), metadata);
        return supportRequestService.submit(request, metadata);
    }
}
