export const frictionPoints = [
  {
    title: "Leads arrive, but follow-up is inconsistent.",
    copy: "Inquiries move between forms, calls, inboxes, and text messages without one reliable path to ownership and response.",
  },
  {
    title: "The team runs on texts and spreadsheets.",
    copy: "Daily information is scattered, difficult to search, and dependent on people remembering what happened.",
  },
  {
    title: "Manual work keeps multiplying.",
    copy: "Employees repeat updates, re-enter data, and move information between tools that were never designed to work together.",
  },
  {
    title: "Management cannot see the full operation.",
    copy: "Jobs, customers, schedules, exceptions, and performance live in separate places, limiting timely decisions.",
  },
  {
    title: "The customer experience no longer fits the business.",
    copy: "The website, intake process, booking flow, or communication system feels behind the quality of the service itself.",
  },
  {
    title: "A process that once worked no longer scales.",
    copy: "More people, customers, locations, and requests expose the limits of workflows built for an earlier stage of the company.",
  },
] as const;

export const capabilities = [
  {
    title: "Websites & Digital Presence",
    copy: "Customer-facing experiences that clarify the offer, earn trust, support discovery, and create a useful path into the business.",
    examples: "Business websites, landing pages, service architecture, SEO foundations, analytics",
  },
  {
    title: "Custom Business Software",
    copy: "Purpose-built applications for workflows that do not fit an off-the-shelf product or a collection of workarounds.",
    examples: "Portals, dashboards, role-based tools, internal applications, full-stack platforms",
  },
  {
    title: "Operations Systems",
    copy: "Connected environments for coordinating people, work, information, accountability, and management visibility.",
    examples: "Scheduling, work tracking, field operations, records, reporting, owner controls",
  },
  {
    title: "Mobile Applications",
    copy: "Focused mobile products designed around touch, context, device storage, and the moments work actually happens.",
    examples: "iOS and Android applications, local-first tools, task flows, native interaction design",
  },
  {
    title: "Automation & Integrations",
    copy: "Reliable connections that move information between the tools a business already uses and reduce repetitive handoffs.",
    examples: "Intake routing, notifications, system connections, workflow automation, follow-up flows",
  },
  {
    title: "Data / API Systems",
    copy: "Infrastructure for collecting, normalizing, storing, searching, and acting on complex internal or external data.",
    examples: "APIs, ingestion pipelines, databases, geospatial systems, alerts, provider resilience",
  },
] as const;

export const processSteps = [
  ["Diagnose", "Understand the business, goals, bottlenecks, current tools, and opportunity."],
  ["Map", "Determine where technology can create value and what system is actually needed."],
  ["Design", "Define the workflow, experience, architecture, and interactions before development begins."],
  ["Build", "Develop and integrate the solution with maintainable implementation and clear checkpoints."],
  ["Launch", "Test, deploy, transition, and prepare the system for real use."],
  ["Improve", "Maintain, measure, refine, extend, and automate further as the business evolves."],
] as const;
