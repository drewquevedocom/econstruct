export const COMPANY = {
  name: "eConstruct Inc.",
  shortName: "eConstruct",
  tagline: "Los Angeles' Premier High-End Home Builder",
  phone: {
    primary: "888-990-0303",
    secondary: "310-740-9999",
    display: "(888) 990-0303",
    displaySecondary: "(310) 740-9999",
  },
  email: "info@econstructinc.com",
  address: {
    street: "25350 Magic Mountain Pkwy",
    suite: "Suite 300",
    city: "Valencia",
    state: "CA",
    zip: "91355",
    full: "25350 Magic Mountain Pkwy Suite 300, Valencia, CA 91355",
  },
  license: {
    number: "964015",
    display: "CA Lic #964015",
    verificationUrl: "https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx",
  },
  social: {
    instagram: "https://instagram.com/econstructinc",
    linkedin: "https://linkedin.com/company/econstruct-inc",
    houzz: "https://houzz.com/professionals/econstruct-inc",
    youtube: "https://youtube.com/@econstructinc",
  },
  team: {
    owner: { name: "Frank Neimroozi", title: "Owner & President", email: "frank@econstructinc.com" },
    vpAdmin: { name: "Katie Krueger", title: "VP Administration", email: "katie@econstructinc.com" },
    operations: { name: "Robyn Ellis", title: "Operations", email: "robyn@econstructinc.com" },
  },
  credentials: ["CA License #964015", "25+ Years Experience", "BBB Accredited", "NAHB Member", "USGBC Member"],
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Fire Rebuild", href: "/services/fire-rebuild" },
      { label: "Luxury Modernization", href: "/services/luxury-modernization" },
      { label: "Ground-Up Custom Homes", href: "/services/custom-homes" },
      { label: "ADU & Additions", href: "/services/adu-construction" },
    ],
  },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
] as const;
