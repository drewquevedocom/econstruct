import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Global Pre-Footer CTA */}
      <section className="bg-badge-navy text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-heading text-white mb-6">
            Ready to Build the Extraordinary?
          </h2>
          <p className="text-white/80 mb-10 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Experience the pinnacle of high-end residential construction. Fast execution, uncompromising quality, and maximum ROI.
          </p>
          <Link href="/contact" className="inline-block bg-accent-gold text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-accent-gold transition-colors duration-300 shadow-lg">
            Schedule Your Consultation
          </Link>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-brand-dark text-white pt-20 pb-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Col 1 */}
            <div>
              <h3 className="text-2xl font-heading text-white mb-6">E-Construct</h3>
              <p className="text-white/70 mb-6 font-medium leading-relaxed">
                Los Angeles' premier high-end residential contractor. Setting the standard for luxury builds and rapid fire rebuilds.
              </p>
              <div className="text-white/50 text-sm font-semibold tracking-wide">
                CA License #964015
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-accent-gold font-bold mb-6 tracking-wider uppercase text-sm">Services</h4>
              <ul className="space-y-4">
                <li><Link href="/services/fire-rebuild" className="text-white/70 hover:text-white transition-colors">Fire Rebuilds</Link></li>
                <li><Link href="/services/luxury-modernization" className="text-white/70 hover:text-white transition-colors">Luxury Modernization</Link></li>
                <li><Link href="/services/custom-homes" className="text-white/70 hover:text-white transition-colors">Custom Homes</Link></li>
                <li><Link href="/services/adu-construction" className="text-white/70 hover:text-white transition-colors">ADU & Additions</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-accent-gold font-bold mb-6 tracking-wider uppercase text-sm">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/our-work" className="text-white/70 hover:text-white transition-colors">Our Portfolio</Link></li>
                <li><Link href="/resources" className="text-white/70 hover:text-white transition-colors">Resources</Link></li>
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
            <p>&copy; {new Date().getFullYear()} eConstruct Inc. All rights reserved.</p>
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
