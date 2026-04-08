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
    bio: "With over 25 years of construction experience in Los Angeles, Frank has led econstruct through 340+ projects. His hands-on approach and deep expertise in high-end residential construction - from fire rebuilds to luxury custom homes - sets the standard for premium quality in the industry.",
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
