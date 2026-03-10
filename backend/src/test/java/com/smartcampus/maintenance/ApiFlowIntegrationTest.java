package com.smartcampus.maintenance;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.maintenance.entity.Ticket;
import com.smartcampus.maintenance.entity.enums.TicketStatus;
import com.smartcampus.maintenance.repository.TicketRepository;
import com.smartcampus.maintenance.service.RefreshCookieService;
import com.smartcampus.maintenance.service.TicketAttachmentAccessService;
import com.smartcampus.maintenance.service.TicketAttachmentAccessService.AttachmentType;
import com.smartcampus.maintenance.util.FileStorageService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RefreshCookieService refreshCookieService;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private TicketAttachmentAccessService ticketAttachmentAccessService;

    private static final byte[] PNG_BYTES = new byte[] {
        (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D
    };

    @Test
    void loginReturnsSessionPayloadRoleAndRefreshCookie() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"admin","password":"password"}
                    """))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.get("accessToken").asText()).isNotBlank();
        assertThat(json.get("expiresAt").asText()).isNotBlank();
        assertThat(json.get("role").asText()).isEqualTo("ADMIN");
        assertThat(result.getResponse().getHeader(HttpHeaders.SET_COOKIE))
                .contains(refreshCookieService.cookieName() + "=")
                .contains("HttpOnly");
    }

    @Test
    void healthEndpointIsPublic() throws Exception {
        MvcResult result = mockMvc.perform(get("/actuator/health"))
            .andReturn();

        assertThat(result.getResponse().getStatus()).isNotIn(401, 403);
    }

    @Test
    void refreshEndpointRotatesRefreshCookie() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"admin","password":"password"}
                    """))
            .andExpect(status().isOk())
            .andReturn();

        String refreshCookie = refreshCookieValue(loginResult);

        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie(refreshCookieService.cookieName(), refreshCookie)))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode json = objectMapper.readTree(refreshResult.getResponse().getContentAsString());
        assertThat(json.get("accessToken").asText()).isNotBlank();
        assertThat(json.get("role").asText()).isEqualTo("ADMIN");
        assertThat(refreshCookieValue(refreshResult)).isNotEqualTo(refreshCookie);
    }

    @Test
    void logoutClearsRefreshCookie() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"admin","password":"password"}
                    """))
            .andExpect(status().isOk())
            .andReturn();

        String refreshCookie = refreshCookieValue(loginResult);

        MvcResult logoutResult = mockMvc.perform(post("/api/auth/logout")
                .cookie(new Cookie(refreshCookieService.cookieName(), refreshCookie)))
            .andExpect(status().isOk())
            .andReturn();

        assertThat(logoutResult.getResponse().getHeader(HttpHeaders.SET_COOKIE))
                .contains(refreshCookieService.cookieName() + "=")
                .contains("Max-Age=0");
    }

    @Test
    void catalogStreamRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/catalog/stream"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void studentCannotAccessAdminTicketListing() throws Exception {
        String studentToken = tokenFor("student1", "password");
        mockMvc.perform(get("/api/tickets")
                .header("Authorization", "Bearer " + studentToken))
            .andExpect(status().isForbidden());
    }

    @Test
    void maintenanceCanAccessAssignedTickets() throws Exception {
        String maintenanceToken = tokenFor("maintenance1", "password");
        mockMvc.perform(get("/api/tickets/assigned")
                .header("Authorization", "Bearer " + maintenanceToken))
            .andExpect(status().isOk());
    }

    @Test
    void adminCanFetchAssignmentRecommendationsForApprovedTicket() throws Exception {
        Ticket ticket = prepareApprovedTicket();
        String adminToken = tokenFor("admin", "password");

        MvcResult result = mockMvc.perform(get("/api/tickets/%d/assignment-recommendations".formatted(ticket.getId()))
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.isArray()).isTrue();
        assertThat(json).isNotEmpty();
        assertThat(json.get(0).get("userId").asLong()).isPositive();
        assertThat(json.get(0).get("reasons").isArray()).isTrue();
    }

    @Test
    void attachmentEndpointRejectsUnsignedRequests() throws Exception {
        Ticket ticket = prepareTicketWithImage();

        mockMvc.perform(get("/api/tickets/%d/attachments/before".formatted(ticket.getId())))
            .andExpect(status().isForbidden());
    }

    @Test
    void attachmentEndpointServesSignedUrls() throws Exception {
        Ticket ticket = prepareTicketWithImage();
        String signedUrl = ticketAttachmentAccessService.buildSignedUrl(ticket, AttachmentType.BEFORE, ticket.getImagePath());

        mockMvc.perform(get(signedUrl))
            .andExpect(status().isOk())
            .andExpect(result -> assertThat(result.getResponse().getContentType()).startsWith("image/png"));
    }

    private String tokenFor(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"%s","password":"%s"}
                    """.formatted(username, password)))
            .andExpect(status().isOk())
            .andReturn();
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("accessToken").asText();
    }

    private String refreshCookieValue(MvcResult result) {
        String setCookie = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        String prefix = refreshCookieService.cookieName() + "=";
        assertThat(setCookie).isNotBlank().contains(prefix);
        int start = setCookie.indexOf(prefix) + prefix.length();
        int end = setCookie.indexOf(';', start);
        return end >= 0 ? setCookie.substring(start, end) : setCookie.substring(start);
    }

    private Ticket prepareTicketWithImage() {
        Ticket ticket = ticketRepository.findAll().stream().findFirst().orElseThrow();
        if (ticket.getImagePath() == null) {
            MockMultipartFile image = new MockMultipartFile("image", "ticket.png", "image/png", PNG_BYTES);
            ticket.setImagePath(fileStorageService.store(image));
            ticket = ticketRepository.save(ticket);
        }
        return ticket;
    }

    private Ticket prepareApprovedTicket() {
        Ticket ticket = ticketRepository.findAll().stream().findFirst().orElseThrow();
        ticket.setAssignedTo(null);
        ticket.setStatus(TicketStatus.APPROVED);
        return ticketRepository.save(ticket);
    }
}
