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
    bio: "Frank has been building in Los Angeles since 2001 - more than 25 years of hands-on construction experience - and founded econstruct in 2011. His field experience is part of the partners' 634 combined projects, built on a primarily commercial foundation before 2011 and a residential focus since econstruct was formed.",
    image: "/Frank2 copy.png",
    email: "frank@econstructhomes.com",
  },
  {
    name: "Katie Krueger",
    title: "VP of Administration",
    bio: "Katie oversees all administrative operations, ensuring every project runs smoothly from contract to completion. Her organizational expertise keeps econstruct's complex multi-project pipeline on track.",
    email: "katie@econstructhomes.com",
  },
  {
    name: "Robyn Ellis",
    title: "Operations Manager",
    bio: "Robyn coordinates day-to-day operations, vendor relationships, and project logistics. Her attention to detail ensures seamless execution across all active projects.",
    email: "robyn@econstructhomes.com",
  },
];
