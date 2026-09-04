export const site = {
  name: "ACC Solutions",
  legalName: "ACC Solutions LLC",
  url: "https://accsolutions.dev/",
  domain: "accsolutions.dev",
  email: "nickboyce.tech@icloud.com",
  phoneDisplay: "(332) 281-1444",
  phoneHref: "tel:+13322811444",
  statement: "We build the digital systems businesses operate on.",
  description:
    "ACC Solutions builds digital systems, websites, software, automation, and technology infrastructure that help businesses operate better.",
  ogDescription:
    "ACC Solutions identifies where technology can improve a business, then designs and builds the websites, software, automation, and systems to make it happen.",
  title: "ACC Solutions | Digital Systems for Growing Businesses",
  ogImage: "/images/WorkDisplay.png",
  ogImageAlt: "Composite showcase of ACC Solutions website and application work",
} as const;

export const navigation = [
  { label: "Solutions", href: "#solutions" },
  { label: "Systems", href: "#systems" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;
