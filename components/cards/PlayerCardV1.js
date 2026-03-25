import { motion } from "framer-motion";

const statStyles = {
  "Strike Rate": {
    base: "border-amber-300/20 bg-amber-400/10",
    active: "border-amber-300/70 bg-amber-300/16"
  },
  "Boundary Rate": {
    base: "border-rose-300/20 bg-rose-400/10",
    active: "border-rose-300/70 bg-rose-300/16"
  },
  Average: {
    base: "border-sky-300/20 bg-sky-400/10",
    active: "border-sky-300/70 bg-sky-300/16"
  },
  "Impact Score": {
    base: "border-violet-300/20 bg-violet-400/10",
    active: "border-violet-300/70 bg-violet-300/16"
  },
  "Economy": {
    base: "border-emerald-300/20 bg-emerald-400/10",
    active: "border-emerald-300/70 bg-emerald-300/16"
  },
  "Dot Ball %": {
    base: "border-cyan-300/20 bg-cyan-400/10",
    active: "border-cyan-300/70 bg-cyan-300/16"
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

export default function PlayerCardV1({
  name,
  stats,
  hidden = false,
  highlighted = false,
  selectedStat = null
}) {
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
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className={[
        "relative w-full max-w-sm overflow-hidden rounded-3xl border bg-slate-950/90 p-5 text-white",
        highlighted
          ? "border-emerald-400/40 shadow-[0_0_28px_rgba(52,211,153,0.22)]"
          : "border-cyan-400/20 shadow-[0_0_28px_rgba(34,211,238,0.12)]"
      ].join(" ")}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_32%)]" />

      <div className="relative z-10">
        {hidden ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-300/70">Hidden</p>
            <div className="mt-4 h-28 w-20 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900" />
            <p className="mt-5 px-6 text-sm text-slate-400">
              CPU card will be revealed after your pick
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
                  IPL Trump Card
                </p>
                <h3 className="mt-2 max-w-[13rem] text-2xl font-semibold leading-tight tracking-tight">
                  {name}
                </h3>
              </div>

              <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                Player
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.label}
                  className={[
                    "flex min-h-[84px] items-center justify-between gap-4 rounded-2xl border px-4 py-4",
                    statStyles[item.label][selectedStat === item.key ? "active" : "base"]
                  ].join(" ")}
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-white">
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
