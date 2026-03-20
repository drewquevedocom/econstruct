import { COMPANY } from "@/lib/constants";
import { Shield, Award, Clock, BadgeCheck } from "lucide-react";

export default function TrustBar() {
  const badges = [
    { icon: Shield, label: COMPANY.license.display },
    { icon: Clock, label: "25+ Years Experience" },
    { icon: BadgeCheck, label: "BBB Accredited" },
    { icon: Award, label: "NAHB Member" },
  ];

  return (
    <section className="bg-brand-dark py-5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-white/80"
            >
              <badge.icon size={16} className="text-accent-gold shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {badge.label}
              </span>
            </div>
          ))}
          <a
            href={COMPANY.license.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-wider text-accent-gold hover:text-white transition-colors"
          >
            Verify License →
          </a>
        </div>
      </div>
    </section>
  );
}
