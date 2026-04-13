"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, Mail, Phone } from "lucide-react";

const inquiryTypes = [
  "General Inquiry",
  "Project Question",
  "Partnership",
  "Vendor / Trade",
  "Other",
];

const inputClasses =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all";
const labelClasses = "text-sm font-bold text-gray-700 uppercase tracking-wide";

export default function GenericContactForm() {
  const searchParams = useSearchParams();
  const leadSource = searchParams.get("source") || "contact_form";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "General Inquiry",
    message: "",
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.inquiryType,
          details: formData.message,
          source: leadSource,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-2xl md:p-12">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold/10">
            <CheckCircle2 size={40} className="text-accent-gold" />
          </div>
          <h3 className="mb-4 text-3xl font-bold text-brand-dark">Message Sent</h3>
          <p className="mb-8 max-w-md font-medium text-gray-500">
            Thanks for reaching out. Our team will review your message and respond within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                inquiryType: "General Inquiry",
                message: "",
              });
            }}
            className="border-b-2 border-brand-dark pb-1 font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-2xl md:p-12"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-brand-dark">Send a Message</h3>
        <p className="mt-3 text-gray-500">
          Use this form for general questions, introductions, or anything that is not a consultation request.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelClasses}>First Name</label>
          <input
            value={formData.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className={inputClasses}
            placeholder="John"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Last Name</label>
          <input
            value={formData.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className={inputClasses}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClasses}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClasses}
            placeholder="(310) 555-1234"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label className={labelClasses}>Inquiry Type</label>
        <select
          value={formData.inquiryType}
          onChange={(e) => update("inquiryType", e.target.value)}
          className={inputClasses}
        >
          {inquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label className={labelClasses}>Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputClasses} min-h-[160px] resize-none`}
          placeholder="How can we help?"
          required
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-8 py-4 font-bold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        <a
          href="tel:3107409999"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-8 py-4 font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
        >
          <Phone size={18} />
          Call Instead
        </a>
      </div>
    </form>
  );
}
