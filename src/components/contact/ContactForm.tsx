"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Loader2,
} from "lucide-react";

const contactSchema = z.object({
  projectType: z.string().min(1, "Select a project type"),
  zipCode: z.string().min(5, "Enter a valid zip code"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  budget: z.string().min(1, "Select a budget range"),
  timeline: z.string().optional(),
  details: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

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

const timelineOptions = [
  "As soon as possible",
  "1 - 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "Just exploring",
];

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      projectType: "",
      zipCode: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      budget: "",
      timeline: "",
      details: "",
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof ContactFormData)[] = [];
    if (step === 1) fieldsToValidate = ["projectType", "zipCode"];
    if (step === 2) fieldsToValidate = ["firstName", "lastName", "email"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact_form" }),
      });

      if (!res.ok) {
        const json = await res.json();
        setSubmitError(json.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  const inputClasses =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all";
  const labelClasses =
    "text-sm font-bold text-gray-700 uppercase tracking-wide";
  const errorClasses = "text-red-500 text-xs font-medium mt-1";

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 border border-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-12"
        >
          <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-accent-gold" />
          </div>
          <h3 className="text-3xl font-bold text-brand-dark mb-4">
            Request Received
          </h3>
          <p className="text-gray-500 font-medium max-w-sm mb-8">
            Thank you. A member of the eConstruct executive team will be in
            touch within 24 hours to schedule your consultation.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
            }}
            className="text-brand-dark font-bold border-b-2 border-brand-dark pb-1 hover:text-accent-gold hover:border-accent-gold transition-colors"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 relative overflow-hidden border border-gray-100">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2 rounded-full mb-12 overflow-hidden">
        <div
          className="bg-accent-gold h-full transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative min-h-[380px]">
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
                  <select {...register("projectType")} className={inputClasses}>
                    <option value="">Select a project type...</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p className={errorClasses}>
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Property ZIP Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 90210"
                    {...register("zipCode")}
                    className={inputClasses}
                  />
                  {errors.zipCode && (
                    <p className={errorClasses}>{errors.zipCode.message}</p>
                  )}
                </div>

                <button
                  type="button"
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
                      {...register("firstName")}
                      className={inputClasses}
                    />
                    {errors.firstName && (
                      <p className={errorClasses}>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={inputClasses}
                    />
                    {errors.lastName && (
                      <p className={errorClasses}>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className={inputClasses}
                  />
                  {errors.email && (
                    <p className={errorClasses}>{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>
                    Phone Number{" "}
                    <span className="text-gray-400 normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder="(310) 555-1234"
                    {...register("phone")}
                    className={inputClasses}
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-100 text-gray-600 rounded-xl py-4 px-8 font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-brand-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                  >
                    Continue to Details <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Budget, Timeline, Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-2xl font-bold text-brand-dark mb-2">
                  Final Details (3/3)
                </h3>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Estimated Budget</label>
                  <select {...register("budget")} className={inputClasses}>
                    <option value="">Select a budget range...</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p className={errorClasses}>{errors.budget.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>
                    Ideal Timeline{" "}
                    <span className="text-gray-400 normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <select {...register("timeline")} className={inputClasses}>
                    <option value="">Select a timeline...</option>
                    {timelineOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>
                    Project Details{" "}
                    <span className="text-gray-400 normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project, site address, or any specific requirements..."
                    {...register("details")}
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
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-100 text-gray-600 rounded-xl py-4 px-8 font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-accent-gold text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-accent-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Consultation <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-2">
                  Or call us directly:{" "}
                  <a
                    href="tel:+18182552210"
                    className="text-accent-gold font-bold hover:underline"
                  >
                    (818) 255-2210
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
