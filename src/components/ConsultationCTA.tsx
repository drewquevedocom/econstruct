"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ConsultationCTA() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setStep(4); // Success step
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className="py-24 md:py-32 bg-[#F8F6F2] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark tracking-tight mb-6"
          >
            Start Your Project — <br className="hidden md:block"/> Free Consultation
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium text-lg"
          >
            Complete the form below to help us understand your vision.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 relative overflow-hidden border border-gray-100"
        >
          {/* Progress Bar */}
          {step < 4 && (
            <div className="w-full bg-gray-100 h-2 rounded-full mb-12 overflow-hidden">
              <div 
                className="bg-accent-gold h-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: Project Type & Zip */}
              {step === 1 && (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Project Basics (1/3)</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Project Type</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all">
                      <option>Fire Rebuild</option>
                      <option>Luxury Modernization</option>
                      <option>Ground-Up Custom Home</option>
                      <option>Commercial / Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Property ZIP Code</label>
                    <input type="text" placeholder="e.g. 90210" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all" />
                  </div>

                  <button onClick={handleNext} className="mt-4 bg-brand-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors">
                    Continue to Contact Info <ArrowRight size={18} />
                  </button>
                </motion.form>
              )}

              {/* STEP 2: Contact Info */}
              {step === 2 && (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Your Information (2/3)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                      <input type="text" placeholder="John" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                      <input type="text" placeholder="Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all" />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button onClick={handleBack} className="bg-gray-100 text-gray-600 rounded-xl py-4 px-8 font-bold hover:bg-gray-200 transition-colors">
                      Back
                    </button>
                    <button onClick={handleNext} className="flex-1 bg-brand-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors">
                      Continue to Details <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: Budget & Submit */}
              {step === 3 && (
                <motion.form 
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Final Details (3/3)</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Estimated Budget</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all">
                      <option>Under $500k</option>
                      <option>$500k - $1M</option>
                      <option>$1M - $3M</option>
                      <option>Over $3M</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Additional Details (Optional)</label>
                    <textarea rows={4} placeholder="Briefly describe what you're looking to achieve..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all resize-none"></textarea>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button onClick={handleBack} type="button" className="bg-gray-100 text-gray-600 rounded-xl py-4 px-8 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent-gold text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#a68636] transition-colors disabled:opacity-75 relative">
                      {isSubmitting ? "Sending Request..." : "Request Consultation"}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 4: Success Message */}
              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center h-[300px]"
                >
                  <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-accent-gold" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-dark mb-4">Request Received</h3>
                  <p className="text-gray-500 font-medium max-w-sm mb-8">
                    Thank you. A member of the eConstruct executive team will be in touch within 24 hours to schedule your consultation.
                  </p>
                  <button onClick={() => setStep(1)} className="text-brand-dark font-bold border-b-2 border-brand-dark pb-1 hover:text-accent-gold hover:border-accent-gold transition-colors">
                    Submit Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
