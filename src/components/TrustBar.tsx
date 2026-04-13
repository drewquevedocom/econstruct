import { COMPANY } from "@/lib/constants";
import { Shield, Award, Clock } from "lucide-react";

export default function TrustBar() {
  const badges = [
    { icon: Shield, label: COMPANY.license.display },
    { icon: Clock, label: "25+ Years Experience" },
    { icon: Award, label: "NAHB Member" },
  ];

  return (
    <section className="bg-brand-dark py-5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {badges.map((badge) => (
            badge.label === COMPANY.license.display ? (
              <a
                key={badge.label}
                href={COMPANY.license.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
              >
                <badge.icon size={16} className="text-accent-gold shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {badge.label}
                </span>
              </a>
            ) : (
              <div key={badge.label} className="flex items-center gap-2 text-white/80">
                <badge.icon size={16} className="text-accent-gold shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {badge.label}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
