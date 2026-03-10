package com.smartcampus.maintenance;

import static org.assertj.core.api.Assertions.assertThat;

import com.smartcampus.maintenance.dto.auth.RegisterRequest;
import com.smartcampus.maintenance.entity.EmailOutbox;
import com.smartcampus.maintenance.entity.EmailVerificationToken;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.repository.EmailOutboxRepository;
import com.smartcampus.maintenance.repository.EmailVerificationTokenRepository;
import com.smartcampus.maintenance.repository.UserRepository;
import com.smartcampus.maintenance.service.AuthService;
import com.smartcampus.maintenance.service.RequestMetadata;
import java.util.Comparator;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = "app.email.enabled=true")
@Transactional
class RegistrationEmailOutboxIntegrationTest {

    private static final RequestMetadata TEST_METADATA = new RequestMetadata("127.0.0.1", "JUnit");

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailOutboxRepository emailOutboxRepository;

    @Test
    void registerStudentQueuesVerificationEmailWhenEmailOutboxIsEnabled() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        RegisterRequest request = new RegisterRequest(
                "student_" + suffix,
                "student_" + suffix + "@example.com",
                "Student " + suffix,
                "StrongPass#123",
                "");

        authService.registerStudent(request, TEST_METADATA);

        User user = userRepository.findByUsername(request.username()).orElseThrow();
        EmailVerificationToken token = verificationTokenRepository
                .findTopByUser_IdAndUsedFalseOrderByCreatedAtDesc(user.getId())
                .orElseThrow();
        EmailOutbox queuedMessage = emailOutboxRepository.findAll().stream()
                .filter(message -> request.email().equals(message.getToEmail()))
                .max(Comparator.comparing(EmailOutbox::getId))
                .orElseThrow();

        assertThat(user.isEmailVerified()).isFalse();
        assertThat(token.getCode()).hasSize(6);
        assertThat(queuedMessage.getToEmail()).isEqualTo(request.email());
        assertThat(queuedMessage.getSubject()).contains("Verify Your Email");
        assertThat(queuedMessage.getPlainTextBody()).contains(token.getCode());
        assertThat(queuedMessage.getHtmlBody()).contains("CampusFix");
    }
}
