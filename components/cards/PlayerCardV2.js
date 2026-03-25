import { motion, animate } from "framer-motion";
import { useState, useEffect } from "react";
import CelebrationBurst from "@/components/CelebrationBurst";

const statStyles = {
  "Strike Rate": {
    base: "border-amber-300/20 bg-amber-400/10",
    active: "border-amber-300/70 bg-amber-300/16 shadow-[0_0_0_1px_rgba(252,211,77,0.2)]"
  },
  "Boundary Rate": {
    base: "border-rose-300/20 bg-rose-400/10",
    active: "border-rose-300/70 bg-rose-300/16 shadow-[0_0_0_1px_rgba(253,164,175,0.2)]"
  },
  Average: {
    base: "border-sky-300/20 bg-sky-400/10",
    active: "border-sky-300/70 bg-sky-300/16 shadow-[0_0_0_1px_rgba(125,211,252,0.2)]"
  },
  "Impact Score": {
    base: "border-violet-300/20 bg-violet-400/10",
    active: "border-violet-300/70 bg-violet-300/16 shadow-[0_0_0_1px_rgba(196,181,253,0.2)]"
  },
  "Economy": {
    base: "border-emerald-300/20 bg-emerald-400/10",
    active: "border-emerald-300/70 bg-emerald-300/16 shadow-[0_0_0_1px_rgba(110,231,183,0.2)]"
  },
  "Dot Ball %": {
    base: "border-cyan-300/20 bg-cyan-400/10",
    active: "border-cyan-300/70 bg-cyan-300/16 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
  }
};

const cardThemes = {
  user: {
    shell: "border-cyan-300/30 shadow-[0_20px_50px_rgba(34,211,238,0.14)]",
    shellHighlighted: "border-cyan-200/70 shadow-[0_24px_55px_rgba(34,211,238,0.26)]",
    background:
      "bg-[linear-gradient(155deg,rgba(34,211,238,0.16),rgba(15,23,42,0.14)_24%,rgba(59,130,246,0.12)_58%,rgba(8,47,73,0.94)_100%)]",
    innerBorder: "border-cyan-100/10",
    topLine:
      "bg-[linear-gradient(90deg,rgba(34,211,238,0.02),rgba(125,211,252,0.45),rgba(34,211,238,0.02))]",
    eyebrow: "text-cyan-100/72",
    hiddenWrap:
      "border-cyan-200/12 bg-[linear-gradient(160deg,rgba(8,47,73,0.96),rgba(15,23,42,0.98))]",
    hiddenChip: "border-cyan-200/30 bg-cyan-200/10 text-cyan-50/85",
    hiddenFrame:
      "border-cyan-100/10 bg-[linear-gradient(145deg,rgba(34,211,238,0.22),rgba(96,165,250,0.08),rgba(15,23,42,0.94))]",
    hiddenCore: "border-cyan-100/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(34,211,238,0.08))]"
  },
  cpu: {
    shell: "border-rose-400/24 shadow-[0_20px_50px_rgba(244,63,94,0.16)]",
    shellHighlighted: "border-rose-300/70 shadow-[0_24px_55px_rgba(244,63,94,0.28)]",
    background:
      "bg-[linear-gradient(155deg,rgba(244,63,94,0.18),rgba(15,23,42,0.16)_26%,rgba(249,115,22,0.12)_58%,rgba(69,10,10,0.94)_100%)]",
    innerBorder: "border-rose-100/10",
    topLine:
      "bg-[linear-gradient(90deg,rgba(244,63,94,0.02),rgba(251,146,60,0.46),rgba(244,63,94,0.02))]",
    eyebrow: "text-rose-100/74",
    hiddenWrap:
      "border-rose-200/12 bg-[linear-gradient(160deg,rgba(69,10,10,0.96),rgba(15,23,42,0.98))]",
    hiddenChip: "border-rose-200/30 bg-rose-200/10 text-rose-50/85",
    hiddenFrame:
      "border-rose-100/10 bg-[linear-gradient(145deg,rgba(244,63,94,0.24),rgba(249,115,22,0.08),rgba(15,23,42,0.94))]",
    hiddenCore: "border-rose-100/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(244,63,94,0.08))]"
  }
};

function formatRawStat(label, value) {
  if (typeof value !== "number") {
    return "--";
  }

  if (label === "Boundary Rate" || label === "Dot Ball %") {
    return `${Math.round(label === "Boundary Rate" ? value * 100 : value)}%`;
  }

  if (label === "Economy") {
    return value.toFixed(2);
  }

  return value.toFixed(1);
}

function AnimatedStatValue({ value, label, isImpact, shouldAnimate, blindStats }) {
  const [displayValue, setDisplayValue] = useState(shouldAnimate ? 0 : value);

  useEffect(() => {
    if (shouldAnimate && typeof value === "number") {
      const controls = animate(0, value, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (v) => setDisplayValue(v)
      });
      return () => controls.stop();
    } else {
      setDisplayValue(value);
    }
  }, [value, shouldAnimate]);

  if (blindStats) {
    return <span className="tracking-widest opacity-60">???</span>;
  }

  if (isImpact) {
    return <>{typeof displayValue === "number" ? Math.round(displayValue) : "--"}</>;
  }
  return <>{formatRawStat(label, displayValue)}</>;
}

export default function PlayerCardV2({
  name,
  stats,
  variant = "user",
  hidden = false,
  highlighted = false,
  selectedStat = null,
  onStatSelect = null,
  isSelectable = false,
  disabled = false,
  outcome = null,
  burstKey = 0,
  isBlindMode = false
}) {
  const theme = cardThemes[variant] || cardThemes.user;
  const isBowler = stats?.hasOwnProperty("economy_raw");

  const items = isBowler
    ? [
        { key: "economy_raw", label: "Economy", value: stats?.economy_raw },
        { key: "strike_rate_raw", label: "Strike Rate", value: stats?.strike_rate_raw },
        { key: "dot_ball_percentage_raw", label: "Dot Ball %", value: stats?.dot_ball_percentage_raw },
        { key: "impact_score", label: "Impact Score", value: stats?.impact_score, isImpact: true }
      ]
    : [
        { key: "strike_rate_raw", label: "Strike Rate", value: stats?.strike_rate_raw },
        { key: "boundary_rate_raw", label: "Boundary Rate", value: stats?.boundary_rate_raw },
        { key: "consistency_raw", label: "Average", value: stats?.consistency_raw },
        { key: "impact_score", label: "Impact Score", value: stats?.impact_score, isImpact: true }
      ];

  return (
    <motion.article
      layout
      whileHover={{}}
      transition={{ type: "spring", stiffness: 230, damping: 22 }}
      className={[
        "relative w-full max-w-sm overflow-hidden border p-3 text-white sm:p-5",
        highlighted ? theme.shellHighlighted : theme.shell,
        outcome === "win" ? "card-win-pulse" : "",
        outcome === "loss" ? "card-loss-shake card-loss-dim" : "",
        outcome === "draw" ? "card-draw-flash" : "",
        hidden && variant === "cpu" ? "h-[160px] rounded-[20px] sm:h-[540px] sm:rounded-[30px]" : "h-auto rounded-[20px] sm:h-[540px] sm:rounded-[30px]"
      ].join(" ")}
      style={{ transformStyle: "preserve-3d" }}
    >
      {outcome === "win" ? <CelebrationBurst burstKey={burstKey} tone="green" /> : null}
      <div className={["pointer-events-none absolute inset-0", theme.background].join(" ")} />
      <div className={["pointer-events-none absolute inset-[1px] rounded-[28px] border", theme.innerBorder].join(" ")} />
      <div className={["pointer-events-none absolute inset-x-5 top-5 h-px", theme.topLine].join(" ")} />

      <motion.div
        key={hidden ? "hidden" : "revealed"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 h-full"
      >
        {hidden ? (
          <div className={["flex h-full flex-col items-center justify-center gap-2 rounded-[16px] border px-4 py-4 text-center sm:gap-0 sm:rounded-[24px] sm:p-0", theme.hiddenWrap].join(" ")}>
            <div className="flex flex-col items-center text-center">
              <div className={["rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em] sm:text-[11px]", theme.hiddenChip].join(" ")}>
                Premium Pack
              </div>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-200/90 sm:mt-5 sm:text-xs sm:font-normal sm:tracking-[0.3em] sm:text-slate-200/70">Hidden Card</p>
            </div>
            <div className={["mt-2 flex h-14 w-10 items-center justify-center rounded-[12px] border sm:mt-5 sm:h-32 sm:w-24 sm:rounded-[22px]", theme.hiddenFrame].join(" ")}>
              <div className={["h-8 w-6 rounded-[6px] border sm:h-20 sm:w-14 sm:rounded-[14px]", theme.hiddenCore].join(" ")} />
            </div>
            <p className="hidden px-6 text-sm text-slate-300/70 sm:mt-3 sm:block">
              Reveals after your selection
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 sm:mb-6">
              <div>
              <h3 className="max-w-[13rem] text-xl font-black uppercase leading-[1.1] tracking-tight text-white sm:text-[clamp(1.7rem,4vw,2.4rem)] sm:leading-[0.95]">
                  {name}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              {items.map((item) => {
                const isSelected = selectedStat === item.key;
                const isOther = selectedStat && !isSelected;
                const hideOnMobile = variant === "cpu" && isOther ? "hidden sm:flex" : "flex";

                let outcomeStyle = statStyles[item.label][isSelected ? "active" : "base"];
                if (isSelected && outcome === "win") {
                  outcomeStyle = "border-emerald-400 bg-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.35)]";
                } else if (isSelected && outcome === "loss") {
                  outcomeStyle = "border-rose-400 bg-rose-400/20 shadow-[0_0_20px_rgba(244,63,94,0.35)]";
                } else if (isSelected && outcome === "draw") {
                  outcomeStyle = "border-slate-400 bg-slate-400/20 shadow-[0_0_20px_rgba(148,163,184,0.35)]";
                }

                let winnerAnimation = {};
                if (isSelected) {
                  if (outcome === "win") {
                    winnerAnimation = { scale: [1, 1.05, 1], transition: { duration: 0.4 } };
                  } else if (outcome === "loss") {
                    winnerAnimation = { x: [0, -6, 6, -5, 5, 0], transition: { duration: 0.4 } };
                  }
                }

                return (
                  <motion.button
                    key={item.label}
                    type="button"
                    animate={winnerAnimation}
                    whileTap={isSelectable && !disabled ? { scale: 0.95 } : {}}
                    onClick={() => onStatSelect?.(item.key)}
                    disabled={!isSelectable || disabled}
                    className={[
                      hideOnMobile,
                      "w-full flex-row items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left transition-all duration-300 min-h-[56px] sm:min-h-[88px] sm:gap-4 sm:rounded-[22px] sm:px-4 sm:py-4",
                      outcomeStyle,
                      isOther ? `grayscale scale-[0.98] ${isBlindMode ? "opacity-20 blur-[6px]" : "opacity-30 blur-[2px]"}` : "opacity-100",
                      isSelectable && !disabled
                        ? "cursor-pointer hover:border-white/35"
                        : "cursor-default"
                    ].join(" ")}
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-300/72 sm:text-[13px] sm:tracking-[0.18em]">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-white sm:text-2xl">
                      <AnimatedStatValue
                        value={item.value}
                        label={item.label}
                        isImpact={item.isImpact}
                        shouldAnimate={variant === "cpu" && !hidden && isSelected}
                        blindStats={isBlindMode && !isSelected}
                      />
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </motion.article>
  );
}
