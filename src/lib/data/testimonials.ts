export interface Testimonial {
  quote: string;
  name: string;
  neighborhood: string;
  rating: number;
  projectType?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "econstruct built our dream home! Best custom homebuilders in Los Angeles - I highly recommend their personalized approach. The team at econstruct is incredible!",
    name: "Nathan Hughes",
    neighborhood: "Los Angeles",
    rating: 5,
    projectType: "custom",
  },
  {
    quote: "econstruct helped remodel my master bedroom back in 2013. They answered all my questions and concerns, and went above and beyond to turn my master into a beautiful new space with a new walk-in closet, balcony, and bath. I would love to use econstruct again for my next remodeling project.",
    name: "Eugene Shakhov",
    neighborhood: "Los Angeles",
    rating: 5,
    projectType: "luxury",
  },
  {
    quote: "Great team and amazing quality.",
    name: "Hashen Hamedani",
    neighborhood: "Los Angeles",
    rating: 5,
    projectType: "luxury",
  },
  {
    quote: "The team at econstruct brings knowledge and experience that includes not only extensive construction and planning, but also retail operations experience. This added value has been helpful in identifying layout opportunities to improve operation efficiencies that most GCs would not be capable of identifying. The finish work is top notch and their ability to build on a quick schedule is top shelf. Great people to work with that excel at their jobs.",
    name: "Neil M.",
    neighborhood: "Los Angeles",
    rating: 5,
    projectType: "commercial",
  },
  {
    quote: "econstruct did an outstanding job in all areas. They did super high quality work, they went above and beyond what was expected. Seriously, I could not be more impressed with them. I am very thankful for them.",
    name: "Randy W.",
    neighborhood: "Los Angeles",
    rating: 5,
    projectType: "luxury",
  },
  {
    quote: "econstruct performed a complete remodel to my friend's rental home in Bell Canyon. My friend lives in Dubai, so since I lived in Bell Canyon, I watched over the project on a daily basis. It was a major remodel with a new roof, decks, stucco, re-plumbing, walk-mover, all new stone floors — basically everything was changed. Everything went well. The subcontractors were excellent. The finished product was beautiful. I have no complaints.",
    name: "Tony Biscaglia",
    neighborhood: "Bell Canyon",
    rating: 5,
    projectType: "luxury",
  },
  {
    quote: "I managed a high-end remodel in an exclusive gated community in Los Angeles. It was the proverbial 'one wall remodel.' Walls were moved. All electrical was completely rewired with added panels. The upper deck had to be completely restructured. All flooring was replaced and the entire home was reconfigured.",
    name: "Tony Biscaglia",
    neighborhood: "Los Angeles",
    rating: 5,
    projectType: "luxury",
  },
];
