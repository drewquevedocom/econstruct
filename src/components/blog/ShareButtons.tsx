"use client";

import { useState } from "react";
import { Copy, Facebook, Linkedin, Mail, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
    },
  ];

  return (
    <div className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
          <Share2 className="h-5 w-5 text-accent-gold" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-dark">
            Share This Article
          </p>
          <p className="text-sm text-body-text">Send it to your architect, adjuster, or spouse.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-dark/10 px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              {link.label}
            </a>
          );
        })}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-brand-dark/10 px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
