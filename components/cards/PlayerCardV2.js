import { motion } from "framer-motion";
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

  if (label === "Boundary Rate") {
    return `${Math.round(value * 100)}%`;
  }

  return value.toFixed(1);
}

export default function PlayerCardV2({
  name,
  stats,
  variant = "user",
  hidden = false,
  highlighted = false,
  selectedStat = null,
  outcome = null,
  burstKey = 0
}) {
  const theme = cardThemes[variant] || cardThemes.user;
  const items = [
    { key: "strike_rate", label: "Strike Rate", value: stats?.strike_rate_raw },
    { key: "boundary_rate", label: "Boundary Rate", value: stats?.boundary_rate_raw },
    { key: "consistency", label: "Average", value: stats?.consistency_raw },
    { key: "impact_score", label: "Impact Score", value: stats?.impact_score, isImpact: true }
  ];

  return (
    <motion.article
      whileHover={{ y: -6, rotateZ: -0.35, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 230, damping: 22 }}
      className={[
        "relative w-full max-w-sm overflow-hidden rounded-[30px] border p-5 text-white",
        highlighted ? theme.shellHighlighted : theme.shell,
        outcome === "win" ? "card-win-pulse" : "",
        outcome === "loss" ? "card-loss-shake card-loss-dim" : "",
        outcome === "draw" ? "card-draw-flash" : ""
      ].join(" ")}
      style={{ transformStyle: "preserve-3d" }}
    >
      {outcome === "win" ? <CelebrationBurst burstKey={burstKey} tone="green" /> : null}
      <div className={["pointer-events-none absolute inset-0", theme.background].join(" ")} />
      <div className={["pointer-events-none absolute inset-[1px] rounded-[28px] border", theme.innerBorder].join(" ")} />
      <div className={["pointer-events-none absolute inset-x-5 top-5 h-px", theme.topLine].join(" ")} />

      <div className="relative z-10">
        {hidden ? (
          <div className={["flex min-h-[350px] flex-col items-center justify-center rounded-[24px] border text-center", theme.hiddenWrap].join(" ")}>
            <div className={["rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.35em]", theme.hiddenChip].join(" ")}>
              Premium Pack
            </div>
            <div className={["mt-5 flex h-32 w-24 items-center justify-center rounded-[22px] border", theme.hiddenFrame].join(" ")}>
              <div className={["h-20 w-14 rounded-[14px] border", theme.hiddenCore].join(" ")} />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-slate-200/70">Hidden Card</p>
            <p className="mt-3 px-6 text-sm text-slate-300/70">
              CPU card will be revealed after your pick
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div>
                <p className={["text-[11px] uppercase tracking-[0.34em]", theme.eyebrow].join(" ")}>
                  IPL Trump Card
                </p>
                <h3 className="mt-4 max-w-[13rem] text-[clamp(1.7rem,4vw,2.4rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
                  {name}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.label}
                  className={[
                    "flex min-h-[88px] items-center justify-between gap-4 rounded-[22px] border px-4 py-4",
                    statStyles[item.label][selectedStat === item.key ? "active" : "base"]
                  ].join(" ")}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300/72">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {item.isImpact
                      ? typeof item.value === "number"
                        ? Math.round(item.value)
                        : "--"
                      : formatRawStat(item.label, item.value)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}
