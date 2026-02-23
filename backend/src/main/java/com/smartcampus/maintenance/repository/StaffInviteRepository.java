package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.StaffInvite;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffInviteRepository extends JpaRepository<StaffInvite, Long> {

    Optional<StaffInvite> findByTokenHashAndUsedFalse(String tokenHash);

    boolean existsByUsernameIgnoreCaseAndUsedFalse(String username);

    boolean existsByEmailIgnoreCaseAndUsedFalse(String email);

    long deleteByExpiresAtBefore(LocalDateTime cutoff);

    long deleteByUsedTrueAndAcceptedAtBefore(LocalDateTime cutoff);
}
