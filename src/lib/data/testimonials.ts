export interface Testimonial {
  quote: string;
  name: string;
  neighborhood: string;
  rating: number;
  projectType?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "econstruct stepped in after the devastating fire and completely handled our complex hillside rebuild. They navigated the nightmare of insurance gaps and WUI codes seamlessly. Our new home is an absolute masterpiece.",
    name: "Sarah C.",
    neighborhood: "Pacific Palisades",
    rating: 5,
    projectType: "fire-rebuild",
  },
  {
    quote: "We brought Frank and his team in for a massive luxury kitchen and living modernization. The craftsmanship is flawless, the communication was stellar, and they kept an incredibly tight schedule. Highly recommended.",
    name: "James M.",
    neighborhood: "Brentwood",
    rating: 5,
    projectType: "luxury",
  },
  {
    quote: "Building a ground-up custom luxury home is terrifying, but econstruct made it an incredible experience. From the foundation to the final high-end finishes, they delivered beyond our wildest expectations.",
    name: "Elena R.",
    neighborhood: "Santa Monica",
    rating: 5,
    projectType: "custom",
  },
  {
    quote: "After the Palisades fire, we were overwhelmed. econstruct took over completely — insurance coordination, permits, everything. They rebuilt our home better than the original in record time.",
    name: "Michael T.",
    neighborhood: "Pacific Palisades",
    rating: 5,
    projectType: "fire-rebuild",
  },
  {
    quote: "Frank's team transformed our dated Bel Air estate into a modern masterpiece while preserving the original character our family loves. The attention to detail is extraordinary.",
    name: "Diana K.",
    neighborhood: "Bel Air",
    rating: 5,
    projectType: "luxury",
  },
  {
    quote: "We hired econstruct for a complete ADU build and main house renovation. The quality matches homes costing twice as much. Frank and his crew are true craftsmen.",
    name: "Robert & Lisa P.",
    neighborhood: "Santa Monica",
    rating: 5,
    projectType: "adu",
  },
];
