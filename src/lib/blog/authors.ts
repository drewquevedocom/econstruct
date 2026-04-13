export interface BlogAuthor {
  slug: string;
  name: string;
  title: string;
  shortBio: string;
  bio: string[];
  credentials: string[];
  image: string;
  linkedin?: string;
}

export const blogAuthors: BlogAuthor[] = [
  {
    slug: "frank-neimroozi",
    name: "Frank Neimroozi",
    title: "Principal & Founder, econstruct",
    shortBio:
      "Frank Neimroozi leads econstruct's fire rebuild, luxury modernization, and custom home work across Los Angeles.",
    bio: [
      "Frank Neimroozi is the Principal & Founder of econstruct and has spent more than two decades managing residential construction in Los Angeles. His work spans high-end renovations, ground-up custom homes, and complex post-wildfire rebuilds for homeowners who need both premium execution and decisive project leadership.",
      "Frank's recent focus has centered on Pacific Palisades, Brentwood, Santa Monica, Altadena, and other neighborhoods where code changes, insurance pressure, and schedule risk intersect. He works closely with architects, engineers, permit teams, and owners to translate rebuilding complexity into clear scope, budget, and sequencing decisions.",
    ],
    credentials: [
      "Licensed General Contractor (CSLB # TODO)",
      "20+ years managing Los Angeles residential construction",
      "Fire rebuild and WUI compliance project leadership",
      "Luxury modernization and custom home delivery",
    ],
    image: "/frank_blog.png",
    linkedin: "https://www.linkedin.com/company/econstruct-inc",
  },
];

export function getBlogAuthorBySlug(slug: string) {
  return blogAuthors.find((author) => author.slug === slug);
}
