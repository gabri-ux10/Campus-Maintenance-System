# Campus Maintenance System - Full Project Documentation

Generated on: **2026-02-26 12:36:18**

## Scope
- This document covers all detected project code files (`.java`, `.js`, `.jsx`, `.ts`, `.tsx`, `.cpp`, `.c`, `.h`, `.hpp`, `.sql`).
- For each file, the document lists purpose and detected functions/methods/classes.

## Project Modules
- `backend/`: Spring Boot API, business logic, repositories, entities, security, schedulers.
- `frontend/`: React + Vite web app, dashboards, hooks, services, utility modules.
- `database/`: SQL schema and seed scripts.
- `cpp-optimization/`: Native optimization routines used for algorithm/compression support.
- `tests/`: Integration and E2E flows.

## Code Inventory
- `cpp`: 3 file(s)
- `h`: 3 file(s)
- `java`: 141 file(s)
- `js`: 30 file(s)
- `jsx`: 30 file(s)
- `sql`: 2 file(s)

## File-by-File Function Documentation

### `backend/src/main/java/com/smartcampus/maintenance/SmartCampusMaintenanceApplication.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance`
- Types and Methods:
  - `class SmartCampusMaintenanceApplication`
    - Methods:
      - `public static void main(String[] args)`

### `backend/src/main/java/com/smartcampus/maintenance/config/DataSeeder.java`
- Language: `java`
- Purpose: Application/configuration code
- Package: `com.smartcampus.maintenance.config`
- Types and Methods:
  - `class DataSeeder`
    - Methods:
      - `CommandLineRunner seedData(UserRepository userRepository, TicketRepository ticketRepository, TicketLogRepository ticketLogRepository, TicketRatingRepository ticketRatingRepository, NotificationRepository notificationRepository, PasswordEncoder passwordEncoder, boolean seedDemoData, String adminUsername, String adminEmail, String adminFullName, String adminPassword, String demoPassword)`
      - `private User createUser(UserRepository userRepository, PasswordEncoder encoder, String username, String email, String fullName, Role role, String rawPassword)`
      - `private User ensureAdminUser(UserRepository userRepository, PasswordEncoder encoder, String adminUsername, String adminEmail, String adminFullName, String adminPassword)`
      - `private void addLog(TicketLogRepository ticketLogRepository, Ticket ticket, TicketStatus oldStatus, TicketStatus newStatus, User actor, String note)`
      - `private void addRating(TicketRatingRepository ticketRatingRepository, Ticket ticket, User ratedBy, int stars, String comment)`
      - `private void seedNotification(NotificationRepository notificationRepository, User user, String title, String message, NotificationType type, String linkUrl)`
      - `private void transition(TicketRepository ticketRepository, TicketLogRepository ticketLogRepository, Ticket ticket, TicketStatus target, User actor, String note)`
      - `protected Ticket seedTicket(TicketRepository ticketRepository, TicketLogRepository ticketLogRepository, User createdBy, User assignedTo, User adminActor, User maintenanceActor, String title, String description, TicketCategory category, String building, String location, UrgencyLevel urgency, LocalDateTime createdAt, TicketStatus finalStatus)`

### `backend/src/main/java/com/smartcampus/maintenance/config/SecurityConfig.java`
- Language: `java`
- Purpose: Application/configuration code
- Package: `com.smartcampus.maintenance.config`
- Types and Methods:
  - `class SecurityConfig`
    - Constructors:
      - `public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomUserDetailsService userDetailsService, ObjectMapper objectMapper)`
    - Methods:
      - `public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)`
      - `public AuthenticationProvider authenticationProvider()`
      - `public CorsConfigurationSource corsConfigurationSource()`
      - `public PasswordEncoder passwordEncoder()`
      - `public SecurityFilterChain securityFilterChain(HttpSecurity http)`

### `backend/src/main/java/com/smartcampus/maintenance/config/WebConfig.java`
- Language: `java`
- Purpose: Application/configuration code
- Package: `com.smartcampus.maintenance.config`
- Types and Methods:
  - `class WebConfig`
    - Methods:
      - `public void addResourceHandlers(ResourceHandlerRegistry registry)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/AnalyticsController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class AnalyticsController`
    - Constructors:
      - `public AnalyticsController(AnalyticsService analyticsService, PublicLandingConfigService publicLandingConfigService, SlaService slaService, ReportService reportService, CurrentUserService currentUserService)`
    - Methods:
      - `public AnalyticsSummaryResponse getSummary()`
      - `public List<CrewPerformanceResponse> getCrewPerformance()`
      - `public List<TopBuildingResponse> getTopBuildings()`
      - `public PublicLandingConfigResponse getPublicConfig()`
      - `public PublicLandingStatsResponse getPublicSummary()`
      - `public ResolutionTimeResponse getResolutionTime()`
      - `public ResponseEntity<byte[]> exportCsv()`
      - `public SlaComplianceResponse getSlaCompliance()`

### `backend/src/main/java/com/smartcampus/maintenance/controller/AnnouncementController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class AnnouncementController`
    - Constructors:
      - `public AnnouncementController(AnnouncementService announcementService, CurrentUserService currentUserService)`
    - Methods:
      - `public AnnouncementResponse create(AnnouncementCreateRequest request)`
      - `public List<AnnouncementResponse> getAllAnnouncements()`
      - `public List<AnnouncementResponse> getAnnouncements()`
      - `public void toggleActive(Long id)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/AuthController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class AuthController`
    - Constructors:
      - `public AuthController(AuthService authService)`
    - Methods:
      - `public AuthResponse login(LoginRequest request)`
      - `public Map<String, String> acceptStaffInvite(AcceptStaffInviteRequest request)`
      - `public Map<String, String> forgotPassword(ForgotPasswordRequest request)`
      - `public Map<String, String> register(RegisterRequest request)`
      - `public Map<String, String> resendVerification(ResendVerificationRequest request)`
      - `public Map<String, String> resetPassword(ResetPasswordRequest request)`
      - `public Map<String, String> verifyEmail(VerifyEmailRequest request)`
      - `public UsernameSuggestionsResponse getUsernameSuggestions(String username, String fullName)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/BuildingController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class BuildingController`
    - Constructors:
      - `public BuildingController(BuildingService buildingService, CurrentUserService currentUserService)`
    - Methods:
      - `public BuildingResponse createBuilding(BuildingCreateRequest request)`
      - `public List<BuildingResponse> getBuildings()`

### `backend/src/main/java/com/smartcampus/maintenance/controller/ChatController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class ChatController`
    - Constructors:
      - `public ChatController(ChatService chatService, CurrentUserService currentUserService)`
    - Methods:
      - `public ChatMessageResponse sendMessage(Long ticketId, ChatSendRequest request)`
      - `public List<ChatMessageResponse> getMessages(Long ticketId)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/NotificationController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class NotificationController`
    - Constructors:
      - `public NotificationController(NotificationService notificationService, CurrentUserService currentUserService)`
    - Methods:
      - `public List<NotificationResponse> getNotifications()`
      - `public Map<String, Long> getUnreadCount()`
      - `public void markAllRead()`
      - `public void markRead(Long id)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/PublicSupportController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class PublicSupportController`
    - Constructors:
      - `public PublicSupportController(SupportRequestService supportRequestService)`
    - Methods:
      - `public SupportContactResponse submitSupportRequest(SupportContactRequest request)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/TicketController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class TicketController`
    - Constructors:
      - `public TicketController(TicketService ticketService, CurrentUserService currentUserService)`
    - Methods:
      - `public CommentResponse addComment(Long id, CommentCreateRequest request)`
      - `public DuplicateCheckResponse checkDuplicates(TicketCreateRequest request)`
      - `public List<CommentResponse> getComments(Long id)`
      - `public List<TicketLogResponse> getTicketLogs(Long id)`
      - `public List<TicketResponse> getAllTickets(TicketStatus status, TicketCategory category, UrgencyLevel urgency, Long assigneeId, String search)`
      - `public List<TicketResponse> getAssignedTickets()`
      - `public List<TicketResponse> getMyTickets()`
      - `public TicketDetailResponse getTicket(Long id)`
      - `public TicketRatingResponse rateTicket(Long id, TicketRateRequest request)`
      - `public TicketResponse assignTicket(Long id, TicketAssignRequest request)`
      - `public TicketResponse createTicket(TicketCreateRequest request)`
      - `public TicketResponse createTicketWithImage(TicketCreateRequest request, MultipartFile image)`
      - `public TicketResponse updateStatus(Long id, TicketStatusUpdateRequest request)`
      - `public TicketResponse uploadAfterPhoto(Long id, MultipartFile image)`

### `backend/src/main/java/com/smartcampus/maintenance/controller/UserController.java`
- Language: `java`
- Purpose: API/controller logic
- Package: `com.smartcampus.maintenance.controller`
- Types and Methods:
  - `class UserController`
    - Constructors:
      - `public UserController(UserService userService, CurrentUserService currentUserService)`
    - Methods:
      - `public BroadcastMessageResponse broadcastMessage(BroadcastMessageRequest request)`
      - `public List<UserSummaryResponse> getMaintenanceUsers()`
      - `public List<UserWithTicketCountResponse> getUsers()`
      - `public StaffInviteResponse createStaff(StaffInviteRequest request)`
      - `public UserProfileResponse getMyProfile()`
      - `public UserProfileResponse updateMyProfile(UserProfileUpdateRequest request)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/AnalyticsSummaryResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record AnalyticsSummaryResponse(long totalTickets, Map<String, Long> byStatus, Map<String, Long> byCategory, Map<String, Long> byUrgency)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/CategoryResolutionTimeResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record CategoryResolutionTimeResponse(String category, double averageHours, long resolvedTickets)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/CrewPerformanceResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record CrewPerformanceResponse(Long userId, String username, String fullName, long resolvedTickets)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/DailyResolvedPointResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record DailyResolvedPointResponse(String date, long resolvedTickets)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/PublicLandingConfigResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record PublicLandingConfigResponse(String supportHours, String supportPhone, String supportTimezone, int urgentSlaHours, int standardSlaHours)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/PublicLandingStatsResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record PublicLandingStatsResponse(long totalTickets, long resolvedTickets, long openTickets, long resolvedToday, double averageResolutionHours, List<DailyResolvedPointResponse> resolvedLast7Days, LocalDateTime lastUpdatedAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/ResolutionTimeResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record ResolutionTimeResponse(double overallAverageHours, List<CategoryResolutionTimeResponse> byCategory)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/SlaComplianceResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record SlaComplianceResponse(long totalTickets, long onTimeTickets, long breachedTickets, double compliancePercentage, double avgResolutionHours, long criticalSlaHours, long highSlaHours, long mediumSlaHours, long lowSlaHours)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/analytics/TopBuildingResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record TopBuildingResponse(String building, long totalIssues)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/announcement/AnnouncementCreateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/announcement/AnnouncementResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record AnnouncementResponse(Long id, String title, String content, boolean active, String createdByUsername, String createdByFullName, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/AcceptStaffInviteRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/AuthResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record AuthResponse(String token, String username, String fullName, String role)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/ForgotPasswordRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/LoginRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/RegisterRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/ResendVerificationRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/ResetPasswordRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/UsernameSuggestionsResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record UsernameSuggestionsResponse(String requestedUsername, List<String> suggestions)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/auth/VerifyEmailRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/building/BuildingCreateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/building/BuildingResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record BuildingResponse(Long id, String name, String code, int floors, boolean active, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/chat/ChatMessageResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record ChatMessageResponse(Long id, Long ticketId, String senderUsername, String senderFullName, String senderRole, String content, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/chat/ChatSendRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/notification/NotificationResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record NotificationResponse(Long id, String title, String message, String type, boolean read, String linkUrl, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/support/SupportContactRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/support/SupportContactResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record SupportContactResponse(Long requestId, String message)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/CommentCreateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/CommentResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record CommentResponse(Long id, Long ticketId, String authorUsername, String authorFullName, String authorRole, String content, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/DuplicateCheckResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record DuplicateCheckResponse(boolean hasSimilar, List<SimilarTicketSummary> similarTickets, String message)`
      - `record SimilarTicketSummary(Long id, String title, String status, String building, String category)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketAssignRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketCreateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketDetailResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record TicketDetailResponse(TicketResponse ticket, List<TicketLogResponse> logs, TicketRatingResponse rating)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketLogResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record TicketLogResponse(Long id, String oldStatus, String newStatus, String note, TicketUserInfoResponse changedBy, LocalDateTime timestamp)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketRateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketRatingResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record TicketRatingResponse(Integer stars, String comment, TicketUserInfoResponse ratedBy, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record TicketResponse(Long id, String title, String description, String category, String building, String location, String urgency, String status, TicketUserInfoResponse createdBy, TicketUserInfoResponse assignedTo, String imageUrl, String afterImageUrl, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketStatusUpdateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/ticket/TicketUserInfoResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record TicketUserInfoResponse(Long id, String username, String fullName, String role)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/BroadcastAudience.java`
- Language: `java`
- Purpose: Data transfer model
- Package: `com.smartcampus.maintenance.dto.user`
- Types and Methods:
  - `enum BroadcastAudience`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/BroadcastMessageRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/BroadcastMessageResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record BroadcastMessageResponse(String title, String audience, int recipientCount, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/CreateStaffRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/StaffInviteRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/StaffInviteResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record StaffInviteResponse(Long id, String username, String email, String fullName, LocalDateTime expiresAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/UserProfileResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record UserProfileResponse(Long id, String username, String email, String fullName, String role, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/UserProfileUpdateRequest.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/UserSummaryResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record UserSummaryResponse(Long id, String username, String email, String fullName, String role, LocalDateTime createdAt)`

### `backend/src/main/java/com/smartcampus/maintenance/dto/user/UserWithTicketCountResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record UserWithTicketCountResponse(Long id, String username, String email, String fullName, String role, long ticketCount)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/Announcement.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class Announcement`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public String getContent()`
      - `public String getTitle()`
      - `public User getCreatedBy()`
      - `public boolean isActive()`
      - `public void onCreate()`
      - `public void setActive(boolean active)`
      - `public void setContent(String content)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setCreatedBy(User createdBy)`
      - `public void setId(Long id)`
      - `public void setTitle(String title)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/Building.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class Building`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public String getCode()`
      - `public String getName()`
      - `public boolean isActive()`
      - `public int getFloors()`
      - `public void onCreate()`
      - `public void setActive(boolean active)`
      - `public void setCode(String code)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setFloors(int floors)`
      - `public void setId(Long id)`
      - `public void setName(String name)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/ChatMessage.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class ChatMessage`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public String getContent()`
      - `public Ticket getTicket()`
      - `public User getSender()`
      - `public void onCreate()`
      - `public void setContent(String content)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setId(Long id)`
      - `public void setSender(User sender)`
      - `public void setTicket(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/EmailOutbox.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class EmailOutbox`
    - Methods:
      - `public EmailOutboxStatus getStatus()`
      - `public LocalDateTime getCreatedAt()`
      - `public LocalDateTime getLastAttemptAt()`
      - `public LocalDateTime getNextAttemptAt()`
      - `public LocalDateTime getSentAt()`
      - `public Long getId()`
      - `public String getHtmlBody()`
      - `public String getLastError()`
      - `public String getPlainTextBody()`
      - `public String getSubject()`
      - `public String getToEmail()`
      - `public int getAttemptCount()`
      - `public void onCreate()`
      - `public void setAttemptCount(int attemptCount)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setHtmlBody(String htmlBody)`
      - `public void setId(Long id)`
      - `public void setLastAttemptAt(LocalDateTime lastAttemptAt)`
      - `public void setLastError(String lastError)`
      - `public void setNextAttemptAt(LocalDateTime nextAttemptAt)`
      - `public void setPlainTextBody(String plainTextBody)`
      - `public void setSentAt(LocalDateTime sentAt)`
      - `public void setStatus(EmailOutboxStatus status)`
      - `public void setSubject(String subject)`
      - `public void setToEmail(String toEmail)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/EmailVerificationToken.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class EmailVerificationToken`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public LocalDateTime getExpiresAt()`
      - `public Long getId()`
      - `public String getCode()`
      - `public User getUser()`
      - `public boolean isExpired()`
      - `public boolean isUsed()`
      - `public int getAttemptCount()`
      - `public void onCreate()`
      - `public void setAttemptCount(int attemptCount)`
      - `public void setCode(String code)`
      - `public void setExpiresAt(LocalDateTime expiresAt)`
      - `public void setUsed(boolean used)`
      - `public void setUser(User user)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/Notification.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class Notification`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public NotificationType getType()`
      - `public String getLinkUrl()`
      - `public String getMessage()`
      - `public String getTitle()`
      - `public User getUser()`
      - `public boolean isRead()`
      - `public void onCreate()`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setId(Long id)`
      - `public void setLinkUrl(String linkUrl)`
      - `public void setMessage(String message)`
      - `public void setRead(boolean read)`
      - `public void setTitle(String title)`
      - `public void setType(NotificationType type)`
      - `public void setUser(User user)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/PasswordResetToken.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class PasswordResetToken`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public LocalDateTime getExpiresAt()`
      - `public Long getId()`
      - `public String getToken()`
      - `public User getUser()`
      - `public boolean isExpired()`
      - `public boolean isUsed()`
      - `public void onCreate()`
      - `public void setExpiresAt(LocalDateTime expiresAt)`
      - `public void setId(Long id)`
      - `public void setToken(String token)`
      - `public void setUsed(boolean used)`
      - `public void setUser(User user)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/StaffInvite.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class StaffInvite`
    - Methods:
      - `public LocalDateTime getAcceptedAt()`
      - `public LocalDateTime getCreatedAt()`
      - `public LocalDateTime getExpiresAt()`
      - `public Long getId()`
      - `public String getEmail()`
      - `public String getFullName()`
      - `public String getTokenHash()`
      - `public String getUsername()`
      - `public User getInvitedBy()`
      - `public boolean isExpired()`
      - `public boolean isUsed()`
      - `public void onCreate()`
      - `public void setAcceptedAt(LocalDateTime acceptedAt)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setEmail(String email)`
      - `public void setExpiresAt(LocalDateTime expiresAt)`
      - `public void setFullName(String fullName)`
      - `public void setId(Long id)`
      - `public void setInvitedBy(User invitedBy)`
      - `public void setTokenHash(String tokenHash)`
      - `public void setUsed(boolean used)`
      - `public void setUsername(String username)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/SupportRequest.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class SupportRequest`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public String getCategory()`
      - `public String getEmail()`
      - `public String getFullName()`
      - `public String getMessage()`
      - `public String getSubject()`
      - `public void onCreate()`
      - `public void setCategory(String category)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setEmail(String email)`
      - `public void setFullName(String fullName)`
      - `public void setId(Long id)`
      - `public void setMessage(String message)`
      - `public void setSubject(String subject)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/Ticket.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class Ticket`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public LocalDateTime getResolvedAt()`
      - `public LocalDateTime getUpdatedAt()`
      - `public Long getId()`
      - `public String getAfterImagePath()`
      - `public String getBuilding()`
      - `public String getDescription()`
      - `public String getImagePath()`
      - `public String getLocation()`
      - `public String getTitle()`
      - `public TicketCategory getCategory()`
      - `public TicketStatus getStatus()`
      - `public UrgencyLevel getUrgency()`
      - `public User getAssignedTo()`
      - `public User getCreatedBy()`
      - `public void onCreate()`
      - `public void onUpdate()`
      - `public void setAfterImagePath(String afterImagePath)`
      - `public void setAssignedTo(User assignedTo)`
      - `public void setBuilding(String building)`
      - `public void setCategory(TicketCategory category)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setCreatedBy(User createdBy)`
      - `public void setDescription(String description)`
      - `public void setId(Long id)`
      - `public void setImagePath(String imagePath)`
      - `public void setLocation(String location)`
      - `public void setResolvedAt(LocalDateTime resolvedAt)`
      - `public void setStatus(TicketStatus status)`
      - `public void setTitle(String title)`
      - `public void setUpdatedAt(LocalDateTime updatedAt)`
      - `public void setUrgency(UrgencyLevel urgency)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/TicketComment.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class TicketComment`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public String getContent()`
      - `public Ticket getTicket()`
      - `public User getAuthor()`
      - `public void onCreate()`
      - `public void setAuthor(User author)`
      - `public void setContent(String content)`
      - `public void setCreatedAt(LocalDateTime createdAt)`
      - `public void setId(Long id)`
      - `public void setTicket(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/TicketLog.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class TicketLog`
    - Methods:
      - `public LocalDateTime getTimestamp()`
      - `public Long getId()`
      - `public String getNote()`
      - `public Ticket getTicket()`
      - `public TicketStatus getNewStatus()`
      - `public TicketStatus getOldStatus()`
      - `public User getChangedBy()`
      - `public void onCreate()`
      - `public void setChangedBy(User changedBy)`
      - `public void setNewStatus(TicketStatus newStatus)`
      - `public void setNote(String note)`
      - `public void setOldStatus(TicketStatus oldStatus)`
      - `public void setTicket(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/TicketRating.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class TicketRating`
    - Methods:
      - `public Integer getStars()`
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public String getComment()`
      - `public Ticket getTicket()`
      - `public User getRatedBy()`
      - `public void onCreate()`
      - `public void setComment(String comment)`
      - `public void setRatedBy(User ratedBy)`
      - `public void setStars(Integer stars)`
      - `public void setTicket(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/User.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity`
- Types and Methods:
  - `class User`
    - Methods:
      - `public LocalDateTime getCreatedAt()`
      - `public Long getId()`
      - `public Role getRole()`
      - `public String getEmail()`
      - `public String getFullName()`
      - `public String getPasswordHash()`
      - `public String getUsername()`
      - `public boolean isEmailVerified()`
      - `public int getTokenVersion()`
      - `public void onCreate()`
      - `public void setEmail(String email)`
      - `public void setEmailVerified(boolean emailVerified)`
      - `public void setFullName(String fullName)`
      - `public void setId(Long id)`
      - `public void setPasswordHash(String passwordHash)`
      - `public void setRole(Role role)`
      - `public void setTokenVersion(int tokenVersion)`
      - `public void setUsername(String username)`

### `backend/src/main/java/com/smartcampus/maintenance/entity/enums/EmailOutboxStatus.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity.enums`
- Types and Methods:
  - `enum EmailOutboxStatus`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/entity/enums/NotificationType.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity.enums`
- Types and Methods:
  - `enum NotificationType`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/entity/enums/Role.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity.enums`
- Types and Methods:
  - `enum Role`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/entity/enums/TicketCategory.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity.enums`
- Types and Methods:
  - `enum TicketCategory`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/entity/enums/TicketStatus.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity.enums`
- Types and Methods:
  - `enum TicketStatus`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/entity/enums/UrgencyLevel.java`
- Language: `java`
- Purpose: Domain/entity model
- Package: `com.smartcampus.maintenance.entity.enums`
- Types and Methods:
  - `enum UrgencyLevel`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/exception/ApiException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class ApiException`
    - Constructors:
      - `public ApiException(HttpStatus status, String message)`
    - Methods:
      - `public HttpStatus getStatus()`

### `backend/src/main/java/com/smartcampus/maintenance/exception/BadRequestException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class BadRequestException`
    - Constructors:
      - `public BadRequestException(String message)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/ConflictException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class ConflictException`
    - Constructors:
      - `public ConflictException(String message)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/ErrorResponse.java`
- Language: `java`
- Purpose: Data transfer model
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type unknown`
    - Methods:
      - `record ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/ForbiddenException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class ForbiddenException`
    - Constructors:
      - `public ForbiddenException(String message)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/GlobalExceptionHandler.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class GlobalExceptionHandler`
    - Methods:
      - `private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, String path)`
      - `private String formatFieldError(FieldError fieldError)`
      - `public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request)`
      - `public ResponseEntity<ErrorResponse> handleApiException(ApiException ex, HttpServletRequest request)`
      - `public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request)`
      - `public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/NotFoundException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class NotFoundException`
    - Constructors:
      - `public NotFoundException(String message)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/UnauthorizedException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class UnauthorizedException`
    - Constructors:
      - `public UnauthorizedException(String message)`

### `backend/src/main/java/com/smartcampus/maintenance/exception/UnprocessableEntityException.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.exception`
- Types and Methods:
  - `class UnprocessableEntityException`
    - Constructors:
      - `public UnprocessableEntityException(String message)`

### `backend/src/main/java/com/smartcampus/maintenance/mapper/TicketMapper.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.mapper`
- Types and Methods:
  - `class TicketMapper`
    - Constructors:
      - `private TicketMapper()`
    - Methods:
      - `public static TicketLogResponse toLogResponse(TicketLog log)`
      - `public static TicketRatingResponse toRatingResponse(TicketRating rating)`
      - `public static TicketResponse toResponse(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/mapper/UserMapper.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.mapper`
- Types and Methods:
  - `class UserMapper`
    - Constructors:
      - `private UserMapper()`
    - Methods:
      - `public static TicketUserInfoResponse toTicketUserInfo(User user)`
      - `public static UserSummaryResponse toSummary(User user)`
      - `public static UserWithTicketCountResponse toWithTicketCount(User user, long ticketCount)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/AnnouncementRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface AnnouncementRepository`
    - Methods:
      - `List<Announcement> findByActiveTrueOrderByCreatedAtDesc()`

### `backend/src/main/java/com/smartcampus/maintenance/repository/BuildingRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface BuildingRepository`
    - Methods:
      - `List<Building> findByActiveTrueOrderByNameAsc()`
      - `Optional<Building> findByName(String name)`
      - `boolean existsByCode(String code)`
      - `boolean existsByName(String name)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/ChatMessageRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface ChatMessageRepository`
    - Methods:
      - `List<ChatMessage> findByTicketIdOrderByCreatedAtAsc(Long ticketId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/EmailOutboxRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface EmailOutboxRepository`
    - Methods:
      - `List<EmailOutbox> findByStatusAndNextAttemptAtLessThanEqualOrderByCreatedAtAsc(EmailOutboxStatus status, LocalDateTime now, Pageable pageable)`
      - `long deleteByStatusAndCreatedAtBefore(EmailOutboxStatus status, LocalDateTime cutoff)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/EmailVerificationTokenRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface EmailVerificationTokenRepository`
    - Methods:
      - `Optional<EmailVerificationToken> findByUser_IdAndCodeAndUsedFalse(Long userId, String code)`
      - `Optional<EmailVerificationToken> findTopByUser_IdAndUsedFalseOrderByCreatedAtDesc(Long userId)`
      - `long deleteByExpiresAtBefore(LocalDateTime expiresAt)`
      - `long deleteByUsedTrueAndCreatedAtBefore(LocalDateTime createdAt)`
      - `void deleteByUser_IdAndUsedFalse(Long userId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/NotificationRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface NotificationRepository`
    - Methods:
      - `List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId)`
      - `List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId)`
      - `long countByUserIdAndReadFalse(Long userId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/PasswordResetTokenRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface PasswordResetTokenRepository`
    - Methods:
      - `Optional<PasswordResetToken> findByTokenAndUsedFalse(String token)`
      - `Optional<PasswordResetToken> findTopByUser_IdAndUsedFalseOrderByCreatedAtDesc(Long userId)`
      - `boolean existsByToken(String token)`
      - `long countByUser_IdAndUsedFalse(Long userId)`
      - `long deleteByExpiresAtBefore(LocalDateTime expiresAt)`
      - `long deleteByUsedTrueAndCreatedAtBefore(LocalDateTime createdAt)`
      - `void deleteByUser_IdAndUsedFalse(Long userId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/StaffInviteRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface StaffInviteRepository`
    - Methods:
      - `Optional<StaffInvite> findByTokenHashAndUsedFalse(String tokenHash)`
      - `boolean existsByEmailIgnoreCaseAndUsedFalse(String email)`
      - `boolean existsByUsernameIgnoreCaseAndUsedFalse(String username)`
      - `long deleteByExpiresAtBefore(LocalDateTime cutoff)`
      - `long deleteByUsedTrueAndAcceptedAtBefore(LocalDateTime cutoff)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/SupportRequestRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface SupportRequestRepository`
    - No methods detected.

### `backend/src/main/java/com/smartcampus/maintenance/repository/TicketCommentRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface TicketCommentRepository`
    - Methods:
      - `List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long ticketId)`
      - `long countByTicketId(Long ticketId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/TicketLogRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface TicketLogRepository`
    - Methods:
      - `List<TicketLog> findByTicketIdOrderByTimestampAsc(Long ticketId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/TicketRatingRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface TicketRatingRepository`
    - Methods:
      - `Optional<TicketRating> findByTicketId(Long ticketId)`
      - `boolean existsByTicketId(Long ticketId)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/TicketRepository.java`
- Language: `java`
- Purpose: Data access layer
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type interface TicketRepository`
    - Methods:
      - `List<Object[]> countByBuilding()`
      - `List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId)`
      - `List<Ticket> findByCategoryAndBuildingAndStatusNotIn(com.smartcampus.maintenance.entity.enums.TicketCategory category, String building, Collection<TicketStatus> statuses)`
      - `List<Ticket> findByCreatedByIdOrderByCreatedAtDesc(Long createdById)`
      - `long countByAssignedToId(Long assignedToId)`
      - `long countByAssignedToIdAndStatusIn(Long assignedToId, Collection<TicketStatus> statuses)`
      - `long countByCreatedById(Long createdById)`
      - `long countByCreatedByIdAndStatusIn(Long createdById, Collection<TicketStatus> statuses)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/TicketSpecifications.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `class TicketSpecifications`
    - Constructors:
      - `private TicketSpecifications()`
    - Methods:
      - `public static Specification<Ticket> assigneeEquals(Long assigneeId)`
      - `public static Specification<Ticket> categoryEquals(TicketCategory category)`
      - `public static Specification<Ticket> searchLike(String search)`
      - `public static Specification<Ticket> statusEquals(TicketStatus status)`
      - `public static Specification<Ticket> urgencyEquals(UrgencyLevel urgency)`

### `backend/src/main/java/com/smartcampus/maintenance/repository/UserRepository.java`
- Language: `java`
- Purpose: Data access layer
- Package: `com.smartcampus.maintenance.repository`
- Types and Methods:
  - `interface UserRepository`
    - Methods:
      - `List<User> findByRole(Role role)`
      - `List<User> findByRoleOrderByFullNameAsc(Role role)`
      - `Optional<User> findByEmail(String email)`
      - `Optional<User> findByUsername(String username)`
      - `boolean existsByEmail(String email)`
      - `boolean existsByEmailAndIdNot(String email, Long id)`
      - `boolean existsByEmailIgnoreCase(String email)`
      - `boolean existsByUsername(String username)`
      - `boolean existsByUsernameAndIdNot(String username, Long id)`
      - `boolean existsByUsernameIgnoreCase(String username)`

### `backend/src/main/java/com/smartcampus/maintenance/security/AuthenticatedUser.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.security`
- Types and Methods:
  - `class AuthenticatedUser`
    - Constructors:
      - `public AuthenticatedUser(User user)`
    - Methods:
      - `public Collection<GrantedAuthority> getAuthorities()`
      - `public Long getId()`
      - `public Role getRole()`
      - `public String getPassword()`
      - `public String getUsername()`
      - `public boolean isAccountNonExpired()`
      - `public boolean isAccountNonLocked()`
      - `public boolean isCredentialsNonExpired()`
      - `public boolean isEnabled()`
      - `public int getTokenVersion()`

### `backend/src/main/java/com/smartcampus/maintenance/security/CustomUserDetailsService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.security`
- Types and Methods:
  - `class CustomUserDetailsService`
    - Constructors:
      - `public CustomUserDetailsService(UserRepository userRepository)`
    - Methods:
      - `public UserDetails loadUserByUsername(String username)`

### `backend/src/main/java/com/smartcampus/maintenance/security/JwtAuthenticationFilter.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance.security`
- Types and Methods:
  - `class JwtAuthenticationFilter`
    - Constructors:
      - `public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService)`
    - Methods:
      - `protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)`

### `backend/src/main/java/com/smartcampus/maintenance/security/JwtService.java`
- Language: `java`
- Purpose: Business/service logic
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class JwtService`
    - Methods:
      - `Claims parseClaims(String token)`
      - `String extractUsername(String token)`
      - `String generateToken(User user)`
      - `boolean isTokenValid(String token, UserDetails userDetails)`
      - `throw new IllegalStateException("JWT secret must be at least 32 bytes")`
      - `void init()`

### `backend/src/main/java/com/smartcampus/maintenance/service/AnalyticsService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class AnalyticsService`
    - Constructors:
      - `public AnalyticsService(TicketRepository ticketRepository)`
    - Methods:
      - `private double averageHours(List<Ticket> tickets)`
      - `private double round(double value)`
      - `private void requireAdmin(User actor)`
      - `public AnalyticsSummaryResponse getSummary(User actor)`
      - `public List<CrewPerformanceResponse> getCrewPerformance(User actor)`
      - `public List<TopBuildingResponse> getTopBuildings(User actor)`
      - `public PublicLandingStatsResponse getPublicLandingStats()`
      - `public ResolutionTimeResponse getResolutionTime(User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/AnnouncementService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class AnnouncementService`
    - Constructors:
      - `public AnnouncementService(AnnouncementRepository announcementRepository, UserRepository userRepository, NotificationDispatchService notificationDispatchService)`
    - Methods:
      - `private AnnouncementResponse toResponse(Announcement a)`
      - `private void requireAdmin(User actor)`
      - `public AnnouncementResponse create(User actor, AnnouncementCreateRequest request)`
      - `public List<AnnouncementResponse> getActiveAnnouncements()`
      - `public List<AnnouncementResponse> getAllAnnouncements(User actor)`
      - `public void toggleActive(Long id, User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/AuthService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class AuthService`
    - Constructors:
      - `public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, PasswordResetTokenRepository resetTokenRepository, EmailVerificationTokenRepository verificationTokenRepository, StaffInviteRepository staffInviteRepository, UserService userService, PasswordPolicyService passwordPolicyService, TokenHashService tokenHashService, EmailService emailService, String frontendBaseUrl, long verificationCodeTtlMinutes, long resetTokenTtlMinutes, int verificationCodeMaxAttempts, long verificationResendCooldownSeconds, long resetRequestCooldownSeconds, long publicRequestMinDelayMs)`
    - Methods:
      - `private AuthResponse buildAuthResponse(User user)`
      - `private String buildLoginUrl()`
      - `private String buildResetUrl(String token)`
      - `private String buildVerifyEmailUrl(String email)`
      - `private String generateUniqueResetToken()`
      - `private String generateVerificationCode()`
      - `private boolean isCooldownActive(LocalDateTime createdAt, long cooldownSeconds)`
      - `private void enforceMinimumPublicDelay(long startedAtNs)`
      - `private void issueEmailVerificationCode(User user)`
      - `public AuthResponse login(LoginRequest request)`
      - `public List<String> getUsernameSuggestions(String preferredUsername, String fullName)`
      - `public void acceptStaffInvite(AcceptStaffInviteRequest request)`
      - `public void forgotPassword(String email)`
      - `public void registerStudent(RegisterRequest request)`
      - `public void resendVerificationCode(String email)`
      - `public void resetPassword(String token, String newPassword)`
      - `public void verifyEmail(String email, String code)`

### `backend/src/main/java/com/smartcampus/maintenance/service/AuthTokenCleanupScheduler.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class AuthTokenCleanupScheduler`
    - Constructors:
      - `public AuthTokenCleanupScheduler(PasswordResetTokenRepository resetTokenRepository, EmailVerificationTokenRepository verificationTokenRepository, long usedTokenRetentionHours)`
    - Methods:
      - `public void cleanupAuthTokens()`

### `backend/src/main/java/com/smartcampus/maintenance/service/AutoAssignmentService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class AutoAssignmentService`
    - Constructors:
      - `public AutoAssignmentService(UserRepository userRepository, TicketRepository ticketRepository)`
    - Methods:
      - `private long getActiveTicketCount(Long userId)`
      - `public Optional<User> findBestAssignee(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/service/BuildingService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class BuildingService`
    - Constructors:
      - `public BuildingService(BuildingRepository buildingRepository)`
    - Methods:
      - `private BuildingResponse toResponse(Building b)`
      - `private void requireAdmin(User actor)`
      - `public BuildingResponse createBuilding(User actor, BuildingCreateRequest request)`
      - `public List<BuildingResponse> getActiveBuildings()`
      - `public List<BuildingResponse> getAllBuildings(User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/ChatService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class ChatService`
    - Constructors:
      - `public ChatService(ChatMessageRepository chatMessageRepository, TicketRepository ticketRepository, UserRepository userRepository, NotificationDispatchService notificationDispatchService)`
    - Methods:
      - `private ChatMessageResponse toResponse(ChatMessage m)`
      - `private Ticket requireTicket(Long ticketId)`
      - `private void ensureAccess(Ticket ticket, User actor)`
      - `private void notifyChatParticipants(Ticket ticket, User actor, String content)`
      - `public ChatMessageResponse sendMessage(Long ticketId, ChatSendRequest request, User actor)`
      - `public List<ChatMessageResponse> getMessages(Long ticketId, User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/CurrentUserService.java`
- Language: `java`
- Purpose: Business/service logic
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class CurrentUserService`
    - Methods:
      - `User requireCurrentUser()`
      - `public CurrentUserService(UserRepository userRepository)`
      - `throw new UnauthorizedException("Authentication required")`

### `backend/src/main/java/com/smartcampus/maintenance/service/EmailDeliveryService.java`
- Language: `java`
- Purpose: Business/service logic
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class EmailDeliveryService`
    - Methods:
      - ` sendHtml(to, subject, plainText, htmlBody)`
      - ` sendPlain(to, subject, plainText)`
      - `boolean canSend(String to, String subject)`
      - `throw new IllegalStateException("Failed to compose HTML email", ex)`
      - `void send(String to, String subject, String plainText, String htmlBody)`
      - `void sendHtml(String to, String subject, String plainText, String htmlBody)`
      - `void sendPlain(String to, String subject, String body)`

### `backend/src/main/java/com/smartcampus/maintenance/service/EmailOutboxScheduler.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class EmailOutboxScheduler`
    - Constructors:
      - `public EmailOutboxScheduler(EmailOutboxService emailOutboxService)`
    - Methods:
      - `public void cleanupSentEmails()`
      - `public void processPendingEmails()`

### `backend/src/main/java/com/smartcampus/maintenance/service/EmailOutboxService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class EmailOutboxService`
    - Constructors:
      - `public EmailOutboxService(EmailOutboxRepository emailOutboxRepository, EmailDeliveryService emailDeliveryService, boolean emailEnabled, int batchSize, int maxAttempts, long retentionDays)`
    - Methods:
      - `private String safeError(String message)`
      - `private void deliver(EmailOutbox message)`
      - `public int processPendingBatch()`
      - `public long cleanupSentHistory()`
      - `public void enqueue(String toEmail, String subject, String plainText, String htmlBody)`

### `backend/src/main/java/com/smartcampus/maintenance/service/EmailService.java`
- Language: `java`
- Purpose: Business/service logic
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class EmailService`
    - Methods:
      - ` sendHtmlEmail(toEmail, "CampusFix: Password Changed", text, html)`
      - ` sendHtmlEmail(toEmail, "CampusFix: Password Reset Request", text, html)`
      - ` sendHtmlEmail(toEmail, "CampusFix: Staff Invitation", text, html)`
      - ` sendHtmlEmail(toEmail, "CampusFix: Verify Your Email", text, html)`
      - ` sendHtmlEmail(toEmail, "Welcome to CampusFix", text, html)`
      - ` sendPlainEmail(supportInbox, "CampusFix Support Request: " + subject, body)`
      - `String buildBrandedHtml(String title, String heading, String intro, String code, String buttonLabel, String buttonUrl, String note)`
      - `String displayName(String fullName)`
      - `String htmlEscape(String input)`
      - `void sendHtmlEmail(String to, String subject, String plainText, String html)`
      - `void sendPasswordChangedEmail(String fullName, String toEmail, String loginUrl)`
      - `void sendPasswordResetEmail(String fullName, String toEmail, String resetUrl, long expiresInMinutes)`
      - `void sendPlainEmail(String to, String subject, String body)`
      - `void sendSlaBreachEmail(String toEmail, String ticketTitle, Long ticketId)`
      - `void sendStaffInviteEmail(String fullName, String toEmail, String acceptUrl, long expiresInHours)`
      - `void sendSupportRequestEmail(String fullName, String fromEmail, String category, String subject, String message)`
      - `void sendTicketAssignedEmail(String toEmail, String ticketTitle, Long ticketId)`
      - `void sendTicketCreatedEmail(String toEmail, String ticketTitle, Long ticketId)`
      - `void sendTicketResolvedEmail(String toEmail, String ticketTitle, Long ticketId)`
      - `void sendVerificationCodeEmail(String fullName, String toEmail, String verificationCode, long expiresInMinutes, String verifyUrl)`
      - `void sendWelcomeEmail(String fullName, String toEmail, String loginUrl)`

### `backend/src/main/java/com/smartcampus/maintenance/service/EscalationScheduler.java`
- Language: `java`
- Purpose: Business/service logic
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class EscalationScheduler`
    - Methods:
      - `UrgencyLevel bumpUrgency(UrgencyLevel current)`
      - `public EscalationScheduler(TicketRepository ticketRepository, SlaService slaService, NotificationService notificationService, UserRepository userRepository, EmailService emailService)`
      - `void escalateBreachedTickets()`

### `backend/src/main/java/com/smartcampus/maintenance/service/NotificationDispatchService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class NotificationDispatchService`
    - Constructors:
      - `public NotificationDispatchService(NotificationService notificationService)`
    - Methods:
      - `public void notifyUser(User user, String title, String message, NotificationType type, String linkUrl)`
      - `public void notifyUsers(Collection<User> users, String title, String message, NotificationType type, String linkUrl)`

### `backend/src/main/java/com/smartcampus/maintenance/service/NotificationService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class NotificationService`
    - Constructors:
      - `public NotificationService(NotificationRepository notificationRepository)`
    - Methods:
      - `private NotificationResponse toResponse(Notification n)`
      - `public List<NotificationResponse> getNotifications(User actor)`
      - `public long getUnreadCount(User actor)`
      - `public void markAllRead(User actor)`
      - `public void markRead(Long notificationId, User actor)`
      - `public void notify(User user, String title, String message, NotificationType type, String linkUrl)`

### `backend/src/main/java/com/smartcampus/maintenance/service/PasswordPolicyService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class PasswordPolicyService`
    - Methods:
      - `private void addToken(Set<String> tokens, String value)`
      - `public ValidationResult evaluate(String password, String username, String email, String fullName)`
      - `public record ValidationResult(boolean valid, String message)`
      - `public void enforce(String password, String username, String email, String fullName)`

### `backend/src/main/java/com/smartcampus/maintenance/service/PublicLandingConfigService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class PublicLandingConfigService`
    - Methods:
      - `public PublicLandingConfigResponse getPublicConfig()`

### `backend/src/main/java/com/smartcampus/maintenance/service/ReportService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class ReportService`
    - Constructors:
      - `public ReportService(TicketRepository ticketRepository)`
    - Methods:
      - `private String escape(String value)`
      - `private void requireAdmin(User actor)`
      - `public byte[] exportTicketsCsv(User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/SlaService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class SlaService`
    - Constructors:
      - `public SlaService(TicketRepository ticketRepository)`
    - Methods:
      - `private boolean isOnTime(Ticket ticket)`
      - `private void requireAdmin(User actor)`
      - `public SlaComplianceResponse getSlaCompliance(User actor)`
      - `public boolean isSlaBreached(Ticket ticket)`

### `backend/src/main/java/com/smartcampus/maintenance/service/StaffInviteCleanupScheduler.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class StaffInviteCleanupScheduler`
    - Constructors:
      - `public StaffInviteCleanupScheduler(StaffInviteRepository staffInviteRepository, long usedTokenRetentionHours)`
    - Methods:
      - `public void cleanupInvites()`

### `backend/src/main/java/com/smartcampus/maintenance/service/SupportRequestService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class SupportRequestService`
    - Constructors:
      - `public SupportRequestService(SupportRequestRepository supportRequestRepository, EmailService emailService)`
    - Methods:
      - `public SupportContactResponse submit(SupportContactRequest request)`

### `backend/src/main/java/com/smartcampus/maintenance/service/TicketService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class TicketService`
    - Constructors:
      - `public TicketService(TicketRepository ticketRepository, TicketLogRepository ticketLogRepository, TicketRatingRepository ticketRatingRepository, TicketCommentRepository ticketCommentRepository, UserRepository userRepository, FileStorageService fileStorageService, NotificationDispatchService notificationDispatchService, EmailService emailService)`
    - Methods:
      - `private CommentResponse toCommentResponse(TicketComment c)`
      - `private String safeNote(String note, String fallback)`
      - `private String ticketLink(Ticket ticket)`
      - `private Ticket requireTicket(Long ticketId)`
      - `private double similarity(String a, String b)`
      - `private int levenshtein(String a, String b)`
      - `private void addLog(Ticket ticket, TicketStatus oldStatus, TicketStatus newStatus, User changedBy, String note)`
      - `private void ensureAccess(Ticket ticket, User actor)`
      - `private void ensureCanUpdateStatus(Ticket ticket, TicketStatusUpdateRequest request, User actor)`
      - `private void notifyAdmins(String title, String message, NotificationType type, String linkUrl)`
      - `private void notifyTicketStakeholders(Ticket ticket, User actor, String title, String message)`
      - `private void notifyTicketStakeholders(Ticket ticket, User actor, String title, String message, NotificationType type)`
      - `private void requireRole(User actor, Role required)`
      - `public CommentResponse addComment(Long ticketId, CommentCreateRequest request, User actor)`
      - `public DuplicateCheckResponse checkDuplicates(TicketCreateRequest request)`
      - `public List<CommentResponse> getComments(Long ticketId, User actor)`
      - `public List<TicketLogResponse> getLogs(Long ticketId, User actor)`
      - `public List<TicketResponse> getAllTickets(User actor, TicketStatus status, TicketCategory category, UrgencyLevel urgency, Long assigneeId, String search)`
      - `public List<TicketResponse> getAssignedTickets(User actor)`
      - `public List<TicketResponse> getMyTickets(User actor)`
      - `public TicketDetailResponse getTicketDetail(Long ticketId, User actor)`
      - `public TicketRatingResponse rateTicket(Long ticketId, TicketRateRequest request, User actor)`
      - `public TicketResponse assignTicket(Long ticketId, TicketAssignRequest request, User actor)`
      - `public TicketResponse createTicket(User actor, TicketCreateRequest request, MultipartFile imageFile)`
      - `public TicketResponse updateStatus(Long ticketId, TicketStatusUpdateRequest request, User actor)`
      - `public TicketResponse uploadAfterPhoto(Long ticketId, MultipartFile image, User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/TokenHashService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class TokenHashService`
    - Methods:
      - `public String generateUrlToken(int sizeBytes)`
      - `public String hashSha256(String rawValue)`

### `backend/src/main/java/com/smartcampus/maintenance/service/UserService.java`
- Language: `java`
- Purpose: Business/service logic
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class UserService`
    - Methods:
      - ` requireAdmin(actor)`
      - `BroadcastMessageResponse broadcastMessage(User actor, BroadcastMessageRequest request)`
      - `List<String> suggestAvailableUsernames(String preferredUsername, String fullName, int limit)`
      - `List<UserSummaryResponse> getMaintenanceUsers(User actor)`
      - `List<UserWithTicketCountResponse> getAllUsersWithTicketCount(User actor)`
      - `StaffInviteResponse inviteStaffUser(User actor, StaffInviteRequest request)`
      - `String buildInviteUrl(String token)`
      - `UserProfileResponse getMyProfile(User actor)`
      - `UserProfileResponse toProfile(User user)`
      - `UserProfileResponse updateMyProfile(User actor, UserProfileUpdateRequest request)`
      - `boolean isEmailUnavailable(String email)`
      - `boolean isUsernameUnavailable(String username)`
      - `long resolveTicketCount(User user)`
      - `return toProfile(actor)`
      - `return toProfile(saved)`
      - `throw new ConflictException("Email is already registered or has a pending invitation.")`
      - `throw new ForbiddenException("ADMIN role is required")`
      - `void requireAdmin(User actor)`

### `backend/src/main/java/com/smartcampus/maintenance/service/UsernameSuggestionService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.service`
- Types and Methods:
  - `class UsernameSuggestionService`
    - Methods:
      - `private String sanitizeBase(String preferredUsername, String fullName)`
      - `public List<String> generate(String preferredUsername, String fullName, int limit)`

### `backend/src/main/java/com/smartcampus/maintenance/util/FileStorageService.java`
- Language: `java`
- Purpose: Business/service logic
- Package: `com.smartcampus.maintenance.util`
- Types and Methods:
  - `class FileStorageService`
    - Constructors:
      - `public FileStorageService(String uploadDir)`
    - Methods:
      - `private String resolveExtension(String originalFilename)`
      - `public String store(MultipartFile file)`

### `backend/src/test/java/com/smartcampus/maintenance/ApiFlowIntegrationTest.java`
- Language: `java`
- Purpose: Project source code
- Parse Notes: Regex fallback parser used.
- Types and Methods:
  - `type class ApiFlowIntegrationTest`
    - Methods:
      - `String tokenFor(String username, String password)`
      - `void loginReturnsJwtAndRole()`
      - `void maintenanceCanAccessAssignedTickets()`
      - `void studentCannotAccessAdminTicketListing()`

### `backend/src/test/java/com/smartcampus/maintenance/AuthSecurityServiceIntegrationTest.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance`
- Types and Methods:
  - `class AuthSecurityServiceIntegrationTest`
    - Methods:
      - `private String sha256(String input)`
      - `private User createUser(boolean emailVerified, String rawPassword)`
      - `void forgotPasswordCooldownPreventsMultipleResetTokens()`
      - `void forgotPasswordUnknownEmailDoesNotCreateResetToken()`
      - `void oldJwtBecomesInvalidWhenTokenVersionChanges()`
      - `void resetPasswordRejectsSamePasswordAndIncrementsTokenVersion()`
      - `void verifyEmailLocksTokenAfterTooManyInvalidAttempts()`

### `backend/src/test/java/com/smartcampus/maintenance/SmartCampusMaintenanceApplicationTests.java`
- Language: `java`
- Purpose: Project source code
- Package: `com.smartcampus.maintenance`
- Types and Methods:
  - `class SmartCampusMaintenanceApplicationTests`
    - Methods:
      - `void contextLoads()`

### `cpp-optimization/include/jni_bindings.h`
- Language: `h`
- Purpose: C/C++ optimization/native module
- Classes/Structs:
  - None detected.
- Functions:
  - None detected.

### `cpp-optimization/src/assignment_algorithm.cpp`
- Language: `cpp`
- Purpose: C/C++ optimization/native module
- Classes/Structs:
  - None detected.
- Functions:
  - None detected.

### `cpp-optimization/src/assignment_algorithm.h`
- Language: `h`
- Purpose: C/C++ optimization/native module
- Classes/Structs:
  - None detected.
- Functions:
  - None detected.

### `cpp-optimization/src/image_compressor.cpp`
- Language: `cpp`
- Purpose: C/C++ optimization/native module
- Classes/Structs:
  - None detected.
- Functions:
  - None detected.

### `cpp-optimization/src/image_compressor.h`
- Language: `h`
- Purpose: C/C++ optimization/native module
- Classes/Structs:
  - None detected.
- Functions:
  - None detected.

### `cpp-optimization/src/main.cpp`
- Language: `cpp`
- Purpose: C/C++ optimization/native module
- Classes/Structs:
  - None detected.
- Functions:
  - None detected.

### `database/schemas/schema.sql`
- Language: `sql`
- Purpose: Database schema/seed script
- Tables:
  - `announcements`
  - `buildings`
  - `chat_messages`
  - `email_outbox`
  - `email_verification_tokens`
  - `notifications`
  - `password_reset_tokens`
  - `staff_invites`
  - `support_requests`
  - `ticket_comments`
  - `ticket_logs`
  - `ticket_ratings`
  - `tickets`
  - `users`
- Views:
  - None detected.
- Functions/Procedures:
  - None detected.

### `database/seed_data.sql`
- Language: `sql`
- Purpose: Database schema/seed script
- Tables:
  - None detected.
- Views:
  - None detected.
- Functions/Procedures:
  - None detected.

### `frontend/eslint.config.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - `default defineConfig`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/postcss.config.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/App.jsx`
- Language: `jsx`
- Purpose: Project source code
- Exports:
  - `default App`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `App()`
  - `PublicRoute({ children })`

### `frontend/src/components/Common/CampusFixLogo.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `CampusFixLogo`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `CampusFixLogo({ collapsed = false, roleLabel = "", roleTone = "" })`

### `frontend/src/components/Common/ConfirmDialog.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `ConfirmDialog`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = "Confirm" })`

### `frontend/src/components/Common/EmptyState.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `EmptyState`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `EmptyState({ title, message })`

### `frontend/src/components/Common/LoadingSpinner.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `LoadingSpinner`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `LoadingSpinner({ label = "Loading..." })`

### `frontend/src/components/Common/Modal.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `Modal`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `Modal({ open, title, onClose, children, width = "max-w-3xl" })`

### `frontend/src/components/Common/Navbar.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `Navbar`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `Navbar()`
  - `onLogout()`

### `frontend/src/components/Common/ProtectedRoute.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `ProtectedRoute`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `ProtectedRoute({ children, roles = [] })`

### `frontend/src/components/Common/SessionExpiryWarning.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `SessionExpiryWarning`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `SessionExpiryWarning()`

### `frontend/src/components/Common/StatusBadge.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `StatusBadge`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `StatusBadge({ status, className })`

### `frontend/src/components/Common/UrgencyBadge.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `UrgencyBadge`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `UrgencyBadge({ urgency, className })`

### `frontend/src/components/Common/UserAvatar.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `UserAvatar`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `UserAvatar({ fullName, username, avatarType = "preset", avatarPreset = "campus", avatarImage = "", size = 34, className = "", })`
  - `initialFor(fullName, username)`

### `frontend/src/components/Dashboard/DashboardPrimitives.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `DashboardHero`
  - `DashboardStatGrid`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `DashboardHero({ id = "dashboard", tone = "campus", className = "", children })`
  - `DashboardStatCard({ item })`
  - `DashboardStatGrid({ items, className = "" })`
  - `resolveTrend(trend)`

### `frontend/src/components/Dashboard/DashboardShell.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `DashboardShell`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `DashboardShell({ children })`
  - `handlePreferenceSync(event)`
  - `handleSectionChange(sectionId, label)`
  - `toggleCollapse()`

### `frontend/src/components/Dashboard/NotificationDropdown.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `NotificationDropdown`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `NotificationDropdown({ notifications = [], unreadCount = 0, loading = false, error = "", onClose, onOpenNotification, onMarkAllRead, })`
  - `configFor(type)`

### `frontend/src/components/Dashboard/ProfileSettingsModal.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `ProfileSettingsModal`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `ProfileSettingsModal({ open, onClose, initialTab = "profile", auth, profilePreferences, onSaveProfile, theme, toggleTheme, })`
  - `applyDashboardPreferences()`
  - `handleAvatarUpload(event)`
  - `handleSaveProfile()`
  - `readReduceMotionPreference()`
  - `readSidebarCollapsedPreference()`

### `frontend/src/components/Dashboard/Sidebar.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `Sidebar`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `NavItem({ item, collapsed, active, onSelect })`
  - `Sidebar({ isOpen, onClose, collapsed, onToggleCollapse, activeSection, onSectionChange })`
  - `handleLogout()`
  - `sectionForRole(role)`

### `frontend/src/components/Dashboard/TopBar.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `TopBar`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `TopBar({ onMenuClick, activeSectionLabel })`
  - `handleClickOutside(event)`
  - `handleDashboardNavigate(event)`
  - `handleKeyboardShortcut(event)`
  - `handleLogout()`
  - `openNotification(notification)`
  - `openProfileModal(tab = "profile")`
  - `readReduceMotionPreference()`
  - `runSearch()`
  - `saveProfile({ fullName, avatarType, avatarPreset, avatarImage })`

### `frontend/src/components/tickets/TicketTimeline.jsx`
- Language: `jsx`
- Purpose: Reusable UI component
- Exports:
  - `TicketTimeline`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `TicketTimeline({ logs = [] })`

### `frontend/src/context/AuthContext.jsx`
- Language: `jsx`
- Purpose: Project source code
- Exports:
  - `AuthProvider`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `AuthProvider({ children })`
  - `normalizeAuth(data)`
  - `onUnauthorized()`
  - `parseError(error)`
  - `roleHome(role)`

### `frontend/src/context/ThemeContext.jsx`
- Language: `jsx`
- Purpose: Project source code
- Exports:
  - `ThemeProvider`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `ThemeProvider({ children })`

### `frontend/src/context/auth-context.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - `AuthContext`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/context/theme-context.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - `ThemeContext`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/hooks/useAuth.js`
- Language: `js`
- Purpose: Frontend hook/state logic
- Exports:
  - `useAuth`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `useAuth()`

### `frontend/src/hooks/useNotifications.js`
- Language: `js`
- Purpose: Frontend hook/state logic
- Exports:
  - `useNotifications`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `useNotifications(enabled = true)`

### `frontend/src/hooks/useTheme.js`
- Language: `js`
- Purpose: Frontend hook/state logic
- Exports:
  - `useTheme`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `useTheme()`

### `frontend/src/hooks/useTickets.js`
- Language: `js`
- Purpose: Frontend hook/state logic
- Exports:
  - `useTickets`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `useTickets(loader, deps = [])`

### `frontend/src/main.jsx`
- Language: `jsx`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/pages/AdminDashboard.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `AdminDashboard`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `AdminDashboard()`
  - `approveTicket()`
  - `askConfirm(title, message, onConfirm)`
  - `assignTicket()`
  - `fetchStaffSuggestions(usernameValue, fullNameValue)`
  - `getSlaStatus(ticket)`
  - `handleBroadcast(event)`
  - `handleInviteStaff(event)`
  - `handleNavigate(event)`
  - `handleSearch(event)`
  - `inRange(value, start, end)`
  - `openTicket(ticketId)`
  - `overrideStatus()`
  - `refreshAnalytics()`
  - `refreshUsers()`
  - `rejectTicket()`
  - `runAction(task)`
  - `trendPercent(current, previous)`

### `frontend/src/pages/ContactSupportPage.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `ContactSupportPage`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `ContactSupportPage()`
  - `onChange(field)`
  - `submit(event)`

### `frontend/src/pages/LandingPage.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `LandingPage`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `AboutSection()`
  - `BottomSocialSection()`
  - `CampusFixLogo({ size = "md" })`
  - `CommunitySection()`
  - `ContactSection()`
  - `DiscordIcon({ className = "" })`
  - `FAQSection()`
  - `FeaturesSection()`
  - `Footer()`
  - `HeroSection({ stats, loading, error })`
  - `HowItWorksSection()`
  - `InstagramIcon({ className = "" })`
  - `LandingPage()`
  - `LinkedInIcon({ className = "" })`
  - `LiveAnalyticsPanel({ stats, loading, error })`
  - `Navbar()`
  - `PoliciesSection()`
  - `QuickLinksSection({ config })`
  - `ScrollTopButton()`
  - `WhatsAppIcon({ className = "" })`
  - `XBrandIcon({ className = "" })`
  - `YouTubeIcon({ className = "" })`
  - `formatNumber(value)`
  - `formatSyncTime(value)`
  - `goToSection(href)`
  - `load()`
  - `load(force = false)`
  - `onKeyDown(event)`
  - `onResize()`
  - `onScroll()`
  - `onVisibilityChange()`
  - `scrollToSection(href)`
  - `startPolling()`
  - `stopPolling()`
  - `toPhoneHref(value)`
  - `usePublicAnalytics()`
  - `usePublicLandingConfig()`
  - `useScrollReveal(threshold = 0.15)`
  - `weekdayFromIsoDate(value)`

### `frontend/src/pages/LoginPage.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `AcceptStaffInvitePage`
  - `ForgotPasswordPage`
  - `LoginPage`
  - `ResetPasswordPage`
  - `VerifyEmailPage`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `AcceptStaffInvitePage()`
  - `AuthBackground({ children })`
  - `CampusFixLogo()`
  - `ForgotPasswordPage()`
  - `LoginPage()`
  - `ResetPasswordPage()`
  - `SimpleFooter()`
  - `VerifyEmailPage()`
  - `destination(role)`
  - `resendCode()`
  - `submit(e)`
  - `submit(event)`

### `frontend/src/pages/MaintenanceDashboard.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `MaintenanceDashboard`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `MaintenanceDashboard()`
  - `formatRemaining(hrs)`
  - `getSlaRemaining(ticket)`
  - `handleSearch(event)`
  - `loadAvgRating()`
  - `openTicket(ticketId)`
  - `updateStatus(ticket, status)`

### `frontend/src/pages/NotFoundPage.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `NotFoundPage`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `NotFoundPage()`

### `frontend/src/pages/RegisterPage.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `RegisterPage`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `CampusFixLogo()`
  - `RegisterPage()`
  - `fetchUsernameSuggestions()`
  - `submit(event)`
  - `validate()`

### `frontend/src/pages/StudentDashboard.jsx`
- Language: `jsx`
- Purpose: Frontend route/page component
- Exports:
  - `StudentDashboard`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `StudentDashboard()`
  - `TicketTracker({ ticket })`
  - `handleNavigate(event)`
  - `handleSearch(event)`
  - `loadBuildings()`
  - `openTicket(ticketId)`
  - `submitRating(event)`
  - `submitTicket(event)`

### `frontend/src/services/analyticsService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `analyticsService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/services/apiClient.js`
- Language: `js`
- Purpose: Frontend API/client service
- Exports:
  - `default apiClient`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `getToken()`
  - `isAuthPage()`
  - `isPublicEndpoint(url = "")`

### `frontend/src/services/authService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `authService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/services/buildingService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `buildingService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/services/notificationService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `notificationService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/services/publicAnalyticsService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `publicAnalyticsService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/services/supportService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `supportService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/services/ticketService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `ticketService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `buildQuery(params = {})`

### `frontend/src/services/userService.js`
- Language: `js`
- Purpose: Business/service logic
- Exports:
  - `userService`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/utils/constants.js`
- Language: `js`
- Purpose: Shared utility/helper logic
- Exports:
  - `CATEGORIES`
  - `ROLES`
  - `STATUSES`
  - `STATUS_COLORS`
  - `URGENCY_COLORS`
  - `URGENCY_LEVELS`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/utils/helpers.js`
- Language: `js`
- Purpose: Shared utility/helper logic
- Exports:
  - `formatDate`
  - `titleCase`
  - `toHours`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `formatDate(value)`
  - `titleCase(value)`
  - `toHours(start, end)`

### `frontend/src/utils/passwordPolicy.js`
- Language: `js`
- Purpose: Shared utility/helper logic
- Exports:
  - `evaluatePassword`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `evaluatePassword(password, { username = "", email = "", fullName = "" } = {})`
  - `hasDigit(value)`
  - `hasLower(value)`
  - `hasSymbol(value)`
  - `hasUpper(value)`
  - `hasWhitespace(value)`
  - `push(value)`
  - `tokenSet(username, email, fullName)`

### `frontend/src/utils/profilePreferences.js`
- Language: `js`
- Purpose: Shared utility/helper logic
- Exports:
  - `AVATAR_PRESETS`
  - `loadProfilePreferences`
  - `resolveAvatarPreset`
  - `saveProfilePreferences`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `keyFor(username)`
  - `loadProfilePreferences(username)`
  - `resolveAvatarPreset(presetId)`
  - `saveProfilePreferences(username, prefs)`

### `frontend/src/utils/storage.js`
- Language: `js`
- Purpose: Shared utility/helper logic
- Exports:
  - `authStorage`
  - `themeStorage`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/src/utils/validators.js`
- Language: `js`
- Purpose: Shared utility/helper logic
- Exports:
  - `isEmail`
  - `minLength`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - `isEmail(value)`
  - `minLength(value, length)`

### `frontend/tailwind.config.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `frontend/vite.config.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - `default defineConfig`
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `tests/e2e/admin-flow.test.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `tests/e2e/maintenance-flow.test.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `tests/e2e/student-flow.test.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `tests/integration/api-integration.test.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.

### `tests/integration/database-integration.test.js`
- Language: `js`
- Purpose: Project source code
- Exports:
  - No named/default exports detected.
- Classes:
  - No class declarations detected.
- Functions/Components:
  - No function declarations detected.
