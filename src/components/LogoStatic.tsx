/* eslint-disable @next/next/no-img-element */
interface LogoProps {
  height?: number;
  tone?: "light" | "dark";
  glow?: "none" | "burst";
  className?: string;
  eRotation?: number;
}

export default function LogoStatic({
  height = 32,
  tone = "light",
  glow = "none",
  className = "",
  eRotation = 0,
}: LogoProps) {
  const markHeight = height * 1.55;
  const markWidth = markHeight * 1.04;
  const wordmarkHeight = height * 0.61;
  const wordmarkGap = height * 0.05;
  const wordmarkFilter =
    tone === "dark"
      ? "brightness(0) invert(1) drop-shadow(0 12px 20px rgba(0,0,0,0.22))"
      : "drop-shadow(0 12px 18px rgba(0,0,0,0.08))";
  const showGlow = glow === "burst";

  return (
    <div
      className={`flex items-center gap-[2px] overflow-visible ${className}`}
      style={{ height: Math.max(height, markHeight) }}
    >
      <div
        className="relative shrink-0 overflow-visible"
        style={{
          width: markWidth,
          height: markHeight,
          transform: "translateX(-2px)",
        }}
      >
        {showGlow ? (
          <div
            className="pointer-events-none absolute inset-[-12%] z-0 logo-burst-glow"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,72,72,0.38) 32%, rgba(155,16,16,0.2) 58%, transparent 75%)",
              filter: "blur(20px)",
              mixBlendMode: "screen",
            }}
          />
        ) : null}

        <div
          className="absolute inset-0 z-10"
          style={{
            clipPath:
              "polygon(0% 0%, 86% 0%, 100% 14%, 100% 100%, 14% 100%, 0% 86%)",
            filter:
              "drop-shadow(0 16px 18px rgba(88,16,16,0.18)) drop-shadow(0 4px 8px rgba(0,0,0,0.14))",
          }}
        >
          <img
            src="/econstruct_red_square.png"
            alt="econstruct"
            className="absolute inset-0 h-full w-full object-contain"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />

          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: 0.13 }}
          >
            <defs>
              <pattern
                id="econstruct-blueprint-grid"
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 7 0 L 0 0 0 7"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.35"
                />
              </pattern>
            </defs>
            <rect
              x="6"
              y="6"
              width="88"
              height="88"
              fill="url(#econstruct-blueprint-grid)"
            />
            <g
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.6"
              strokeLinecap="square"
            >
              <rect x="12" y="16" width="28" height="22" />
              <rect x="42" y="16" width="22" height="14" />
              <rect x="66" y="16" width="22" height="22" />
              <rect x="12" y="42" width="22" height="30" />
              <rect x="36" y="42" width="30" height="18" />
              <rect x="68" y="42" width="20" height="30" />
              <rect x="14" y="76" width="30" height="12" />
              <rect x="48" y="76" width="40" height="12" />
              <line x1="12" y1="12" x2="88" y2="12" strokeDasharray="1.5 1.5" />
              <line x1="12" y1="92" x2="88" y2="92" strokeDasharray="1.5 1.5" />
              <line x1="50" y1="16" x2="50" y2="72" strokeDasharray="1 2" />
            </g>
          </svg>
        </div>

        <div
          className="absolute z-20 overflow-visible"
          style={{
            top: "50%",
            left: "50%",
            width: "65%",
            height: "65%",
            transform: `translate(-50%, -50%) rotate(${eRotation}deg)`,
            transition: "transform 1.1s cubic-bezier(0.16, 0.9, 0.24, 1)",
            transformOrigin: "center center",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {showGlow ? (
            <>
              <div
                className="pointer-events-none absolute inset-[-16%] z-0 logo-burst-glow"
                style={{
                  background:
                    "radial-gradient(circle at 50% 46%, rgba(255,248,216,0.95) 0%, rgba(255,235,160,0.52) 18%, rgba(212,175,55,0.28) 40%, transparent 66%)",
                  mixBlendMode: tone === "dark" ? "screen" : "soft-light",
                }}
              />
              <div
                className="pointer-events-none absolute inset-[-28%] z-0 logo-burst-glow"
                style={{
                  background:
                    "radial-gradient(circle at 50% 52%, rgba(255,214,92,0.58) 0%, rgba(184,150,62,0.24) 34%, transparent 62%)",
                  filter: "blur(18px)",
                }}
              />
            </>
          ) : null}

          <img
            src="/econstruct_e_white.png"
            alt=""
            className="logo-e-border-rest relative z-10 h-full w-full object-contain"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      <div
        className="relative shrink-0 overflow-visible"
        style={{
          height: wordmarkHeight,
          width: wordmarkHeight * 4.95,
          marginLeft: wordmarkGap,
        }}
      >
        <img
          src="/construct.png"
          alt=""
          className="relative z-10 h-full w-full object-contain"
          style={{ filter: wordmarkFilter }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}
