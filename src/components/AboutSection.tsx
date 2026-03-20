"use client";
import { motion } from "framer-motion";
import { Building2, Layers, HardHat, Box } from "lucide-react";

export default function AboutSection() {
  const services = [
    {
      num: "01.",
      title: "Real Estate Development",
      desc: "We engage as early as possible, typically during the conceptual or schematic stage.",
      icon: <Building2 strokeWidth={1} size={32} className="text-brand-dark" />
    },
    {
      num: "02.",
      title: "Project Management",
      desc: "Our comprehensive estimates also reflect available lower-price options.",
      icon: <Layers strokeWidth={1} size={32} className="text-brand-dark" />
    },
    {
      num: "03.",
      title: "Investment & Capital",
      desc: "We are focused on improving the way capital projects get done.",
      icon: <HardHat strokeWidth={1} size={32} className="text-brand-dark" />
    },
    {
      num: "04.",
      title: "Construction Management",
      desc: "From design to operations, we love to solve complex challenges and exceed expectations.",
      icon: <Box strokeWidth={1} size={32} className="text-brand-dark" />
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          
          {/* Scrolling Pill */}
          <div className="border border-gray-300 rounded-full overflow-hidden w-48 h-8 mb-8 relative flex items-center bg-transparent">
            <motion.div 
              className="flex whitespace-nowrap text-xs font-bold uppercase tracking-widest text-brand-dark absolute"
              animate={{ x: ["-100%", "0%"] }}
              transition={{ duration: 15, ease: "linear", repeat: Infinity }}
            >
              <span className="px-4">WHO WE ARE</span>
              <span className="px-4 text-accent-gold">•</span>
              <span className="px-4">WHO WE ARE</span>
              <span className="px-4 text-accent-gold">•</span>
              <span className="px-4">WHO WE ARE</span>
              <span className="px-4 text-accent-gold">•</span>
              <span className="px-4">WHO WE ARE</span>
              <span className="px-4 text-accent-gold">•</span>
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-brand-dark leading-[1.05] tracking-tight mb-6"
          >
            High-quality construction <br /> & engineering
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark font-medium text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            We are a top tier builder and developer fully invested in our customers’ success and improving the communities we serve.
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative pb-20">
          
          {/* Left: Image with custom folder tab shape */}
          <div className="relative sticky top-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full aspect-[3/4] overflow-hidden rounded-[20px]"
              style={{
                clipPath: "polygon(0 0, 60% 0, 65% 5%, 100% 5%, 100% 100%, 0 100%)"
              }}
            >
              <img 
                src="/fleet-of-trucks.png" 
                alt="Construction Fleet" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Right: Scrolling Services List */}
          <div className="flex flex-col gap-0 w-full pt-8 lg:pt-0">
            {services.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-8 items-start py-10 border-t border-gray-200"
              >
                {/* Icon */}
                <div className="shrink-0 mt-2">
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-brand-dark">
                      {item.title}
                    </h3>
                    <span className="text-xs font-bold text-brand-dark ml-4">
                      {item.num}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed pr-8">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Bottom Link */}
        <div className="w-full flex justify-center text-center mt-8">
          <p className="font-bold text-sm text-brand-dark px-4 py-8 pointer-events-none">
            Discover top-tier real estate development services. <a href="/services" className="pointer-events-auto border-b border-brand-dark hover:text-accent-gold hover:border-accent-gold transition-colors pb-0.5 ml-2">View all services</a>
          </p>
        </div>

      </div>
    </section>
  );
}
