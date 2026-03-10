package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.user.BroadcastAudience;
import com.smartcampus.maintenance.dto.user.ScheduledBroadcastCreateRequest;
import com.smartcampus.maintenance.dto.user.ScheduledBroadcastResponse;
import com.smartcampus.maintenance.entity.ScheduledBroadcast;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.entity.enums.NotificationType;
import com.smartcampus.maintenance.entity.enums.Role;
import com.smartcampus.maintenance.entity.enums.ScheduledBroadcastStatus;
import com.smartcampus.maintenance.exception.BadRequestException;
import com.smartcampus.maintenance.exception.ForbiddenException;
import com.smartcampus.maintenance.exception.NotFoundException;
import com.smartcampus.maintenance.repository.ScheduledBroadcastRepository;
import com.smartcampus.maintenance.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduledBroadcastService {

    private static final Logger log = LoggerFactory.getLogger(ScheduledBroadcastService.class);

    private final ScheduledBroadcastRepository scheduledBroadcastRepository;
    private final UserRepository userRepository;
    private final NotificationDispatchService notificationDispatchService;

    public ScheduledBroadcastService(
            ScheduledBroadcastRepository scheduledBroadcastRepository,
            UserRepository userRepository,
            NotificationDispatchService notificationDispatchService) {
        this.scheduledBroadcastRepository = scheduledBroadcastRepository;
        this.userRepository = userRepository;
        this.notificationDispatchService = notificationDispatchService;
    }

    @Transactional
    public ScheduledBroadcastResponse schedule(User actor, ScheduledBroadcastCreateRequest request) {
        requireAdmin(actor);
        LocalDateTime now = LocalDateTime.now();
        if (request.scheduledFor().isBefore(now.plusMinutes(1))) {
            throw new BadRequestException("Scheduled date/time must be at least 1 minute in the future.");
        }

        ScheduledBroadcast scheduled = new ScheduledBroadcast();
        scheduled.setTitle(request.title().trim());
        scheduled.setMessage(request.message().trim());
        scheduled.setAudience(request.audience() == null ? BroadcastAudience.ALL : request.audience());
        scheduled.setScheduledFor(request.scheduledFor());
        scheduled.setStatus(ScheduledBroadcastStatus.PENDING);
        scheduled.setCreatedBy(actor);

        return toResponse(scheduledBroadcastRepository.save(scheduled));
    }

    @Transactional(readOnly = true)
    public List<ScheduledBroadcastResponse> list(User actor) {
        requireAdmin(actor);
        return scheduledBroadcastRepository.findAllByOrderByScheduledForAscCreatedAtAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ScheduledBroadcastResponse cancel(User actor, Long scheduledId) {
        requireAdmin(actor);
        ScheduledBroadcast scheduled = scheduledBroadcastRepository.findById(scheduledId)
                .orElseThrow(() -> new NotFoundException("Scheduled broadcast not found."));

        if (scheduled.getStatus() != ScheduledBroadcastStatus.PENDING) {
            throw new BadRequestException("Only pending scheduled broadcasts can be cancelled.");
        }

        scheduled.setStatus(ScheduledBroadcastStatus.CANCELLED);
        return toResponse(scheduledBroadcastRepository.save(scheduled));
    }

    @Transactional
    public int dispatchDueScheduledBroadcasts() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledBroadcast> dueItems = scheduledBroadcastRepository
                .findByStatusAndScheduledForLessThanEqualOrderByScheduledForAsc(
                        ScheduledBroadcastStatus.PENDING,
                        now);

        int sentCount = 0;
        for (ScheduledBroadcast scheduled : dueItems) {
            List<User> recipients = resolveRecipients(scheduled.getAudience(), scheduled.getCreatedBy());

            notificationDispatchService.notifyUsers(
                    recipients,
                    "Scheduled Event: " + scheduled.getTitle(),
                    scheduled.getMessage(),
                    NotificationType.ANNOUNCEMENT,
                    "/announcements");

            scheduled.setStatus(ScheduledBroadcastStatus.SENT);
            scheduled.setSentAt(now);
            scheduled.setRecipientCount(recipients.size());
            scheduledBroadcastRepository.save(scheduled);
            sentCount++;
        }

        if (sentCount > 0) {
            log.info("Dispatched {} scheduled broadcast(s).", sentCount);
        }
        return sentCount;
    }

    private List<User> resolveRecipients(BroadcastAudience audience, User actor) {
        List<User> rawRecipients = switch (audience) {
            case ALL -> userRepository.findAll();
            case STUDENTS -> userRepository.findByRole(Role.STUDENT);
            case STAFF -> Stream.concat(
                    userRepository.findByRole(Role.ADMIN).stream(),
                    userRepository.findByRole(Role.MAINTENANCE).stream()).toList();
        };

        return rawRecipients.stream()
                .filter(user -> user.getId() != null && (actor == null || !user.getId().equals(actor.getId())))
                .toList();
    }

    private ScheduledBroadcastResponse toResponse(ScheduledBroadcast scheduled) {
        return new ScheduledBroadcastResponse(
                scheduled.getId(),
                scheduled.getTitle(),
                scheduled.getMessage(),
                scheduled.getAudience().name(),
                scheduled.getStatus().name(),
                scheduled.getScheduledFor(),
                scheduled.getRecipientCount(),
                scheduled.getCreatedAt(),
                scheduled.getSentAt());
    }

    private void requireAdmin(User actor) {
        if (actor == null || actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("ADMIN role is required");
        }
    }
}
