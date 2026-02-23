package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.announcement.AnnouncementCreateRequest;
import com.smartcampus.maintenance.dto.announcement.AnnouncementResponse;
import com.smartcampus.maintenance.entity.Announcement;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.entity.enums.NotificationType;
import com.smartcampus.maintenance.entity.enums.Role;
import com.smartcampus.maintenance.exception.ForbiddenException;
import com.smartcampus.maintenance.exception.NotFoundException;
import com.smartcampus.maintenance.repository.AnnouncementRepository;
import com.smartcampus.maintenance.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final NotificationDispatchService notificationDispatchService;

    public AnnouncementService(
            AnnouncementRepository announcementRepository,
            UserRepository userRepository,
            NotificationDispatchService notificationDispatchService) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.notificationDispatchService = notificationDispatchService;
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getActiveAnnouncements() {
        return announcementRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements(User actor) {
        requireAdmin(actor);
        return announcementRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AnnouncementResponse create(User actor, AnnouncementCreateRequest request) {
        requireAdmin(actor);
        Announcement a = new Announcement();
        a.setTitle(request.title().trim());
        a.setContent(request.content().trim());
        a.setCreatedBy(actor);
        Announcement saved = announcementRepository.save(a);
        User adminActor = actor;
        Long actorId = adminActor.getId();
        String preview = saved.getContent().length() > 400 ? saved.getContent().substring(0, 400) + "..." : saved.getContent();
        userRepository.findAll().stream()
                .filter(user -> user.getId() != null && !user.getId().equals(actorId))
                .forEach(user -> notificationDispatchService.notifyUser(
                        user,
                        "New announcement: " + saved.getTitle(),
                        preview,
                        NotificationType.ANNOUNCEMENT,
                        "/announcements"));
        return toResponse(saved);
    }

    @Transactional
    public void toggleActive(Long id, User actor) {
        requireAdmin(actor);
        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Announcement not found"));
        a.setActive(!a.isActive());
        announcementRepository.save(a);
    }

    private AnnouncementResponse toResponse(Announcement a) {
        return new AnnouncementResponse(
                a.getId(), a.getTitle(), a.getContent(), a.isActive(),
                a.getCreatedBy().getUsername(), a.getCreatedBy().getFullName(),
                a.getCreatedAt());
    }

    private void requireAdmin(User actor) {
        if (actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("ADMIN role is required");
        }
    }
}
