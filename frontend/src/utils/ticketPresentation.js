import { titleCase } from "./helpers";

export const getTicketServiceDomainKey = (ticket) => ticket?.serviceDomainKey || ticket?.category || "OTHER";

export const getTicketServiceDomainLabel = (ticket) => titleCase(getTicketServiceDomainKey(ticket));

export const getTicketRequestTypeLabel = (ticket) => ticket?.requestType?.label || getTicketServiceDomainLabel(ticket);

export const getTicketBuildingName = (ticket) => ticket?.building?.name || "Unknown building";

export const getTicketBuildingCode = (ticket) => ticket?.building?.code || "";

export const getTicketLocationSummary = (ticket) => {
  const buildingName = getTicketBuildingName(ticket);
  if (!ticket?.location) {
    return buildingName;
  }
  return `${buildingName} | ${ticket.location}`;
};
