export type ProjectStatus = "Development Preview" | "Content Update in Progress" | "Recently Launched" | "Live";

export type ProjectCategory = "systems" | "client-work";

export interface HeroPreviewProject {
  name: string;
  kicker: string;
  status: ProjectStatus | "Live Project";
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  href?: string;
  linkLabel?: string;
}

export interface WorkCase {
  name: string;
  type: string;
  status: ProjectStatus;
  statusTone: "purple" | "yellow" | "blue" | "green";
  category: ProjectCategory;
  problem: string;
  solution: string;
  purpose: string;
  href?: string;
  buttonText?: string;
}

export const heroPreviewProjects: HeroPreviewProject[] = [
  {
    name: "CrewCommand",
    kicker: "Custom Operations Platform",
    status: "Development Preview",
    image: {
      src: "/images/crewcommand/04-dashboard-desktop.png",
      alt: "CrewCommand operations dashboard interface",
      width: 1440,
      height: 900,
    },
  },
  {
    name: "Southern Edge Landscaping",
    kicker: "Business Website",
    status: "Live Project",
    href: "https://southern-edge-site.vercel.app/",
    linkLabel: "View live site",
    image: {
      src: "/images/landscaping-site.jpeg",
      alt: "Southern Edge Landscaping website hero screenshot",
      width: 3420,
      height: 1968,
    },
  },
  {
    name: "Storm Chaser Weather App",
    kicker: "Interactive Web Application",
    status: "Recently Launched",
    href: "https://storm-chaser-weather-app.vercel.app/",
    linkLabel: "View live app",
    image: {
      src: "/images/Screenshot 2026-08-10 at 3.55.07\u202fAM.jpeg",
      alt: "Storm Chaser weather app nighttime dashboard",
      width: 3420,
      height: 1988,
    },
  },
];

export const workCases: WorkCase[] = [
  {
    name: "CrewCommand",
    type: "Custom Operations Platform",
    status: "Development Preview",
    statusTone: "purple",
    category: "systems",
    problem: "Scattered field-service operations need one organized source of truth.",
    solution: "A platform concept for properties, job sites, users, workflows, and dashboards.",
    purpose: "Help managers see and coordinate operational work from one environment.",
  },
  {
    name: "Taper Clinic Website",
    type: "Business Website",
    status: "Content Update in Progress",
    statusTone: "yellow",
    category: "client-work",
    problem: "A barber business needs a sharper customer-facing experience.",
    solution: "A modern site structure for services, positioning, location, and booking action.",
    purpose: "Make the brand feel more professional and guide visitors toward appointment intent.",
    href: "https://taper-clinic-site.vercel.app/",
    buttonText: "View Live Site",
  },
  {
    name: "Southern Edge Landscaping",
    type: "Landscaping Business Website",
    status: "Content Update in Progress",
    statusTone: "yellow",
    category: "client-work",
    problem: "A local service company needs a premium web presence that reflects quality work.",
    solution: "A cinematic business website concept with clear service framing and estimate intent.",
    purpose: "Help visitors trust the company quickly and move toward a project conversation.",
    href: "https://southern-edge-site.vercel.app/",
    buttonText: "View Live Site",
  },
  {
    name: "ACC Solutions Website",
    type: "Digital Systems Website",
    status: "Live",
    statusTone: "green",
    category: "systems",
    problem: "ACC needs a public presence that explains a broader technology-solutions practice.",
    solution: "A premium digital consultancy site built around systems, proof, and inquiry flow.",
    purpose: "Help serious business owners understand how ACC thinks and begin a consultation.",
    href: "https://acc-solutions-website.vercel.app/",
    buttonText: "View Live Site",
  },
  {
    name: "Storm Chaser Weather App",
    type: "Interactive Weather Application",
    status: "Recently Launched",
    statusTone: "blue",
    category: "systems",
    problem: "Users need an interactive weather interface that responds to location and conditions.",
    solution: "A front-end application concept with dynamic visual presentation and weather detail views.",
    purpose: "Demonstrate responsive application thinking beyond a static marketing page.",
    href: "https://storm-chaser-weather-app.vercel.app/",
    buttonText: "View Live App",
  },
];

export const futureSystems = ["Crew Command / CCV2", "SCV2", "New Spot", "Sift"] as const;

export const futureClientWork = [
  "Green Bros",
  "Coastal Property Services",
  "Southern Edge Landscaping",
  "Taper Clinic",
] as const;
