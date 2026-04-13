"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPreview() {
  const posts = [
    {
      title: "Understanding Local WUI Codes for Fire Rebuilds",
      excerpt: "If you're rebuilding in a high-fire severity zone, navigating the WUI regulations is your absolute first priority before drafting any plans.",
      image: "/fire_rebuild_hero.png",
      date: "March 12, 2026",
      href: "/blog/understanding-wui-codes"
    },
    {
      title: "The Return on Investment of Luxury Kitchen Modernization",
      excerpt: "Discover how high-end luxury renovations in Brentwood and Santa Monica are driving substantial valuation multipliers in today's market.",
      image: "/luxury_mod_service.png",
      date: "March 5, 2026",
      href: "/blog/roi-luxury-kitchen"
    },
    {
      title: "Ground-Up Custom Builds: Avoiding Permitting Nightmares",
      excerpt: "The ultimate guide to streamlining your timeline by properly establishing executive order fast-tracking and strategic city planning approvals.",
      image: "/custom_home_service.png",
      date: "February 28, 2026",
      href: "/blog/custom-builds-permitting"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center"
            >
              <span>INSIGHTS</span> 
              <span className="text-accent-gold">•</span>
              <span>LATEST NEWS</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-5xl font-bold text-brand-dark tracking-tight"
            >
              Blogs
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/resources"
              className="group flex gap-3 items-center text-brand-dark font-bold border-b-2 border-brand-dark/20 pb-1 hover:border-accent-gold hover:text-accent-gold transition-colors"
            >
              View All Resources
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link href={post.href} className="group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-60 w-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm py-1.5 px-4 rounded-full text-xs font-bold text-brand-dark shadow-sm">
                    {post.date}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold leading-snug text-brand-dark mb-4 group-hover:text-accent-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-auto font-bold text-brand-dark text-sm tracking-wide group-hover:text-accent-gold transition-colors">
                    Read More
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
