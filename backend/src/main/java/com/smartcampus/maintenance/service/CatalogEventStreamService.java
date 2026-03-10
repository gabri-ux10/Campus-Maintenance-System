package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.catalog.CatalogStreamEvent;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class CatalogEventStreamService {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final AtomicLong versionCounter = new AtomicLong();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(ignored -> emitters.remove(emitter));
        send(emitter, new CatalogStreamEvent("catalog", versionCounter.get(), "CONNECTED", List.of(), LocalDateTime.now()));
        return emitter;
    }

    public void publish(String resource, String action, List<Long> changedIds) {
        CatalogStreamEvent event = new CatalogStreamEvent(
                resource,
                versionCounter.incrementAndGet(),
                action,
                changedIds == null ? List.of() : changedIds,
                LocalDateTime.now());
        emitters.forEach(emitter -> send(emitter, event));
    }

    private void send(SseEmitter emitter, CatalogStreamEvent event) {
        try {
            emitter.send(SseEmitter.event().name("catalog").data(event));
        } catch (IOException ex) {
            emitter.complete();
            emitters.remove(emitter);
        }
    }
}
