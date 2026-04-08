"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

const projectTypes = [
  "Fire Rebuild",
  "Luxury Modernization",
  "Ground-Up Custom Home",
  "ADU & Additions",
  "Commercial / Other",
];

const budgetRanges = [
  "Under $500K",
  "$500K - $1M",
  "$1M - $3M",
  "$3M - $5M",
  "Over $5M",
];

const inputClasses =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all";
const labelClasses = "text-sm font-bold text-gray-700 uppercase tracking-wide";

export default function ConsultationCTA() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Controlled form state
  const [formData, setFormData] = useState({
    projectType: "",
    zipCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    budget: "",
    details: "",
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "consultation_cta" }),
      });

      if (!res.ok) {
        const json = await res.json();
        setSubmitError(json.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setStep(4); // Success
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            Start Your Project —{" "}
            <br className="hidden md:block" /> Free Consultation
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
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    Project Basics (1/3)
                  </h3>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => update("projectType", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Select a project type...</option>
                      {projectTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Property ZIP Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 90210"
                      value={formData.zipCode}
                      onChange={(e) => update("zipCode", e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  <button
                    onClick={handleNext}
                    className="mt-4 bg-brand-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                  >
                    Continue to Contact Info <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Contact Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    Your Information (2/3)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className={labelClasses}>First Name</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClasses}>Last Name</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>
                      Phone{" "}
                      <span className="text-gray-400 normal-case font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(310) 555-1234"
                      value={formData.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleBack}
                      className="bg-gray-100 text-gray-600 rounded-xl py-4 px-8 font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-brand-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                    >
                      Continue to Details <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
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
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    Final Details (3/3)
                  </h3>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Estimated Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Select a budget range...</option>
                      {budgetRanges.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>
                      Additional Details{" "}
                      <span className="text-gray-400 normal-case font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what you're looking to achieve..."
                      value={formData.details}
                      onChange={(e) => update("details", e.target.value)}
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleBack}
                      type="button"
                      className="bg-gray-100 text-gray-600 rounded-xl py-4 px-8 font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-accent-gold text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#a68636] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Request Consultation <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 4: Success */}
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
                  <h3 className="text-3xl font-bold text-brand-dark mb-4">
                    Request Received
                  </h3>
                  <p className="text-gray-500 font-medium max-w-sm mb-8">
                    Thank you. A member of the econstruct executive team will be
                    in touch within 24 hours to schedule your consultation.
                  </p>
                  <button
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        projectType: "",
                        zipCode: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        budget: "",
                        details: "",
                      });
                    }}
                    className="text-brand-dark font-bold border-b-2 border-brand-dark pb-1 hover:text-accent-gold hover:border-accent-gold transition-colors"
                  >
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
