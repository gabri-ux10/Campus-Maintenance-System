package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.entity.enums.NotificationType;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class NotificationDispatchService {

    private final NotificationService notificationService;

    public NotificationDispatchService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void notifyUser(User user, String title, String message, NotificationType type, String linkUrl) {
        if (user == null) {
            return;
        }
        notificationService.notify(user, title, message, type, linkUrl);
    }

    public void notifyUsers(Collection<User> users, String title, String message, NotificationType type, String linkUrl) {
        if (users == null || users.isEmpty()) {
            return;
        }
        Set<Long> seen = new LinkedHashSet<>();
        for (User user : users) {
            if (user == null || user.getId() == null || !seen.add(user.getId())) {
                continue;
            }
            notificationService.notify(user, title, message, type, linkUrl);
        }
    }
}
