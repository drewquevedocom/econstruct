export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image?: string;
  email?: string;
}

export const team: TeamMember[] = [
  {
    name: "Frank Neimroozi",
    title: "Owner & President",
    bio: "Frank has been building in Los Angeles since 2001 - more than 25 years of hands-on residential construction experience - and founded econstruct in 2011. Over 15 years at the helm of econstruct, he has led the team through 345+ projects spanning fire rebuilds, luxury custom homes, and ground-up modernizations, setting the standard for premium quality in the industry.",
    image: "/frank-about.png",
    email: "frank@econstructinc.com",
  },
  {
    name: "Katie Krueger",
    title: "VP of Administration",
    bio: "Katie oversees all administrative operations, ensuring every project runs smoothly from contract to completion. Her organizational expertise keeps econstruct's complex multi-project pipeline on track.",
    email: "katie@econstructinc.com",
  },
  {
    name: "Robyn Ellis",
    title: "Operations Manager",
    bio: "Robyn coordinates day-to-day operations, vendor relationships, and project logistics. Her attention to detail ensures seamless execution across all active projects.",
    email: "robyn@econstructinc.com",
  },
];
