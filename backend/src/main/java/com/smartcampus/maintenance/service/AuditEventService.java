package com.smartcampus.maintenance.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.maintenance.entity.AuditEvent;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.repository.AuditEventRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditEventService {

    private final AuditEventRepository auditEventRepository;
    private final ObjectMapper objectMapper;

    public AuditEventService(AuditEventRepository auditEventRepository, ObjectMapper objectMapper) {
        this.auditEventRepository = auditEventRepository;
        this.objectMapper = objectMapper;
    }

    public void record(String action, User actor, String targetType, String targetId, RequestMetadata metadata, Object details) {
        AuditEvent event = new AuditEvent();
        if (actor != null) {
            event.setActorUser(actor);
            event.setActorUsername(actor.getUsername());
            event.setActorRole(actor.getRole().name());
        }
        event.setAction(action);
        event.setTargetType(targetType);
        event.setTargetId(targetId);
        if (metadata != null) {
            event.setIpAddress(metadata.ipAddress());
            event.setUserAgent(metadata.userAgent());
        }
        event.setDetailsJson(serializeDetails(details));
        auditEventRepository.save(event);
    }

    private String serializeDetails(Object details) {
        if (details == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException ex) {
            return "{\"error\":\"details_serialization_failed\"}";
        }
    }
}
