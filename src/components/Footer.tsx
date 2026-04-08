import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/components/Logo";
import GatekeeperCTA from "@/components/GatekeeperCTA";

export default function Footer() {
  return (
    <>
      <GatekeeperCTA />

      {/* Global Footer */}
      <footer className="bg-brand-dark text-white pt-20 pb-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Col 1 */}
            <div>
              <div className="mb-6">
                <Logo height={40} tone="dark" glow="none" />
              </div>
              <p className="text-white/70 mb-6 font-medium leading-relaxed">
                Los Angeles&apos; premier high-end residential contractor. Setting the standard for luxury builds and rapid fire rebuilds.
              </p>
              <a
                href="https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 text-sm font-semibold tracking-wide no-underline hover:no-underline hover:text-white transition-colors"
              >
                CA Lic #964015
              </a>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-accent-gold font-bold mb-6 tracking-wider uppercase text-sm">Services</h4>
              <ul className="space-y-4">
                <li><Link href="/services/luxury-home-builder-los-angeles" className="text-white/70 hover:text-white transition-colors">Luxury Home Building</Link></li>
                <li><Link href="/services/fire-rebuild-contractor-los-angeles" className="text-white/70 hover:text-white transition-colors">Fire Rebuild</Link></li>
                <li><Link href="/services/custom-home-construction-los-angeles" className="text-white/70 hover:text-white transition-colors">Custom Home Construction</Link></li>
                <li><Link href="/services/home-additions-los-angeles" className="text-white/70 hover:text-white transition-colors">Home Additions</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-accent-gold font-bold mb-6 tracking-wider uppercase text-sm">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/projects" className="text-white/70 hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/service-areas" className="text-white/70 hover:text-white transition-colors">Service Areas</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-accent-gold font-bold mb-6 tracking-wider uppercase text-sm">Contact Us</h4>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-3">
                  <Phone size={20} className="text-accent-gold shrink-0 mt-1" />
                  <a href="tel:8889900303" className="hover:text-white transition-colors">(888) 990-0303</a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={20} className="text-accent-gold shrink-0 mt-1" />
                  <a href="mailto:info@econstructinc.com" className="hover:text-white transition-colors">info@econstructinc.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-accent-gold shrink-0 mt-1" />
                  <span>Los Angeles, CA</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} econstruct Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
