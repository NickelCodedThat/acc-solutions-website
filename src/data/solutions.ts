export interface SolutionCapability {
  number: string;
  title: string;
  statement: string;
  description: string;
  capabilities: readonly string[];
  proof: string;
  proofHref: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    position?: string;
  };
  flow?: readonly string[];
}

export const solutionCapabilities: readonly SolutionCapability[] = [
  {
    number: "01",
    title: "Websites & Digital Presence",
    statement: "A website should participate in the business, not sit beside it.",
    description:
      "ACC designs premium, responsive business websites around the decisions a customer needs to make. The foundation can support lead generation, search visibility, analytics, hosting, maintenance, and the systems that come after the first inquiry.",
    capabilities: [
      "Premium business websites and redesigns",
      "Responsive, conversion-oriented experiences",
      "SEO and structured-data foundations",
      "Analytics-ready implementation",
      "Hosting, maintenance, and ongoing improvement",
    ],
    proof: "See client website work",
    proofHref: "/work#client-work",
    image: {
      src: "/images/proof/green-bros.png",
      alt: "Green Bros commercial service website designed and built by ACC Solutions",
      width: 1098,
      height: 900,
      position: "top center",
    },
  },
  {
    number: "02",
    title: "Custom Business Software",
    statement: "When the operation does not fit the software, the software should fit the operation.",
    description:
      "ACC can translate business-specific rules into authenticated platforms, dashboards, employee tools, management controls, portals, and application logic designed around the actual workflow.",
    capabilities: [
      "Internal platforms and authenticated systems",
      "Employee and management tools",
      "Dashboards, portals, and role-based access",
      "Business-specific application logic",
      "Persistent data and production workflows",
    ],
    proof: "Explore Crew Command",
    proofHref: "/work/crew-command",
    image: {
      src: "/images/proof/crew-command-dashboard.png",
      alt: "Crew Command owner dashboard showing operational activity and management visibility",
      width: 1098,
      height: 900,
      position: "top center",
    },
  },
  {
    number: "03",
    title: "Operations Systems",
    statement: "The best operations software begins with the workday, not a feature list.",
    description:
      "ACC maps how people schedule work, move through assignments, record completion, communicate handoffs, and review history. The result is a system focused on helping the business run with less ambiguity.",
    capabilities: [
      "Scheduling and attendance",
      "Operational records and work history",
      "Checklists and exception handling",
      "Shift handoffs and internal communication",
      "Workflow coordination and management visibility",
    ],
    proof: "See the operations case study",
    proofHref: "/work/crew-command",
    image: {
      src: "/images/proof/crew-command-shifts.png",
      alt: "Crew Command shift creation interface built around an operating workflow",
      width: 1098,
      height: 900,
      position: "top center",
    },
  },
  {
    number: "04",
    title: "Mobile Applications",
    statement: "Some workflows belong in the hand, on the device, and available immediately.",
    description:
      "ACC builds native-style mobile experiences with touch-first interaction, persistent local data, device-aware navigation, and local-first architecture where the product requires it.",
    capabilities: [
      "React Native and Expo development",
      "Native-style interaction and navigation",
      "Persistent SQLite data",
      "Touch and gesture-oriented UX",
      "Local-first and offline-capable foundations",
    ],
    proof: "Explore Sift",
    proofHref: "/work/sift",
    image: {
      src: "/images/proof/sift-inbox.png",
      alt: "Sift native mobile task inbox running in an iOS simulator",
      width: 1206,
      height: 2622,
      position: "top center",
    },
  },
  {
    number: "05",
    title: "Automation & Integrations",
    statement: "Information should move because the process requires it, not because someone remembered to copy it.",
    description:
      "ACC evaluates repetitive work, disconnected tools, lead intake, notifications, and coordination points to identify where responsible automation or system-to-system integration can remove friction.",
    capabilities: [
      "Customer and lead intake flows",
      "Notification and routing logic",
      "System-to-system data movement",
      "Workflow coordination",
      "Practical automation planning",
    ],
    proof: "Discuss an integration",
    proofHref: "/#contact",
    flow: ["Business event", "Validated workflow", "Connected systems", "Useful action"],
  },
  {
    number: "06",
    title: "Data / API Systems",
    statement: "Complex outside data becomes valuable when people can trust and use it.",
    description:
      "ACC builds systems that ingest external data, normalize inconsistent sources, store and search structured records, map geographic information, isolate provider failures, and turn APIs into clear operational or customer-facing experiences.",
    capabilities: [
      "Third-party APIs and provider adapters",
      "Data ingestion and normalization",
      "Databases, search, and geospatial systems",
      "Mapping, alerts, and saved state",
      "Backend services and resilient data workflows",
    ],
    proof: "Explore data-system work",
    proofHref: "/work#systems",
    image: {
      src: "/images/proof/storm-chaser-center.png",
      alt: "Storm Chaser severe-weather center combining normalized public data and mapping",
      width: 1098,
      height: 900,
      position: "top center",
    },
  },
] as const;
