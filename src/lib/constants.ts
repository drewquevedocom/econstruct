export const SITE_URL = "https://www.econstructhomes.com";

export const COMPANY = {
  name: "eConstruct Homes",
  shortName: "eConstruct Homes",
  tagline: "Los Angeles Luxury Home Builder and General Contractor",
  phone: {
    primary: "310-740-9999",
    secondary: "310-740-9999",
    display: "(310) 740-9999",
    displaySecondary: "(310) 740-9999",
  },
  email: "info@econstructhomes.com",
  address: {
    street: "25350 Magic Mountain Pkwy",
    suite: "Ste. 300",
    city: "Valencia",
    state: "CA",
    zip: "91355",
    full: "25350 Magic Mountain Pkwy, Ste. 300, Valencia, CA 91355",
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
    owner: { name: "Frank Neimroozi", title: "Owner & President", email: "frank@econstructhomes.com" },
    vpAdmin: { name: "Katie Krueger", title: "VP Administration", email: "katie@econstructhomes.com" },
    operations: { name: "Robyn Ellis", title: "Operations", email: "robyn@econstructhomes.com" },
  },
  credentials: [
    "CA License #964015",
    "Building LA Since 2001",
    "econstruct Since 2011",
    "NAHB Member",
    "USGBC Member",
  ],
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Luxury Home Building", href: "/services/luxury-home-builder-los-angeles" },
      { label: "Fire Rebuild", href: "/services/fire-rebuild-contractor-los-angeles" },
      { label: "Custom Home Construction", href: "/services/custom-home-construction-los-angeles" },
      { label: "Home Additions", href: "/services/home-additions-los-angeles" },
      { label: "Home Automation", href: "/services/home-automation-los-angeles" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
