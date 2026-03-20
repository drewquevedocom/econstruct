"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Sparkles,
  Home,
  Building2,
  ArrowRight,
  ArrowLeft,
  Calculator,
  MapPin,
  Ruler,
  Crown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type ProjectType = "fire-rebuild" | "luxury-modernization" | "custom-home" | "adu";
type QualityTier = "standard" | "premium" | "ultra";
type LocationZone = "wui-zone" | "premium-area" | "other-la";

const baseCosts: Record<ProjectType, { low: number; high: number }> = {
  "fire-rebuild": { low: 450, high: 800 },
  "luxury-modernization": { low: 450, high: 800 },
  "custom-home": { low: 500, high: 1000 },
  adu: { low: 350, high: 600 },
};

const locationMultiplier: Record<LocationZone, number> = {
  "wui-zone": 1.15,
  "premium-area": 1.0,
  "other-la": 0.9,
};

const qualityMultiplier: Record<QualityTier, number> = {
  standard: 0.85,
  premium: 1.0,
  ultra: 1.25,
};

const projectTypes: { value: ProjectType; label: string; icon: typeof Flame; desc: string }[] = [
  { value: "fire-rebuild", label: "Fire Rebuild", icon: Flame, desc: "Rebuild your home after fire damage with modern, WUI-compliant construction" },
  { value: "luxury-modernization", label: "Luxury Modernization", icon: Sparkles, desc: "Transform your existing home with high-end finishes and modern design" },
  { value: "custom-home", label: "Custom Home", icon: Home, desc: "Build a brand-new luxury home from the ground up on your lot" },
  { value: "adu", label: "ADU / Addition", icon: Building2, desc: "Add an accessory dwelling unit or expand your existing home" },
];

const qualityTiers: { value: QualityTier; label: string; range: string; desc: string }[] = [
  { value: "standard", label: "Standard Premium", range: "$350-$450/sqft", desc: "High-quality materials and finishes, efficient design, excellent craftsmanship" },
  { value: "premium", label: "Premium", range: "$450-$600/sqft", desc: "Designer finishes, premium appliances, smart home integration, custom cabinetry" },
  { value: "ultra", label: "Ultra Premium", range: "$600-$800+/sqft", desc: "Bespoke everything: imported materials, custom millwork, resort-level amenities" },
];

const locationZones: { value: LocationZone; label: string; desc: string }[] = [
  { value: "wui-zone", label: "Pacific Palisades / Malibu / WUI Zone", desc: "Requires fire-hardened construction, ember-resistant vents, and defensible space compliance (+15%)" },
  { value: "premium-area", label: "Brentwood / Bel Air / Santa Monica", desc: "Premium Los Angeles neighborhoods with standard building requirements" },
  { value: "other-la", label: "Other LA Area", desc: "Greater Los Angeles County with standard permitting and construction requirements" },
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${(value / 1_000).toFixed(0)}K`;
}

export default function CostCalculator() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [sqft, setSqft] = useState(3000);
  const [quality, setQuality] = useState<QualityTier | null>(null);
  const [location, setLocation] = useState<LocationZone | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return projectType !== null;
      case 2: return sqft >= 500 && sqft <= 15000;
      case 3: return quality !== null;
      case 4: return location !== null;
      default: return false;
    }
  };

  const calculateEstimate = () => {
    if (!projectType || !quality || !location) return { low: 0, high: 0 };
    const base = baseCosts[projectType];
    const locMult = locationMultiplier[location];
    const qualMult = qualityMultiplier[quality];
    return {
      low: Math.round(sqft * base.low * locMult * qualMult),
      high: Math.round(sqft * base.high * locMult * qualMult),
    };
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setFormSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const estimate = calculateEstimate();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Progress bar */}
      {step <= 4 && (
        <div className="px-8 pt-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s < step
                      ? "bg-accent-gold text-white"
                      : s === step
                        ? "bg-brand-dark text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s < step ? <CheckCircle2 size={16} /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      s < step ? "bg-accent-gold" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-medium mb-6">
            <span>Project</span>
            <span>Size</span>
            <span>Quality</span>
            <span>Location</span>
          </div>
        </div>
      )}

      <div className="px-8 pb-8 min-h-[420px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2">What type of project?</h3>
              <p className="text-gray-500 mb-6">Select the option that best describes your project.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectTypes.map((pt) => {
                  const Icon = pt.icon;
                  const isSelected = projectType === pt.value;
                  return (
                    <button
                      key={pt.value}
                      onClick={() => setProjectType(pt.value)}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-accent-gold bg-accent-gold/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? "bg-accent-gold text-white" : "bg-gray-100 text-gray-500"}`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <span className="font-bold text-brand-dark block">{pt.label}</span>
                        <span className="text-sm text-gray-500 mt-1 block">{pt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Square Footage */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2 flex items-center gap-3">
                <Ruler size={24} className="text-accent-gold" />
                Approximate square footage
              </h3>
              <p className="text-gray-500 mb-8">Drag the slider or type a number. Range: 500 - 15,000 sq ft.</p>

              <div className="flex flex-col items-center gap-8">
                <div className="text-center">
                  <span className="text-6xl font-bold text-brand-dark">{sqft.toLocaleString()}</span>
                  <span className="text-2xl text-gray-400 ml-2">sq ft</span>
                </div>

                <input
                  type="range"
                  min={500}
                  max={15000}
                  step={100}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-accent-gold"
                />
                <div className="flex justify-between w-full text-sm text-gray-400">
                  <span>500 sq ft</span>
                  <span>15,000 sq ft</span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-bold text-gray-600">Or enter exact:</label>
                  <input
                    type="number"
                    min={500}
                    max={15000}
                    value={sqft}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val <= 15000) setSqft(val);
                    }}
                    className="w-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-brand-dark font-bold focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quality Tier */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2 flex items-center gap-3">
                <Crown size={24} className="text-accent-gold" />
                Select quality tier
              </h3>
              <p className="text-gray-500 mb-6">Choose the level of finishes and materials for your project.</p>
              <div className="flex flex-col gap-4">
                {qualityTiers.map((qt) => {
                  const isSelected = quality === qt.value;
                  return (
                    <button
                      key={qt.value}
                      onClick={() => setQuality(qt.value)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-accent-gold bg-accent-gold/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-brand-dark block">{qt.label}</span>
                        <span className="text-sm text-gray-500 mt-1 block">{qt.desc}</span>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ml-4 px-3 py-1 rounded-full ${
                        isSelected ? "bg-accent-gold text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {qt.range}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2 flex items-center gap-3">
                <MapPin size={24} className="text-accent-gold" />
                Project location
              </h3>
              <p className="text-gray-500 mb-6">Location affects costs due to zoning requirements and accessibility.</p>
              <div className="flex flex-col gap-4">
                {locationZones.map((lz) => {
                  const isSelected = location === lz.value;
                  return (
                    <button
                      key={lz.value}
                      onClick={() => setLocation(lz.value)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-accent-gold bg-accent-gold/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-bold text-brand-dark block">{lz.label}</span>
                      <span className="text-sm text-gray-500 mt-1 block">{lz.desc}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 5: Results */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Calculator size={16} />
                  Preliminary Estimate
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">Your Estimated Project Cost</h3>
                <p className="text-gray-500">
                  Based on {sqft.toLocaleString()} sq ft &middot;{" "}
                  {projectTypes.find((p) => p.value === projectType)?.label} &middot;{" "}
                  {qualityTiers.find((q) => q.value === quality)?.label}
                </p>
              </div>

              <div className="bg-gradient-to-br from-brand-dark to-black rounded-2xl p-8 text-center mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Low Estimate</p>
                    <p className="text-3xl md:text-4xl font-bold text-white">{formatCurrency(estimate.low)}</p>
                  </div>
                  <span className="text-white/30 text-3xl font-light">&mdash;</span>
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">High Estimate</p>
                    <p className="text-3xl md:text-4xl font-bold text-accent-gold">{formatCurrency(estimate.high)}</p>
                  </div>
                </div>
                <div className="mt-4 text-white/40 text-sm">
                  ${(estimate.low / sqft).toFixed(0)} - ${(estimate.high / sqft).toFixed(0)} per sq ft
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This is a preliminary estimate. Actual costs depend on site conditions, design complexity,
                  material selections, and current market conditions. Schedule a free consultation for a
                  precise, project-specific estimate.
                </p>
              </div>

              {!showLeadForm && !formSubmitted && (
                <div className="text-center">
                  <button
                    onClick={() => setShowLeadForm(true)}
                    className="inline-flex items-center justify-center gap-2 bg-accent-gold text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-brand-dark shadow-md transition-all duration-300 text-base"
                  >
                    Get a Precise Estimate &mdash; Free Consultation
                    <ArrowRight size={18} />
                  </button>
                  <p className="text-gray-400 text-sm mt-3">No obligation. We respond within 24 hours.</p>
                </div>
              )}

              {showLeadForm && !formSubmitted && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmitLead}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                >
                  <h4 className="text-lg font-bold text-brand-dark mb-4">
                    Get Your Detailed Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="(310) 555-0000"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mb-6">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-brand-dark font-medium focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-black transition-colors disabled:opacity-75"
                  >
                    {isSubmitting ? "Sending..." : "Send My Detailed Estimate"}
                  </button>
                </motion.form>
              )}

              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center bg-green-50 border border-green-200 rounded-2xl p-8"
                >
                  <CheckCircle2 size={40} className="text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-brand-dark mb-2">Request Received!</h4>
                  <p className="text-gray-600">
                    A member of our team will reach out within 24 hours with your detailed project estimate.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step <= 4 && (
        <div className="px-8 pb-8 flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 rounded-xl py-3.5 px-6 font-bold hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-dark text-white rounded-xl py-3.5 font-bold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 4 ? "See My Estimate" : "Continue"}
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="px-8 pb-8">
          <button
            onClick={() => {
              setStep(1);
              setProjectType(null);
              setSqft(3000);
              setQuality(null);
              setLocation(null);
              setShowLeadForm(false);
              setFormSubmitted(false);
            }}
            className="text-sm text-gray-400 hover:text-brand-dark font-medium transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
