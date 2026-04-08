/* eslint-disable @next/next/no-img-element */
interface LogoProps {
  height?: number;
  tone?: "light" | "dark";
  glow?: "none" | "subtle";
  className?: string;
  eRotation?: number;
  animateE?: boolean;
}

export default function LogoStatic({
  height = 32,
  tone = "light",
  glow = "subtle",
  className = "",
  eRotation = 0,
  animateE = false,
}: LogoProps) {
  const markHeight = height * 1.55;
  const markWidth = markHeight * 1.04;
  const wordmarkHeight = height * 0.61;
  const wordmarkGap = height * 0.05;
  const wordmarkFilter =
    tone === "dark"
      ? "brightness(0) invert(1) drop-shadow(0 10px 18px rgba(0,0,0,0.18))"
      : "drop-shadow(0 12px 18px rgba(0,0,0,0.08))";
  const showGlow = glow === "subtle";

  return (
    <div
      className={`flex items-center overflow-visible ${className}`}
      style={{ height: Math.max(height, markHeight) }}
    >
      <div
        className="relative shrink-0 overflow-visible"
        style={{ width: markWidth, height: markHeight }}
      >
        <img
          src="/econstruct_red_square.png"
          alt="econstruct"
          className="absolute inset-0 h-full w-full object-contain"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          style={{
            filter:
              "drop-shadow(0 16px 18px rgba(88,16,16,0.18)) drop-shadow(0 4px 8px rgba(0,0,0,0.14))",
          }}
        />

        <div
          className="absolute z-20 overflow-visible"
          style={{
            top: "50%",
            left: "50%",
            width: "71%",
            height: "71%",
            transform: `translate(-50%, -50%) rotate(${eRotation}deg)`,
            transition: animateE
              ? "transform 3.6s cubic-bezier(0.16, 0.9, 0.24, 1)"
              : undefined,
            transformOrigin: "center center",
            willChange: animateE ? "transform" : undefined,
            backfaceVisibility: "hidden",
          }}
        >
          {showGlow ? (
            <>
              <div
                className="pointer-events-none absolute inset-0 z-0 logo-subtle-glow"
                style={{
                  background:
                    "radial-gradient(circle at 50% 46%, rgba(255,246,210,0.34) 0%, rgba(255,242,196,0.18) 18%, rgba(212,175,55,0.16) 36%, transparent 62%)",
                  mixBlendMode: tone === "dark" ? "screen" : "soft-light",
                }}
              />
              <div
                className="pointer-events-none absolute inset-[-8%] z-0 logo-subtle-glow"
                style={{
                  background:
                    "radial-gradient(circle at 50% 52%, rgba(255,227,140,0.18) 0%, rgba(184,150,62,0.1) 30%, transparent 58%)",
                  filter: "blur(4px)",
                }}
              />
            </>
          ) : null}

          <img
            src="/econstruct_e_white.png"
            alt=""
            className="relative z-10 h-full w-full object-contain"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            style={{
              filter: "drop-shadow(0 1px 1px rgba(95,13,13,0.08))",
            }}
          />
        </div>
      </div>

      <img
        src="/construct.png"
        alt=""
        className="shrink-0 object-contain"
        style={{
          height: wordmarkHeight,
          marginLeft: wordmarkGap,
          filter: wordmarkFilter,
        }}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
