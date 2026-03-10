package com.smartcampus.maintenance.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ScheduledBroadcastDispatcher {

    private final ScheduledBroadcastService scheduledBroadcastService;

    public ScheduledBroadcastDispatcher(ScheduledBroadcastService scheduledBroadcastService) {
        this.scheduledBroadcastService = scheduledBroadcastService;
    }

    @Scheduled(fixedDelayString = "${app.broadcast.schedule-dispatch-fixed-delay-ms:30000}")
    @Transactional
    public void dispatchDueScheduledBroadcasts() {
        scheduledBroadcastService.dispatchDueScheduledBroadcasts();
    }
}
