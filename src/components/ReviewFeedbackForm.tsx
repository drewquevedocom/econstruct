"use client";

import { useState } from "react";

const PROJECT_TYPES = ["ADU", "Commercial TI", "Restaurant Build-Out", "Fire Rebuild", "Other"];

export default function ReviewFeedbackForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/review-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <form action={submit} className="mt-4 grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <label className="text-xs font-bold text-gray-500">
          Project Type
          <select name="projectType" className="mt-1 h-11 w-full rounded-xl border border-[#E8E4DC] bg-white px-3 text-sm outline-none focus:border-[#B8963E]">
            {PROJECT_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold text-gray-500">
          Star Rating
          <select name="rating" className="mt-1 h-11 w-full rounded-xl border border-[#E8E4DC] bg-white px-3 text-sm outline-none focus:border-[#B8963E]">
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-xs font-bold text-gray-500">
        Feedback
        <textarea
          name="feedback"
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-[#E8E4DC] px-3 py-2 text-sm outline-none focus:border-[#B8963E]"
        />
      </label>
      <button
        disabled={status === "sending"}
        className="h-11 rounded-xl bg-[#1C1C1E] px-5 text-sm font-bold text-white disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Private Feedback"}
      </button>
      {status === "sent" && <p className="text-sm font-semibold text-green-700">Thank you. Your feedback was sent.</p>}
      {status === "error" && <p className="text-sm font-semibold text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-bold text-gray-500">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 h-11 w-full rounded-xl border border-[#E8E4DC] px-3 text-sm outline-none focus:border-[#B8963E]"
      />
    </label>
  );
}
