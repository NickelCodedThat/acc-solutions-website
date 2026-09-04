export type CaseCategory = "system" | "client";
export type CaseVisual = "operations" | "data" | "architecture" | "mobile" | "client";

export interface CaseMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  position?: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  shortName: string;
  category: CaseCategory;
  visual: CaseVisual;
  type: string;
  status: string;
  headline: string;
  summary: string;
  context: string;
  problem: readonly string[];
  approach: readonly string[];
  walkthrough: readonly { title: string; description: string }[];
  technical: readonly string[];
  proofPoints: readonly string[];
  businessPurpose: string;
  media: readonly CaseMedia[];
  architecture?: {
    label: string;
    nodes: readonly string[];
  };
  liveUrl?: string;
  repositoryUrl?: string;
  relatedCapabilities: readonly string[];
  related: readonly string[];
  seoDescription: string;
}

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "crew-command",
    name: "Crew Command",
    shortName: "Crew Command",
    category: "system",
    visual: "operations",
    type: "Custom operations platform",
    status: "Active Development",
    headline: "Turning a real operating process into purpose-built software.",
    summary:
      "Crew Command is a role-based operations platform for coordinating people, properties, shifts, attendance, work completion, handoffs, hours, and daily management visibility.",
    context:
      "Operational work rarely begins in software. It begins with a crew, a property, a schedule, an exception, and the need to know what happened. Crew Command translates that real-world sequence into one connected system.",
    problem: [
      "Schedules, time records, work requirements, handoffs, and team communication can become distributed across texts, spreadsheets, paper, and memory.",
      "Generic workforce tools may record isolated events without reflecting the rules that connect a shift, property, checklist, attendance session, and completed history.",
    ],
    approach: [
      "ACC modeled the operation around employer and employee roles, then built each workflow around what a person needs to do before, during, and after a shift.",
      "Validation, persistence, audit history, timezone handling, and production database behavior are treated as product requirements rather than implementation details.",
    ],
    walkthrough: [
      { title: "Plan the work", description: "Owners create shifts, assign employees directly, or publish open shifts for pickup." },
      { title: "Connect place and responsibility", description: "Properties, assignments, roles, and shift details establish the operational context." },
      { title: "Record attendance", description: "Clock-in and clock-out sessions create durable worked-time records, including overnight shifts." },
      { title: "Resolve the work", description: "Shift checklists require completion or a documented exception before employee clock-out." },
      { title: "Preserve the handoff", description: "Handoffs and employee-to-owner messages retain context beyond the active shift." },
      { title: "Review and correct", description: "Owner dashboards, hours, gross-pay estimates, corrections, manual entries, and administrative clock-out support oversight." },
    ],
    technical: ["Next.js", "React", "TypeScript", "Prisma", "Turso / libSQL", "Authentication", "Zod validation", "Vitest", "Playwright"],
    proofPoints: [
      "Employer and employee permissions",
      "Shift pickup, assignment, and drop flows",
      "Historical checklists and handoffs",
      "Time corrections and manual hour entries",
      "Production persistence and migrations",
      "DST-aware operating-time handling",
    ],
    businessPurpose:
      "The purpose is not simply to digitize a schedule. It is to give the operation one dependable place to coordinate work, preserve records, and understand what is happening across the business.",
    media: [
      {
        src: "/images/proof/crew-command-shifts.png",
        alt: "Current Crew Command owner shift creation screen with scheduling and assignment controls",
        width: 1098,
        height: 900,
        caption: "Owner scheduling workflow in the current CCV2 build.",
        position: "top center",
      },
      {
        src: "/images/proof/crew-command-dashboard.png",
        alt: "Current Crew Command owner dashboard with attendance, work progress, handoffs, and upcoming shifts",
        width: 1098,
        height: 900,
        caption: "The command view connects live activity with operational context.",
        position: "top center",
      },
    ],
    architecture: {
      label: "Operational record",
      nodes: ["Organization", "People + roles", "Properties", "Shifts", "Attendance + work", "History + oversight"],
    },
    relatedCapabilities: ["Custom Business Software", "Operations Systems"],
    related: ["storm-chaser", "sift"],
    seoDescription:
      "Crew Command case study: how ACC Solutions designed and built custom operations software around scheduling, attendance, work records, handoffs, and management visibility.",
  },
  {
    slug: "storm-chaser",
    name: "Storm Chaser / SCV2",
    shortName: "Storm Chaser",
    category: "system",
    visual: "data",
    type: "Weather intelligence application",
    status: "Development Preview",
    headline: "Normalizing independent public data into one useful experience.",
    summary:
      "Storm Chaser combines local forecasts, U.S. severe-weather intelligence, radar, tropical systems, and global natural events across a resilient interactive interface.",
    context:
      "Government, scientific, and meteorological providers publish valuable information through different schemas, geographic models, update cycles, and reliability characteristics. The application must make those differences understandable without pretending they do not exist.",
    problem: [
      "Weather alerts, radar, tropical systems, earthquakes, wildfires, floods, and other events originate from independent providers with inconsistent data shapes.",
      "A single provider failure should not prevent the rest of the experience from remaining useful.",
    ],
    approach: [
      "SCV2 uses provider-specific adapters and normalized event structures so the interface can compare and present different source types consistently.",
      "Independent loading paths, fallback behavior, saved events, and shareable state keep the experience usable while preserving source context.",
    ],
    walkthrough: [
      { title: "Local weather", description: "Open-Meteo powers current conditions, location search, hourly forecasts, and three-day context." },
      { title: "U.S. storm center", description: "NWS alerts, official geometry, filters, radar, and NHC/CPHC tropical data share one map-driven workspace." },
      { title: "Live Earth", description: "USGS, NASA EONET, GDACS, and tropical feeds are normalized into a consistent global event model." },
      { title: "Resilient state", description: "Provider isolation, last-known-good handling, saved events, and URL state protect the user experience." },
    ],
    technical: ["JavaScript ES modules", "MapLibre", "Open-Meteo", "NOAA / NWS", "NHC / CPHC", "USGS", "NASA EONET", "GDACS", "Vitest"],
    proofPoints: [
      "Official alert geometry",
      "Provider-level adapters",
      "Normalized global event records",
      "Isolated provider failures",
      "Saved and shareable event state",
      "Automated data and UI tests",
    ],
    businessPurpose:
      "SCV2 demonstrates how ACC can take a complicated external-data environment and build a clearer decision surface without flattening the nuance of the source material.",
    media: [
      {
        src: "/images/proof/storm-chaser-center.png",
        alt: "Current Storm Chaser severe-weather center with official alert geometry, filters, and event feed",
        width: 1098,
        height: 900,
        caption: "Current local SCV2 proof using live National Weather Service alert data.",
        position: "top center",
      },
    ],
    architecture: {
      label: "Normalized event layer",
      nodes: ["Public providers", "Source adapters", "Normalized models", "Resilient loading", "Map + detail views", "Saved state"],
    },
    repositoryUrl: "https://github.com/NickelCodedThat/SCV2",
    relatedCapabilities: ["Data / API Systems", "Custom Business Software"],
    related: ["new-spot", "crew-command"],
    seoDescription:
      "Storm Chaser SCV2 case study: how ACC Solutions normalized weather, mapping, NOAA, NWS, USGS, NASA EONET, and GDACS data into a resilient application.",
  },
  {
    slug: "new-spot",
    name: "New Spot",
    shortName: "New Spot",
    category: "system",
    visual: "architecture",
    type: "Rental data and search platform",
    status: "In Development",
    headline: "Designing the data foundation behind a complex rental search product.",
    summary:
      "New Spot is a separated frontend and backend system for ingesting, reconciling, storing, searching, and monitoring rental listing data.",
    context:
      "A useful rental search product depends on far more than a listing grid. Source records must be ingested, normalized, reconciled, indexed geographically, connected to accounts, and monitored over time.",
    problem: [
      "Property data can arrive from different sources with inconsistent identifiers, fields, images, locations, and update behavior.",
      "Search, saved criteria, alerts, and notifications depend on a trustworthy data model and environment-aware backend infrastructure.",
    ],
    approach: [
      "ACC separated the customer-facing frontend from Python backend services and modeled ingestion, persistence, geospatial search, account state, and notifications as distinct responsibilities.",
      "The current case study presents verified architecture rather than treating the unavailable rental-data response as a successful production experience.",
    ],
    walkthrough: [
      { title: "Ingest", description: "Source-oriented services bring listing records into a controlled backend process." },
      { title: "Normalize and reconcile", description: "Records are prepared around consistent fields and identity-aware update behavior." },
      { title: "Store and search", description: "PostgreSQL and PostGIS support structured persistence and geographic queries." },
      { title: "Monitor", description: "Accounts, saved searches, alerts, notifications, storage, and migrations support an evolving product." },
    ],
    technical: ["Python", "FastAPI", "PostgreSQL", "PostGIS", "RESO-oriented models", "Migrations", "Object storage", "Environment-aware services"],
    proofPoints: [
      "Separated frontend and backend",
      "Ingestion and normalization services",
      "Geospatial search foundations",
      "Account and session paths",
      "Saved searches and alert processing",
      "Deployment and storage boundaries",
    ],
    businessPurpose:
      "New Spot demonstrates ACC's ability to reason about the infrastructure, data quality, and backend services a customer-facing product needs before its interface can be dependable.",
    media: [],
    architecture: {
      label: "Verified repository architecture",
      nodes: ["Listing sources", "FastAPI ingestion", "Normalized records", "PostgreSQL + PostGIS", "Search + accounts", "Alerts + notifications"],
    },
    relatedCapabilities: ["Data / API Systems", "Automation & Integrations"],
    related: ["storm-chaser", "crew-command"],
    seoDescription:
      "New Spot case study: verified FastAPI, PostgreSQL, PostGIS, ingestion, search, account, alert, and deployment architecture built by ACC Solutions.",
  },
  {
    slug: "sift",
    name: "Sift",
    shortName: "Sift",
    category: "system",
    visual: "mobile",
    type: "Native mobile task application",
    status: "Development Preview",
    headline: "A focused local-first task experience designed for the device.",
    summary:
      "Sift is a React Native task application built around fast capture, persistent on-device data, notes, checklists, completion, editing, and native interaction patterns.",
    context:
      "A small task product still requires disciplined product decisions: data must survive restarts, navigation must feel native, gestures must recover cleanly, and detail features must not compromise the speed of capture.",
    problem: [
      "Immediate capture and reliable local persistence need to coexist without turning a simple inbox into a heavy workflow.",
      "Notes, checklists, deletion, appearance preferences, and navigation each introduce state that must remain coherent on the device.",
    ],
    approach: [
      "ACC separated domain, repository, service, database, and interface concerns while keeping the user experience focused on quick task handling.",
      "SQLite migrations, atomic data operations, system-aware appearance, and gesture-safe interface behavior support a local-first product foundation.",
    ],
    walkthrough: [
      { title: "Capture", description: "Tasks enter the inbox through a direct, touch-oriented quick-add flow." },
      { title: "Develop the task", description: "Detail views support persistent notes and one-level checklists without polluting the inbox model." },
      { title: "Act", description: "Completion, reopening, reordering, and deletion follow deliberate service and transaction behavior." },
      { title: "Return", description: "SQLite persistence and migrations keep the device state available across launches." },
    ],
    technical: ["React Native", "Expo", "TypeScript", "Expo Router", "SQLite", "Gesture Handler", "Reanimated", "Jest"],
    proofPoints: [
      "On-device SQLite persistence",
      "Notes and checklist data",
      "Atomic deletion behavior",
      "Gesture-aware interaction",
      "Light, dark, and system appearance",
      "Native route recovery",
    ],
    businessPurpose:
      "Sift proves that ACC can carry product thinking into native mobile constraints, where touch behavior, persistence, and device context shape the architecture.",
    media: [
      {
        src: "/images/proof/sift-inbox.png",
        alt: "Current Sift iOS inbox with persistent tasks, quick capture, completion controls, and appearance settings",
        width: 1206,
        height: 2622,
        caption: "Current Sift build running in an iOS simulator with persisted local tasks.",
        position: "top center",
      },
    ],
    architecture: {
      label: "Local-first loop",
      nodes: ["Touch input", "Domain services", "Repositories", "SQLite", "Persisted state", "Native UI"],
    },
    relatedCapabilities: ["Mobile Applications", "Custom Business Software"],
    related: ["crew-command", "storm-chaser"],
    seoDescription:
      "Sift case study: a React Native, Expo, TypeScript, and SQLite local-first mobile task application built by ACC Solutions.",
  },
  {
    slug: "green-bros",
    name: "Green Bros",
    shortName: "Green Bros",
    category: "client",
    visual: "client",
    type: "Commercial cleaning website",
    status: "Production Website",
    headline: "A premium digital presence for a commercial facilities business.",
    summary:
      "ACC designed and built a restrained service website that clarifies Green Bros' commercial cleaning offer and leads property decision-makers toward a walkthrough request.",
    context:
      "Commercial service buyers need to understand scope, property fit, and the next step quickly. The experience needed to feel credible without making unverified service or compliance claims.",
    problem: ["Organize several service and industry categories without creating a generic contractor template.", "Create a clear quote-intent path while keeping the language specific and supportable."],
    approach: ["ACC used an editorial hierarchy, premium property imagery, dedicated service and industry routes, and a walkthrough-first conversion model.", "The Astro build keeps the experience fast, responsive, and easy to expand as the business provides more confirmed information."],
    walkthrough: [
      { title: "Position", description: "The opening experience establishes commercial focus and property-level credibility." },
      { title: "Clarify", description: "Services, industries, process, and service-area content give buyers a structured path through the offer." },
      { title: "Convert", description: "Walkthrough language creates a practical next step without forcing an artificial package." },
    ],
    technical: ["Astro", "TypeScript", "Responsive CSS", "Semantic HTML", "Structured content"],
    proofPoints: ["Multi-page information architecture", "Service and industry routes", "Responsive editorial layouts", "Walkthrough-oriented contact path"],
    businessPurpose: "Give commercial property decision-makers a clearer, more credible way to understand the business and begin a scoped conversation.",
    media: [{ src: "/images/proof/green-bros.png", alt: "Green Bros commercial cleaning website homepage", width: 1098, height: 900, caption: "Current Green Bros production homepage.", position: "top center" }],
    liveUrl: "https://green-bros-site.vercel.app/",
    relatedCapabilities: ["Websites & Digital Presence"],
    related: ["coastal-property-services", "southern-edge"],
    seoDescription: "Green Bros case study: a premium, responsive commercial cleaning website designed and built by ACC Solutions with a clear walkthrough conversion path.",
  },
  {
    slug: "coastal-property-services",
    name: "Coastal Property Services",
    shortName: "Coastal Property Services",
    category: "client",
    visual: "client",
    type: "Property services website",
    status: "Production Website",
    headline: "Reframing a multi-service property company around clarity and trust.",
    summary:
      "ACC rebuilt the customer-facing experience around premium property imagery, clear service communication, real business content, and responsive decision paths for HOAs and managed properties.",
    context:
      "A property-services company can span maintenance, landscaping, pools, cleaning, and coordination. The digital experience needed to make that range feel organized rather than unfocused.",
    problem: ["Present several service disciplines through one coherent business story.", "Help board members, associations, and property decision-makers understand the relevant service path."],
    approach: ["ACC created a structured Astro site with focused service pages, real imagery, careful responsive behavior, and clear customer language.", "Legacy route handling and page-level search foundations support the transition from the previous website."],
    walkthrough: [
      { title: "Establish the business", description: "Property-led imagery and direct positioning create a stronger first impression." },
      { title: "Organize the offer", description: "Dedicated service routes separate distinct needs while preserving one company narrative." },
      { title: "Support action", description: "Contact and service paths remain understandable across desktop and mobile." },
    ],
    technical: ["Astro", "TypeScript", "Responsive imagery", "Static routing", "SEO foundations"],
    proofPoints: ["Real content integration", "Responsive service pages", "Legacy redirect planning", "Property-focused information architecture"],
    businessPurpose: "Help property decision-makers understand the breadth of the operation while finding a clear route to the service they need.",
    media: [{ src: "/images/proof/coastal-property-services.png", alt: "Coastal Property Services production website homepage", width: 1098, height: 900, caption: "Current Coastal Property Services production homepage.", position: "top center" }],
    liveUrl: "https://coastal-property-services.vercel.app/",
    relatedCapabilities: ["Websites & Digital Presence"],
    related: ["green-bros", "southern-edge"],
    seoDescription: "Coastal Property Services case study: a responsive multi-service property website redesigned and built by ACC Solutions around clarity and real business content.",
  },
  {
    slug: "southern-edge",
    name: "Southern Edge Landscaping",
    shortName: "Southern Edge",
    category: "client",
    visual: "client",
    type: "Local service-business website",
    status: "Production Website",
    headline: "A cinematic local-service experience grounded in real work.",
    summary:
      "ACC designed and built Southern Edge's current public site using authentic project photography and video, clear service framing, quote intent, and a local search foundation.",
    context:
      "Landscaping is visual, local, and trust-driven. The website needed to show actual work, communicate service range, establish Horry County relevance, and make an estimate request feel immediate.",
    problem: ["Translate real project media into a polished experience without hiding the practical service offer.", "Balance cinematic presentation with performance, mobile controls, accessibility, and local search structure."],
    approach: ["ACC built a custom responsive single-page experience with optimized media, controlled video loading, service framing, process, service-area content, and an estimate flow.", "Canonical metadata and local-business structured data support the public presence without inventing geographic claims beyond the confirmed service area."],
    walkthrough: [
      { title: "Show the work", description: "Real photography and video establish craft before abstract claims." },
      { title: "Frame the service", description: "Six service categories and project media connect presentation to practical needs." },
      { title: "Create local intent", description: "Horry County positioning, structured data, and quote actions support relevant discovery and conversion." },
    ],
    technical: ["HTML", "CSS", "JavaScript", "Responsive media", "Lazy-loaded video", "Structured data"],
    proofPoints: ["Authentic project media", "Accessible video controls", "Local SEO foundation", "Responsive estimate flow"],
    businessPurpose: "Give homeowners a clear view of Southern Edge's work and a direct path to discuss an outdoor project.",
    media: [{ src: "/images/proof/southern-edge-landscaping.png", alt: "Southern Edge Landscaping production homepage with Horry County positioning", width: 1098, height: 900, caption: "Current authoritative southern-edge-site production homepage.", position: "top center" }],
    liveUrl: "https://southern-edge-site.vercel.app/",
    repositoryUrl: "https://github.com/NickelCodedThat/southern-edge-site",
    relatedCapabilities: ["Websites & Digital Presence"],
    related: ["green-bros", "taper-clinic"],
    seoDescription: "Southern Edge Landscaping case study: a cinematic, responsive Horry County service website built by ACC Solutions with real media and local SEO foundations.",
  },
  {
    slug: "taper-clinic",
    name: "Taper Clinic",
    shortName: "Taper Clinic",
    category: "client",
    visual: "client",
    type: "Barber and booking website",
    status: "Client Project",
    headline: "A sharper customer-facing foundation for a local barber brand.",
    summary:
      "ACC built a mobile-first React website that gives Taper Clinic a distinctive business presence, visible service structure, and a prepared path for booking integration.",
    context:
      "The project needed a more credible and ownable digital presence while remaining honest about owner-supplied photography, final service details, and booking information that are still being connected.",
    problem: ["Create a responsive brand experience without fabricating reviews, service details, or booking availability.", "Prepare content and booking systems so confirmed business information can be integrated centrally later."],
    approach: ["ACC built the interface in React and TypeScript with centralized business, service, promotion, gallery, and booking configuration.", "The current booking flow explicitly communicates its disabled state instead of directing visitors to an unconfirmed provider."],
    walkthrough: [
      { title: "Establish presence", description: "The visual system gives the barber business a clear, mobile-first point of view." },
      { title: "Prepare the offer", description: "Central configuration keeps services, promotions, media, and business details maintainable." },
      { title: "Respect the current state", description: "Booking and client-supplied content remain transparent until final information is confirmed." },
    ],
    technical: ["React", "TypeScript", "Vite", "Tailwind CSS", "Local interaction components"],
    proofPoints: ["Mobile-first layout", "Central business configuration", "Prepared booking modes", "Controlled gallery and motion behavior"],
    businessPurpose: "Create a credible digital foundation that can become a complete appointment path as confirmed brand media and booking information arrive.",
    media: [{ src: "/images/proof/taper-clinic.png", alt: "Taper Clinic client website homepage", width: 1098, height: 900, caption: "Current Taper Clinic client-project homepage.", position: "top center" }],
    liveUrl: "https://taper-clinic-site.vercel.app/",
    relatedCapabilities: ["Websites & Digital Presence"],
    related: ["southern-edge", "green-bros"],
    seoDescription: "Taper Clinic case study: a mobile-first React and TypeScript barber website built by ACC Solutions with centralized content and booking foundations.",
  },
] as const;

export const systemCases = caseStudies.filter((study) => study.category === "system");
export const clientCases = caseStudies.filter((study) => study.category === "client");

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
