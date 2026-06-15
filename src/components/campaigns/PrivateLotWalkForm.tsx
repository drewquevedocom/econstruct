"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";

const lotWalkSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number is required"),
  zipCode: z.string().min(5, "Enter the property ZIP code"),
  projectType: z.string().min(1, "Select a project type"),
  budget: z.string().min(1, "Select a budget range"),
  timeline: z.string().optional(),
  details: z.string().optional(),
});

type LotWalkFormData = z.infer<typeof lotWalkSchema>;

const projectTypes = [
  "Ground-up custom home",
  "Full estate remodel",
  "Major addition or partial remodel",
  "Lot evaluation before design",
  "Not sure yet",
];

const budgets = [
  "$750K - $1.5M",
  "$1.5M - $3M",
  "$3M - $5M",
  "$5M+",
  "Still defining scope",
];

const timelines = [
  "Ready to discuss now",
  "Planning in 1 - 3 months",
  "Planning in 3 - 6 months",
  "Planning this year",
  "Early research",
];

export default function PrivateLotWalkForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const campaignSource = useMemo(() => {
    const source = searchParams.get("utm_source") || searchParams.get("source") || "postcard";
    const medium = searchParams.get("utm_medium") || "direct_mail";
    const campaign = searchParams.get("utm_campaign") || "private_lot_walk";
    return `${campaign}:${medium}:${source}`;
  }, [searchParams]);

  const trackingSummary = useMemo(() => {
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) return "No URL tracking parameters supplied.";
    return entries.map(([key, value]) => `${key}=${value}`).join("; ");
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LotWalkFormData>({
    resolver: zodResolver(lotWalkSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      projectType: "",
      budget: "",
      timeline: "",
      details: "",
    },
  });

  const onSubmit = async (data: LotWalkFormData) => {
    setSubmitError(null);
    const details = [
      data.details,
      "",
      `Campaign source: ${campaignSource}`,
      `Landing page: ${window.location.href}`,
      `Tracking params: ${trackingSummary}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          details,
          source: campaignSource,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setSubmitError(json.error || "Something went wrong. Please try again.");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("econstruct:form_submit_success", {
          detail: {
            form_id: "private-lot-walk",
            form_destination: window.location.href,
            form_name: "private lot walk request",
            campaign_source: campaignSource,
          },
        }),
      );
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  const inputClasses =
    "w-full rounded-2xl border border-[#ddd5c8] bg-[#fbf7ed] px-4 py-4 text-[15px] font-semibold text-brand-dark outline-none transition focus:border-accent-gold focus:bg-white focus:ring-4 focus:ring-accent-gold/15";
  const labelClasses = "text-xs font-black uppercase tracking-[0.18em] text-brand-dark/70";
  const errorClasses = "mt-1 text-sm font-semibold text-red-600";

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-accent-gold/25 bg-[#fbf7ed] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/12">
          <CheckCircle2 className="h-8 w-8 text-accent-gold" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark">
          Your private lot walk request is in.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-body-text">
          Frank&apos;s team will review the property details and follow up directly to schedule the conversation.
        </p>
        <a
          href="tel:3107409999"
          className="mt-7 inline-flex rounded-full bg-brand-dark px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-accent-gold"
        >
          Call direct now
        </a>
      </div>
    );
  }

  return (
    <form
      id="private-lot-walk"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[2rem] border border-[#e2d8c5] bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.14)] md:p-8"
    >
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-accent-gold">
          Reserve a lot walk
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-dark">
          Tell us what you are considering.
        </h2>
        <p className="mt-3 text-sm leading-6 text-body-text">
          This goes directly to the econstruct team with campaign tracking attached.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClasses}>First name</label>
          <input {...register("firstName")} className={inputClasses} autoComplete="given-name" />
          {errors.firstName && <p className={errorClasses}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Last name</label>
          <input {...register("lastName")} className={inputClasses} autoComplete="family-name" />
          {errors.lastName && <p className={errorClasses}>{errors.lastName.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Email</label>
          <input {...register("email")} type="email" className={inputClasses} autoComplete="email" />
          {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Phone</label>
          <input {...register("phone")} type="tel" className={inputClasses} autoComplete="tel" />
          {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Property ZIP</label>
          <input {...register("zipCode")} className={inputClasses} inputMode="numeric" placeholder="90210" />
          {errors.zipCode && <p className={errorClasses}>{errors.zipCode.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Project type</label>
          <select {...register("projectType")} className={inputClasses}>
            <option value="">Select one</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.projectType && <p className={errorClasses}>{errors.projectType.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Expected investment</label>
          <select {...register("budget")} className={inputClasses}>
            <option value="">Select range</option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
          {errors.budget && <p className={errorClasses}>{errors.budget.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Timing</label>
          <select {...register("timeline")} className={inputClasses}>
            <option value="">Select timing</option>
            {timelines.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClasses}>Anything we should know before calling?</label>
        <textarea
          {...register("details")}
          rows={4}
          className={`${inputClasses} resize-none`}
          placeholder="Lot address, hillside conditions, remodel scope, architect status, or timing pressure."
        />
      </div>

      {submitError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent-gold px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(184,150,62,0.24)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending request
          </>
        ) : (
          <>
            Reserve a private lot walk
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs font-semibold leading-5 text-body-text">
        Prefer direct? Call <a href="tel:3107409999" className="text-brand-dark underline decoration-accent-gold underline-offset-4">(310) 740-9999</a>.
      </p>
    </form>
  );
}
