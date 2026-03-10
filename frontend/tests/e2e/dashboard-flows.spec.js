import { expect, test } from "@playwright/test";

const NOW = "2026-03-08T09:00:00.000Z";

test.setTimeout(90_000);

const makeSession = (role, overrides = {}) => ({
  accessToken: `${role.toLowerCase()}-access-token`,
  expiresAt: "2026-03-08T12:00:00.000Z",
  username: `${role.toLowerCase()}1`,
  fullName: `${role} User`,
  role,
  ...overrides,
});

const ticketUser = (id, username, fullName, role) => ({ id, username, fullName, role });
const building = (id, name, code, active = true) => ({ id, name, code, active });
const requestType = (id, label, serviceDomainKey) => ({ id, label, serviceDomainKey });

const makeTicket = ({
  id,
  title,
  serviceDomainKey = "IT",
  requestTypeLabel = "Network Support",
  requestTypeId = 11,
  buildingId = 1,
  buildingName = "Main Library",
  buildingCode = "LIB",
  location = "Floor 2",
  urgency = "MEDIUM",
  status = "SUBMITTED",
  createdBy,
  assignedTo = null,
  createdAt = NOW,
  updatedAt = NOW,
  resolvedAt = null,
  imageUrl = null,
  afterImageUrl = null,
  description = "Campus maintenance issue.",
}) => ({
  id,
  title,
  description,
  category: serviceDomainKey,
  serviceDomainKey,
  requestType: { id: requestTypeId, label: requestTypeLabel },
  building: { id: buildingId, name: buildingName, code: buildingCode },
  location,
  urgency,
  status,
  createdBy,
  assignedTo,
  imageUrl,
  afterImageUrl,
  createdAt,
  updatedAt,
  resolvedAt,
});

const json = async (route, body, status = 200) => {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
};

const requestBody = (request) => {
  const raw = request.postData();
  if (!raw) {
    return {};
  }
  try {
    return request.postDataJSON();
  } catch {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
};

async function mockCommonApi(page, session, extraHandler) {
  const sessionState = { ...session };
  let loggedOut = false;
  const notifications = [
    {
      id: 1,
      title: "Campus update",
      message: "A tracked ticket has changed status.",
      type: "TICKET_UPDATE",
      read: false,
      linkUrl: "",
      createdAt: NOW,
    },
  ];

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    if (path === "/api/auth/refresh" && method === "POST") {
      if (loggedOut) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Unauthorized" }),
        });
        return;
      }
      await json(route, sessionState);
      return;
    }

    if (path === "/api/auth/logout" && method === "POST") {
      loggedOut = true;
      await json(route, { message: "Logged out." });
      return;
    }

    if (path === "/api/auth/me" && method === "GET") {
      await json(route, sessionState);
      return;
    }

    if (path === "/api/catalog/stream" && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        headers: {
          "cache-control": "no-cache",
          connection: "keep-alive",
        },
        body: "event: ping\ndata: {\"resource\":\"noop\"}\n\n",
      });
      return;
    }

    if (path === "/api/notifications" && method === "GET") {
      await json(route, notifications);
      return;
    }

    if (path === "/api/notifications/unread-count" && method === "GET") {
      await json(route, notifications.filter((item) => !item.read).length);
      return;
    }

    if (/^\/api\/notifications\/\d+\/read$/.test(path) && method === "PUT") {
      const notificationId = Number(path.split("/")[3]);
      const notification = notifications.find((item) => item.id === notificationId);
      if (notification) notification.read = true;
      await json(route, {});
      return;
    }

    if (path === "/api/notifications/read-all" && method === "PUT") {
      notifications.forEach((item) => {
        item.read = true;
      });
      await json(route, {});
      return;
    }

    if (path === "/api/users/me" && method === "PATCH") {
      const payload = requestBody(request);
      sessionState.fullName = payload.fullName;
      await json(route, {
        id: 1,
        username: sessionState.username,
        fullName: sessionState.fullName,
        role: sessionState.role,
      });
      return;
    }

    if (path === "/api/analytics/public-summary" && method === "GET") {
      await json(route, {
        totalTickets: 42,
        resolvedTickets: 29,
        openTickets: 13,
        resolvedToday: 4,
        averageResolutionHours: 18,
        resolvedLast7Days: [2, 4, 3, 5, 6, 4, 5],
        lastUpdatedAt: NOW,
      });
      return;
    }

    if (path === "/api/analytics/public-config" && method === "GET") {
      await json(route, {
        supportHours: "Mon-Fri, 08:00-20:00",
        supportPhone: "+254 747988030",
        supportTimezone: "EAT (UTC+03:00)",
        urgentSlaHours: 2,
        standardSlaHours: 24,
      });
      return;
    }

    if (extraHandler && await extraHandler({ route, request, path, method, url, sessionState })) {
      return;
    }

    throw new Error(`Unhandled API request: ${method} ${path}`);
  });
}

test("student dashboard supports create, export, rating, notifications, profile updates, and logout", async ({ page }) => {
  const session = makeSession("STUDENT", {
    username: "student1",
    fullName: "Alex Student",
  });
  const studentUser = ticketUser(21, "student1", "Alex Student", "STUDENT");
  const tickets = [
    makeTicket({
      id: 102,
      title: "Air conditioner serviced",
      status: "RESOLVED",
      urgency: "LOW",
      createdBy: studentUser,
      requestTypeLabel: "Cooling Repair",
      serviceDomainKey: "HVAC",
      requestTypeId: 18,
      buildingName: "Science Block",
      buildingCode: "SCI",
      buildingId: 2,
      location: "Lab 4",
      resolvedAt: NOW,
    }),
    makeTicket({
      id: 101,
      title: "Library printer jam",
      status: "SUBMITTED",
      urgency: "HIGH",
      createdBy: studentUser,
      requestTypeLabel: "Printer Support",
      requestTypeId: 12,
      location: "Floor 1 service desk",
    }),
  ];
  const details = {
    101: {
      ticket: tickets[1],
      logs: [{ id: 1, oldStatus: null, newStatus: "SUBMITTED", note: "Ticket submitted", changedBy: studentUser, timestamp: NOW }],
      rating: null,
    },
    102: {
      ticket: tickets[0],
      logs: [
        { id: 2, oldStatus: null, newStatus: "SUBMITTED", note: "Ticket submitted", changedBy: studentUser, timestamp: NOW },
        { id: 3, oldStatus: "IN_PROGRESS", newStatus: "RESOLVED", note: "Replaced worn parts", changedBy: ticketUser(31, "maintenance1", "Casey Technician", "MAINTENANCE"), timestamp: NOW },
      ],
      rating: null,
    },
  };
  let createdPayload = null;
  let ratingPayload = null;

  await mockCommonApi(page, session, async ({ route, request, path, method, url }) => {
    if (path === "/api/buildings" && method === "GET") {
      await json(route, [building(1, "Main Library", "LIB"), building(2, "Science Block", "SCI")]);
      return true;
    }
    if (path === "/api/catalog/service-domains" && method === "GET") {
      await json(route, [
        { id: 1, key: "IT", label: "IT" },
        { id: 2, key: "HVAC", label: "HVAC" },
      ]);
      return true;
    }
    if (path === "/api/catalog/request-types" && method === "GET") {
      const domain = url.searchParams.get("serviceDomainKey");
      await json(route, domain === "IT"
        ? [requestType(12, "Printer Support", "IT")]
        : [requestType(18, "Cooling Repair", "HVAC")]);
      return true;
    }
    if (path === "/api/tickets/my" && method === "GET") {
      await json(route, tickets);
      return true;
    }
    if (path === "/api/tickets" && method === "POST") {
      createdPayload = requestBody(request);
      const newTicket = makeTicket({
        id: 103,
        title: createdPayload.title,
        description: createdPayload.description,
        serviceDomainKey: "IT",
        requestTypeLabel: "Printer Support",
        requestTypeId: 12,
        buildingName: "Science Block",
        buildingCode: "SCI",
        buildingId: 2,
        location: createdPayload.location,
        urgency: createdPayload.urgency,
        status: "SUBMITTED",
        createdBy: studentUser,
      });
      tickets.unshift(newTicket);
      details[103] = {
        ticket: newTicket,
        logs: [{ id: 4, oldStatus: null, newStatus: "SUBMITTED", note: "Ticket submitted", changedBy: studentUser, timestamp: NOW }],
        rating: null,
      };
      await json(route, newTicket, 201);
      return true;
    }
    if (/^\/api\/tickets\/\d+$/.test(path) && method === "GET") {
      await json(route, details[path.split("/").pop()]);
      return true;
    }
    if (/^\/api\/tickets\/\d+\/rate$/.test(path) && method === "POST") {
      ratingPayload = requestBody(request);
      const ticketId = Number(path.split("/")[3]);
      details[ticketId].rating = {
        stars: ratingPayload.stars,
        comment: ratingPayload.comment,
        ratedBy: studentUser,
        createdAt: NOW,
      };
      await json(route, details[ticketId].rating, 201);
      return true;
    }
    return false;
  });

  await page.goto("/student");

  await expect(page.locator(".dashboard-hero-title")).toContainText("Alex Student");
  await expect(page.locator('[data-dashboard-nav-id="report"]')).toHaveCount(1);
  await expect(page.locator("nav [data-dashboard-nav-id]").first()).toHaveAttribute("data-dashboard-nav-id", "dashboard");
  await expect(page.locator("nav [data-dashboard-nav-id]").nth(1)).toHaveAttribute("data-dashboard-nav-id", "report");
  await page.locator('[data-dashboard-nav-id="report"]').click();
  await expect(page.locator("#report")).toBeVisible();
  await expect(page.locator(".command-topbar")).toContainText("Submit Issue");
  await page.getByRole("button", { name: "Close composer" }).click();

  await page.locator(".dashboard-hero").getByRole("button", { name: "Submit Issue" }).click();
  await expect(page.locator("#report")).toBeVisible();
  await page.getByRole("button", { name: "Close composer" }).click();

  await page.getByRole("button", { name: "Collapse" }).click();
  await page.locator('[data-dashboard-nav-id="report"]').click();
  await expect(page.locator("#report")).toBeVisible();

  await page.locator('input[placeholder="Short summary of the issue"]').fill("Printer jam in Lab 2");
  await page.locator("select").nth(0).selectOption("IT");
  await page.locator('textarea[placeholder*="What happened"]').fill("The shared printer keeps jamming after every second page.");
  await page.locator("select").nth(1).selectOption("12");
  await page.locator("select").nth(2).selectOption("2");
  await page.locator('input[placeholder="Room, floor, wing, or nearby landmark"]').fill("Lab 2");
  await page.locator("select").nth(3).selectOption("HIGH");
  await page.getByRole("button", { name: "Submit Request" }).click();

  await expect.poll(() => createdPayload).not.toBeNull();
  expect(createdPayload).toMatchObject({
    title: "Printer jam in Lab 2",
    requestTypeId: 12,
    buildingId: 2,
    urgency: "HIGH",
  });
  const studentRequestLog = page.locator(".data-table-wrapper").first();
  await expect(studentRequestLog).toContainText("Printer jam in Lab 2");

  const downloadPromise = page.waitForEvent("download");
  const studentExport = studentRequestLog.locator(".export-dropdown").first();
  await studentExport.getByRole("button", { name: "Export" }).click();
  await studentExport.getByRole("button", { name: "Export CSV", exact: true }).click();
  await downloadPromise;

  await studentRequestLog
    .locator(".dashboard-mobile-card:visible, tbody tr:visible")
    .filter({ hasText: "Air conditioner serviced" })
    .first()
    .click();
  await page.getByPlaceholder("Add a comment about the resolution...").fill("Fixed properly and quickly.");
  await page.getByRole("button", { name: "Submit Rating" }).click();

  await expect.poll(() => ratingPayload).not.toBeNull();
  expect(ratingPayload).toEqual({ stars: 5, comment: "Fixed properly and quickly." });
  await expect(page.getByText("Fixed properly and quickly.")).toBeVisible();
  await page.getByRole("button", { name: "Close modal" }).click();

  await page.locator(".dashboard-topbar-btn").first().click();
  await expect(page.getByText("Campus update")).toBeVisible();
  await page.getByText("Campus update").click();
  await expect(page.locator(".dashboard-topbar-btn").first()).not.toContainText("1");

  await page.locator(".dashboard-user-trigger").click();
  await page.getByRole("button", { name: "Profile" }).click();
  const profileModal = page.locator(".dashboard-modal-panel").last();
  await page.getByPlaceholder("Enter your full name").fill("Alex Student Updated");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await profileModal.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Alex Student Updated/ })).toBeVisible();

  await page.locator(".dashboard-user-trigger").click();
  await page.locator(".dashboard-user-menu").getByRole("button", { name: "Sign Out" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: /Contact Support/i }).first()).toBeVisible();
});

test("student sidebar submit issue CTA opens the composer from the mobile drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const session = makeSession("STUDENT", {
    username: "student2",
    fullName: "Jamie Student",
  });
  const studentUser = ticketUser(22, "student2", "Jamie Student", "STUDENT");
  const tickets = [
    makeTicket({
      id: 104,
      title: "Leaking sink in west block",
      status: "IN_PROGRESS",
      urgency: "HIGH",
      createdBy: studentUser,
      requestTypeLabel: "Pipe Leak",
      requestTypeId: 15,
      serviceDomainKey: "PLUMBING",
      buildingName: "West Block",
      buildingCode: "WST",
      buildingId: 3,
      location: "Ground floor washroom",
    }),
  ];

  await mockCommonApi(page, session, async ({ route, path, method, url }) => {
    if (path === "/api/buildings" && method === "GET") {
      await json(route, [building(3, "West Block", "WST")]);
      return true;
    }
    if (path === "/api/catalog/service-domains" && method === "GET") {
      await json(route, [{ id: 2, key: "PLUMBING", label: "Plumbing" }]);
      return true;
    }
    if (path === "/api/catalog/request-types" && method === "GET") {
      const domain = url.searchParams.get("serviceDomainKey");
      await json(route, domain === "PLUMBING" ? [requestType(15, "Pipe Leak", "PLUMBING")] : []);
      return true;
    }
    if (path === "/api/tickets/my" && method === "GET") {
      await json(route, tickets);
      return true;
    }
    return false;
  });

  await page.goto("/student");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.locator(".fixed.inset-0.z-40")).toHaveCount(1);
  await page.locator('[data-dashboard-nav-id="report"]').click();

  await expect(page.locator("#report")).toBeVisible();
  await expect(page.locator(".command-topbar")).toContainText("Submit Issue");
  await expect(page.locator(".fixed.inset-0.z-40")).toHaveCount(0);
});

test("maintenance dashboard supports queue transitions and resolved log export", async ({ page }) => {
  const session = makeSession("MAINTENANCE", {
    username: "maintenance1",
    fullName: "Casey Technician",
  });
  const maintenanceUser = ticketUser(31, "maintenance1", "Casey Technician", "MAINTENANCE");
  const studentUser = ticketUser(21, "student1", "Alex Student", "STUDENT");
  const assignedTicket = makeTicket({
    id: 201,
    title: "Generator calibration",
    status: "ASSIGNED",
    urgency: "CRITICAL",
    createdBy: studentUser,
    assignedTo: maintenanceUser,
    serviceDomainKey: "ELECTRICAL",
    requestTypeLabel: "Generator Check",
    requestTypeId: 41,
    location: "Engineering Block - Ground Floor",
  });
  const resolvedTicket = makeTicket({
    id: 202,
    title: "Projector lens replaced",
    status: "RESOLVED",
    urgency: "LOW",
    createdBy: studentUser,
    assignedTo: maintenanceUser,
    resolvedAt: NOW,
    serviceDomainKey: "IT",
    requestTypeLabel: "Projector Repair",
    requestTypeId: 42,
    location: "Auditorium",
  });
  const tickets = [assignedTicket, resolvedTicket];
  const details = {
    201: {
      ticket: assignedTicket,
      logs: [{ id: 1, oldStatus: "APPROVED", newStatus: "ASSIGNED", note: "Assigned to Casey Technician", changedBy: ticketUser(11, "admin1", "Campus Admin", "ADMIN"), timestamp: NOW }],
      rating: null,
    },
    202: {
      ticket: resolvedTicket,
      logs: [{ id: 2, oldStatus: "IN_PROGRESS", newStatus: "RESOLVED", note: "Lens replaced", changedBy: maintenanceUser, timestamp: NOW }],
      rating: { stars: 5, comment: "Great fix.", ratedBy: studentUser, createdAt: NOW },
    },
  };

  await mockCommonApi(page, session, async ({ route, request, path, method }) => {
    if (path === "/api/tickets/assigned" && method === "GET") {
      await json(route, tickets);
      return true;
    }
    if (path === "/api/catalog/service-domains" && method === "GET") {
      await json(route, [
        { id: 1, key: "ELECTRICAL", label: "Electrical" },
        { id: 2, key: "IT", label: "IT" },
      ]);
      return true;
    }
    if (path === "/api/catalog/request-types" && method === "GET") {
      await json(route, [
        requestType(41, "Generator Check", "ELECTRICAL"),
        requestType(42, "Projector Repair", "IT"),
      ]);
      return true;
    }
    if (path === "/api/buildings" && method === "GET") {
      await json(route, [building(1, "Engineering Block", "ENG"), building(2, "Auditorium", "AUD")]);
      return true;
    }
    if (/^\/api\/tickets\/\d+\/status$/.test(path) && method === "PATCH") {
      const ticketId = Number(path.split("/")[3]);
      const payload = requestBody(request);
      const ticket = tickets.find((item) => item.id === ticketId);
      ticket.status = payload.status;
      ticket.updatedAt = NOW;
      if (payload.status === "RESOLVED") {
        ticket.resolvedAt = NOW;
      }
      details[ticketId].ticket = { ...ticket };
      await json(route, ticket);
      return true;
    }
    if (/^\/api\/tickets\/\d+$/.test(path) && method === "GET") {
      await json(route, details[path.split("/").pop()]);
      return true;
    }
    return false;
  });

  await page.goto("/maintenance");

  await expect(page.locator(".dashboard-hero-title")).toContainText("Casey Technician");
  await expect(page.locator('[data-dashboard-nav-id="report"]')).toHaveCount(0);
  await expect(page.getByText("Generator calibration")).toBeVisible();

  await page.getByRole("button", { name: "Start Work" }).click();
  await expect(page.getByRole("button", { name: "Mark Resolved" })).toBeVisible();
  await page.getByPlaceholder("Add work note...").fill("Calibrated controls and verified stable output.");
  await page.getByRole("button", { name: "Mark Resolved" }).click();
  const maintenanceResolvedLog = page.locator(".data-table-wrapper").first();
  await expect(maintenanceResolvedLog).toContainText("Projector lens replaced");
  await expect(maintenanceResolvedLog).toContainText("Generator calibration");

  const downloadPromise = page.waitForEvent("download");
  const maintenanceExport = maintenanceResolvedLog.locator(".export-dropdown").first();
  await maintenanceExport.getByRole("button", { name: "Export" }).click();
  await maintenanceExport.getByRole("button", { name: "Export CSV", exact: true }).click();
  await downloadPromise;
});

test("admin dashboard supports export, assignment, override, staff invite, broadcast scheduling, and cancellation", async ({ page }) => {
  const session = makeSession("ADMIN", {
    username: "admin1",
    fullName: "Campus Admin",
  });
  const maintenanceUser = ticketUser(31, "maintenance1", "Casey Technician", "MAINTENANCE");
  const submittedTicket = makeTicket({
    id: 301,
    title: "Main hall lighting outage",
    status: "SUBMITTED",
    urgency: "HIGH",
    createdBy: ticketUser(21, "student1", "Alex Student", "STUDENT"),
    requestTypeLabel: "Lighting Repair",
    requestTypeId: 51,
    serviceDomainKey: "ELECTRICAL",
    buildingName: "Main Hall",
    buildingCode: "MHL",
    buildingId: 5,
    location: "Main Hall - East Wing",
  });
  const tickets = [submittedTicket];
  const details = {
    301: {
      ticket: submittedTicket,
      logs: [{ id: 1, oldStatus: null, newStatus: "SUBMITTED", note: "Ticket submitted", changedBy: submittedTicket.createdBy, timestamp: NOW }],
      rating: null,
    },
  };
  const users = [
    { id: 11, username: "admin1", fullName: "Campus Admin", role: "ADMIN", email: "admin@example.com", ticketCount: 5 },
    { id: 31, username: "maintenance1", fullName: "Casey Technician", role: "MAINTENANCE", email: "casey@example.com", ticketCount: 12 },
    { id: 21, username: "student1", fullName: "Alex Student", role: "STUDENT", email: "alex@example.com", ticketCount: 3 },
  ];
  const scheduledEvents = [];
  let invitePayload = null;
  let broadcastPayload = null;
  let schedulePayload = null;
  let overridePayload = null;
  let recommendationRequestCount = 0;

  await mockCommonApi(page, session, async ({ route, request, path, method }) => {
    if (path === "/api/analytics/summary" && method === "GET") {
      await json(route, { totalTickets: 1, byStatus: { SUBMITTED: 1, APPROVED: 0, ASSIGNED: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 } });
      return true;
    }
    if (path === "/api/analytics/resolution-time" && method === "GET") {
      await json(route, { overallAverageHours: 18 });
      return true;
    }
    if (path === "/api/analytics/top-buildings" && method === "GET") {
      await json(route, [{ building: "Main Hall", totalIssues: 1 }]);
      return true;
    }
    if (path === "/api/analytics/crew-performance" && method === "GET") {
      await json(route, [{ fullName: "Casey Technician", resolvedTickets: 7 }]);
      return true;
    }
    if (path === "/api/tickets" && method === "GET") {
      await json(route, tickets);
      return true;
    }
    if (path === "/api/admin/config/buildings" && method === "GET") {
      await json(route, [building(5, "Main Hall", "MHL"), building(6, "Engineering Block", "ENG")]);
      return true;
    }
    if (path === "/api/catalog/service-domains" && method === "GET") {
      await json(route, [{ id: 1, key: "ELECTRICAL", label: "Electrical" }]);
      return true;
    }
    if (path === "/api/admin/config/request-types" && method === "GET") {
      await json(route, [requestType(51, "Lighting Repair", "ELECTRICAL")]);
      return true;
    }
    if (path === "/api/admin/config/support-categories" && method === "GET") {
      await json(route, [{ id: 1, label: "Facilities", active: true }]);
      return true;
    }
    if (path === "/api/users" && method === "GET") {
      await json(route, users);
      return true;
    }
    if (path === "/api/users/maintenance" && method === "GET") {
      await json(route, [maintenanceUser]);
      return true;
    }
    if (path === "/api/users/broadcast/scheduled" && method === "GET") {
      await json(route, scheduledEvents);
      return true;
    }
    if (path === "/api/auth/username-suggestions" && method === "GET") {
      await json(route, { suggestions: ["casey.tech", "casey.ops"] });
      return true;
    }
    if (path === "/api/users/staff" && method === "POST") {
      invitePayload = requestBody(request);
      const result = { username: invitePayload.username, email: invitePayload.email, expiresAt: "2026-03-10T09:00:00.000Z" };
      await json(route, result, 201);
      return true;
    }
    if (path === "/api/users/broadcast" && method === "POST") {
      broadcastPayload = requestBody(request);
      await json(route, { recipientCount: 24, audience: broadcastPayload.audience }, 201);
      return true;
    }
    if (path === "/api/users/broadcast/scheduled" && method === "POST") {
      schedulePayload = requestBody(request);
      const event = { id: 901, title: schedulePayload.title, audience: schedulePayload.audience, status: "PENDING", scheduledFor: schedulePayload.scheduledFor, recipientCount: 0 };
      scheduledEvents.push(event);
      await json(route, event, 201);
      return true;
    }
    if (/^\/api\/users\/broadcast\/scheduled\/\d+\/cancel$/.test(path) && method === "POST") {
      const eventId = Number(path.split("/")[5]);
      const event = scheduledEvents.find((item) => item.id === eventId);
      if (event) event.status = "CANCELLED";
      await json(route, event || {});
      return true;
    }
    if (/^\/api\/tickets\/\d+$/.test(path) && method === "GET") {
      await json(route, details[path.split("/").pop()]);
      return true;
    }
    if (/^\/api\/tickets\/\d+\/assignment-recommendations$/.test(path) && method === "GET") {
      recommendationRequestCount += 1;
      await json(route, [
        {
          userId: maintenanceUser.id,
          username: maintenanceUser.username,
          fullName: maintenanceUser.fullName,
          score: 87.4,
          reasons: [
            "Lowest active workload in the current maintenance pool.",
            "Resolved 4 similar service-domain tickets.",
          ],
        },
      ]);
      return true;
    }
    if (/^\/api\/tickets\/\d+\/status$/.test(path) && method === "PATCH") {
      const ticketId = Number(path.split("/")[3]);
      const payload = requestBody(request);
      const ticket = tickets.find((item) => item.id === ticketId);
      if (payload.override) {
        overridePayload = payload;
      }
      ticket.status = payload.status;
      ticket.updatedAt = NOW;
      details[ticketId].ticket = { ...ticket };
      await json(route, ticket);
      return true;
    }
    if (/^\/api\/tickets\/\d+\/assign$/.test(path) && method === "PATCH") {
      const ticketId = Number(path.split("/")[3]);
      const ticket = tickets.find((item) => item.id === ticketId);
      ticket.status = "ASSIGNED";
      ticket.assignedTo = maintenanceUser;
      details[ticketId].ticket = { ...ticket };
      await json(route, ticket);
      return true;
    }
    return false;
  });

  await page.goto("/admin");

  await expect(page.locator(".dashboard-hero-title")).toContainText("Campus Admin");
  await expect(page.locator('[data-dashboard-nav-id="report"]')).toHaveCount(0);

  const downloadPromise = page.waitForEvent("download");
  const adminReportScope = page.locator("#reports");
  const adminExport = adminReportScope.locator(".export-dropdown").first();
  await adminExport.getByRole("button", { name: "Export" }).click();
  await adminExport.getByRole("button", { name: "Export CSV", exact: true }).click();
  await downloadPromise;

  await page.locator("#tickets").locator(".dashboard-mobile-card:visible, tbody tr:visible").first().click();
  const modal = page.locator(".dashboard-modal-panel").last();
  await modal.getByRole("button", { name: "Approve" }).click();
  await expect.poll(() => recommendationRequestCount).toBeGreaterThan(0);
  await expect(modal.getByText("Assignment recommendations")).toBeVisible();
  await modal.getByRole("button", { name: /Casey Technician/ }).click();
  await expect(modal.locator("select")).toHaveCount(2);
  await modal.locator("select").nth(0).selectOption("31");
  await modal.getByRole("button", { name: "Assign Ticket" }).click();
  await expect(modal.locator("select")).toHaveCount(1);
  await modal.locator("select").nth(0).selectOption("IN_PROGRESS");
  await modal.locator('input[placeholder="Override reason..."]').fill("Escalated manual override");
  await modal.getByRole("button", { name: "Override" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();

  await expect.poll(() => overridePayload).not.toBeNull();
  expect(overridePayload).toMatchObject({
    status: "IN_PROGRESS",
    note: "Escalated manual override",
    override: true,
  });

  await modal.getByRole("button", { name: "Close modal" }).click();

  await page.locator('input[name="username"]').fill("casey.ops");
  await page.locator('input[name="fullName"]').fill("Casey Ops");
  await page.locator('input[name="email"]').fill("casey.ops@example.com");
  await page.getByRole("button", { name: "Send Invite" }).click();
  await expect.poll(() => invitePayload).not.toBeNull();
  expect(invitePayload).toMatchObject({ username: "casey.ops", fullName: "Casey Ops", email: "casey.ops@example.com" });
  await expect(page.getByText("Invite queued.")).toBeVisible();

  await page.locator('input[placeholder="e.g. Urgent water shutdown update"]').fill("Water service notice");
  await page.locator('textarea[placeholder*="announcement message"]').fill("Water service will be interrupted for one hour.");
  await page.getByRole("button", { name: "Send Broadcast" }).click();
  await expect.poll(() => broadcastPayload).not.toBeNull();
  expect(broadcastPayload).toMatchObject({ title: "Water service notice", audience: "ALL" });

  await page
    .locator("#broadcast")
    .getByRole("button", { name: "Schedule Event" })
    .first()
    .evaluate((button) => button.click());
  await expect(page.locator('#broadcast input[placeholder="e.g. Planned electrical maintenance - Block B"]')).toBeVisible();
  const scheduleForm = page.locator("#broadcast form").first();
  await scheduleForm.locator('input[placeholder="e.g. Planned electrical maintenance - Block B"]').fill("Campus inspection");
  await scheduleForm.locator('input[type="datetime-local"]').fill("2026-03-09T09:30");
  await scheduleForm.locator('textarea[placeholder*="scheduled time"]').fill("Inspection team will access the north wing.");
  await scheduleForm.evaluate((form) => form.requestSubmit());
  await expect.poll(() => schedulePayload).not.toBeNull();
  expect(schedulePayload).toMatchObject({ title: "Campus inspection", audience: "ALL" });
  await expect(page.getByText("Campus inspection")).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
});
