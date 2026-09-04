export type ProofState = "Live project" | "Development preview" | "Current build";

export interface SystemProject {
  name: string;
  type: string;
  state: ProofState;
  summary: string;
  businessMeaning: string;
  evidence: readonly string[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  orientation: "landscape" | "portrait" | "architecture";
}

export interface ClientProject {
  name: string;
  type: string;
  summary: string;
  url: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const systems: readonly SystemProject[] = [
  {
    name: "Crew Command",
    type: "Custom operations platform",
    state: "Development preview",
    summary:
      "A role-based operating system for coordinating people, properties, shifts, hours, work completion, handoffs, and day-to-day management visibility.",
    businessMeaning:
      "Crew Command shows how ACC studies a real operation and turns scattered workflows into one purpose-built system.",
    evidence: [
      "Scheduling and shift assignment",
      "Clock in, clock out, and worked hours",
      "Properties and role-based access",
      "Checklists, exceptions, and work history",
      "Shift handoffs and operational messaging",
      "Owner controls and live management views",
    ],
    image: {
      src: "/images/proof/crew-command-dashboard.png",
      alt: "Current Crew Command owner dashboard showing live attendance, work progress, shift handoffs, and upcoming shifts",
      width: 1098,
      height: 900,
    },
    orientation: "landscape",
  },
  {
    name: "Storm Chaser / SCV2",
    type: "External-data application",
    state: "Current build",
    summary:
      "A weather intelligence application that brings local forecasts, U.S. severe-weather data, radar, tropical systems, and global natural events into one interactive experience.",
    businessMeaning:
      "SCV2 demonstrates how ACC can normalize multiple live data sources, build provider resilience, and make complex information usable.",
    evidence: [
      "NOAA and National Weather Service data",
      "USGS, NASA EONET, and GDACS sources",
      "Interactive MapLibre mapping",
      "Saved events and shareable state",
      "Provider-level fallbacks",
      "Automated test coverage",
    ],
    image: {
      src: "/images/proof/storm-chaser-center.png",
      alt: "Current Storm Chaser severe-weather center with official alert geometry, filters, and a national event feed",
      width: 1098,
      height: 900,
    },
    orientation: "landscape",
  },
  {
    name: "New Spot",
    type: "Data and search platform",
    state: "Development preview",
    summary:
      "A rental discovery system designed to ingest, reconcile, store, search, and monitor complex listing data across a separated frontend and backend architecture.",
    businessMeaning:
      "New Spot proves ACC can build beyond the interface, including data pipelines, geospatial search, accounts, saved searches, alerts, notifications, and deployment architecture.",
    evidence: [
      "Python and FastAPI services",
      "PostgreSQL and PostGIS",
      "Data ingestion and normalization",
      "Accounts and persistent sessions",
      "Saved searches and alerts",
      "Object storage and deployment boundaries",
    ],
    orientation: "architecture",
  },
  {
    name: "Sift",
    type: "Native mobile application",
    state: "Current build",
    summary:
      "A focused mobile task application built around immediate capture, local persistence, completion, editing, and a native interaction model.",
    businessMeaning:
      "Sift demonstrates that ACC can design and build software for native mobile use, including local-first behavior and persistent device data.",
    evidence: [
      "React Native and Expo",
      "SQLite persistence",
      "Local-first task data",
      "Gesture-aware interactions",
      "Native navigation and safe areas",
      "Light and dark appearance support",
    ],
    image: {
      src: "/images/proof/sift-inbox.png",
      alt: "Current Sift iOS inbox showing locally stored tasks, quick capture, completion controls, and appearance settings",
      width: 1206,
      height: 2622,
    },
    orientation: "portrait",
  },
] as const;

export const clientProjects: readonly ClientProject[] = [
  {
    name: "Green Bros",
    type: "Commercial service website",
    summary:
      "A restrained, business-focused site that clarifies commercial cleaning services and guides property decision-makers toward a walkthrough request.",
    url: "https://green-bros-site.vercel.app/",
    image: {
      src: "/images/proof/green-bros.png",
      alt: "Green Bros commercial cleaning website homepage with service positioning and walkthrough call to action",
      width: 1098,
      height: 900,
    },
  },
  {
    name: "Coastal Property Services",
    type: "Property services website",
    summary:
      "A service-led digital presence that organizes a multi-discipline offering for HOA boards, communities, and managed properties.",
    url: "https://coastal-property-services.vercel.app/",
    image: {
      src: "/images/proof/coastal-property-services.png",
      alt: "Coastal Property Services website homepage for HOA and community property maintenance",
      width: 1098,
      height: 900,
    },
  },
  {
    name: "Southern Edge Landscaping",
    type: "Landscaping business website",
    summary:
      "An image-led local-service experience designed to communicate craft, define the offer, and move homeowners toward an estimate.",
    url: "https://southern-edge-site.vercel.app/",
    image: {
      src: "/images/proof/southern-edge-landscaping.png",
      alt: "Southern Edge Landscaping homepage with Horry County service positioning and quote actions",
      width: 1098,
      height: 900,
    },
  },
  {
    name: "Taper Clinic",
    type: "Barber and booking website",
    summary:
      "A mobile-first brand and booking experience that gives a local barber a clear point of view, visible services, and a direct path to an appointment.",
    url: "https://taper-clinic-site.vercel.app/",
    image: {
      src: "/images/proof/taper-clinic.png",
      alt: "Taper Clinic barber website homepage with service messaging and appointment calls to action",
      width: 1098,
      height: 900,
    },
  },
] as const;
