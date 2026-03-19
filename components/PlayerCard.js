import { motion } from "framer-motion";

export default function PlayerCard({
  name,
  stats,
  hidden = false,
  highlighted = false
}) {
  const items = [
    { label: "Strike Rate", value: stats?.strike_rate },
    { label: "Boundary Rate", value: stats?.boundary_rate },
    { label: "Consistency", value: stats?.consistency },
    { label: "Impact Score", value: stats?.impact_score }
  ];

  const impactScore = stats?.impact_score;

  return (
    <motion.article
      whileHover={{ y: -6, rotateZ: -0.35, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 230, damping: 22 }}
      className={[
        "relative w-full max-w-sm overflow-hidden rounded-[30px] border p-5 text-white",
        highlighted
          ? "border-amber-300/70 shadow-[0_20px_45px_rgba(245,158,11,0.22)]"
          : "border-white/15 shadow-[0_18px_40px_rgba(15,23,42,0.42)]"
      ].join(" ")}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(250,204,21,0.2),rgba(15,23,42,0.04)_28%,rgba(226,232,240,0.14)_60%,rgba(15,23,42,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[28px] border border-white/10" />
      <div className="pointer-events-none absolute left-4 right-4 top-4 h-20 rounded-[22px] bg-[linear-gradient(135deg,rgba(250,204,21,0.26),rgba(226,232,240,0.08),rgba(148,163,184,0.18))]" />

      <div className="relative z-10">
        {hidden ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(51,65,85,0.94),rgba(15,23,42,0.98))] text-center">
            <div className="rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-amber-100/85">
              Premium Pack
            </div>
            <div className="mt-5 flex h-32 w-24 items-center justify-center rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(250,204,21,0.22),rgba(226,232,240,0.06),rgba(15,23,42,0.94))]">
              <div className="h-20 w-14 rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(148,163,184,0.06))]" />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-slate-200/70">Hidden Card</p>
            <p className="mt-3 px-6 text-sm text-slate-300/70">
              CPU card will be revealed after your pick
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-amber-100/80">
                  IPL Trump Card
                </p>
                <h3 className="mt-3 max-w-[11rem] text-3xl font-black uppercase leading-none tracking-tight text-white">
                  {name}
                </h3>
              </div>

              <div className="rounded-full border border-slate-200/20 bg-slate-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/85">
                Edition V2
              </div>
            </div>

            <div className="mb-5 rounded-[26px] border border-white/12 bg-[linear-gradient(145deg,rgba(250,204,21,0.18),rgba(226,232,240,0.08),rgba(15,23,42,0.72))] p-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-200/70">Impact Score</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-6xl font-black leading-none text-amber-100">{impactScore}</p>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-300/65">Card Grade</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {impactScore >= 93 ? "Elite" : impactScore >= 88 ? "Prime" : "Pro"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {items
                .filter((item) => item.label !== "Impact Score")
                .map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(15,23,42,0.24))] px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300/70">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}
