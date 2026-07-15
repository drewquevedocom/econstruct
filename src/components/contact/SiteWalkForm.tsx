"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Building2, Phone } from "lucide-react";

const facilityTypes = [
  "Food Distribution Center",
  "Cold Storage / Refrigerated Warehouse",
  "Ghost Kitchen / Commercial Kitchen",
  "Food Processing Facility",
  "Commercial / Industrial TI",
  "Other",
];

const facilitySizes = [
  "Under 5,000 sq ft",
  "5,000 – 15,000 sq ft",
  "15,000 – 50,000 sq ft",
  "50,000 – 100,000 sq ft",
  "100,000+ sq ft",
  "Not sure yet",
];

const siteStatuses = [
  "Existing facility — retrofit / TI needed",
  "Shell building — full build-out",
  "Ground-up new construction",
  "Evaluating multiple options",
];

const timelines = [
  "Need to move immediately",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "Planning phase only",
];

const inputClasses =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all";
const labelClasses = "text-sm font-bold text-gray-700 uppercase tracking-wide";

export default function SiteWalkForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    facilityType: "",
    facilitySize: "",
    zipCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    siteStatus: "",
    timeline: "",
    details: "",
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNext = (e: MouseEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = (e: MouseEvent) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const detailsText = [
      `Facility Type: ${formData.facilityType}`,
      `Facility Size: ${formData.facilitySize}`,
      `Site Status: ${formData.siteStatus}`,
      formData.company ? `Company: ${formData.company}` : null,
      formData.details ? `\nAdditional Details:\n${formData.details}` : null,
      `\nLanding page: ${typeof window !== "undefined" ? window.location.href : ""}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode,
          projectType: formData.facilityType,
          timeline: formData.timeline,
          details: detailsText,
          source: "site_walk_commercial",
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setSubmitError(json.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("econstruct:form_submit_success", {
            detail: {
              form_id: "site-walk-commercial",
              form_destination: window.location.href,
              form_name: "commercial site walk request",
            },
          })
        );
      }
      setStep(4);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
      {/* Progress bar */}
      {step < 4 && (
        <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10 overflow-hidden">
          <div
            className="bg-accent-gold h-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="relative min-h-[340px]">
        <AnimatePresence mode="wait">

          {/* STEP 1: Facility Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-1">Step 1 of 3</p>
                <h3 className="text-2xl font-bold text-brand-dark">Tell us about the facility</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Facility Type</label>
                <select
                  value={formData.facilityType}
                  onChange={(e) => update("facilityType", e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select facility type...</option>
                  {facilityTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Approximate Size</label>
                <select
                  value={formData.facilitySize}
                  onChange={(e) => update("facilitySize", e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select size range...</option>
                  {facilitySizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Facility ZIP Code</label>
                <input
                  type="text"
                  placeholder="e.g. 90040"
                  value={formData.zipCode}
                  onChange={(e) => update("zipCode", e.target.value)}
                  className={inputClasses}
                  inputMode="numeric"
                />
              </div>

              <button
                onClick={handleNext}
                className="mt-2 bg-brand-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Contact Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-1">Step 2 of 3</p>
                <h3 className="text-2xl font-bold text-brand-dark">Your contact info</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Phone</label>
                  <input
                    type="tel"
                    placeholder="(310) 555-1234"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>
                    Company <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ACME Foods Inc."
                    value={formData.company}
                    onChange={(e) => update("company", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-2">
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
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Site Status & Timing */}
          {step === 3 && (
            <motion.form
              id="site-walk-commercial"
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-1">Step 3 of 3</p>
                <h3 className="text-2xl font-bold text-brand-dark">Site status & timing</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Current Site Status</label>
                <select
                  value={formData.siteStatus}
                  onChange={(e) => update("siteStatus", e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select status...</option>
                  {siteStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Target Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => update("timeline", e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select timeline...</option>
                  {timelines.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Additional Details <span className="text-gray-400 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the project, any special requirements, or constraints we should know about before the site walk..."
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

              <div className="flex gap-4 mt-2">
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
                    <><Loader2 size={18} className="animate-spin" /> Sending...</>
                  ) : (
                    <>Request Site Walk <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-10"
            >
              <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-accent-gold" />
              </div>
              <h3 className="text-3xl font-bold text-brand-dark mb-4">Request Received</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-2">
                The econstruct team will review your facility details and reach out within 24 hours to schedule the site walk.
              </p>
              <p className="text-gray-400 text-sm mb-8">CA Lic #964015</p>
              <a
                href="tel:3107409999"
                className="inline-flex items-center gap-2 bg-brand-dark text-white rounded-full px-8 py-4 font-bold hover:bg-black transition-colors"
              >
                <Phone size={18} /> Call (310) 740-9999
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
