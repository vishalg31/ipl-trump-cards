import { AnimatePresence, motion } from "framer-motion";
import CelebrationBurst from "@/components/CelebrationBurst";

const pieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${4 + index * 5.2}%`,
  delay: index * 0.04
}));

export default function ChampionOverlay({
  show,
  isWin = true,
  onClose,
  onRestart,
  onOpenPostcard
}) {
  const overlayBg = isWin
    ? "bg-[radial-gradient(circle,rgba(250,204,21,0.14),rgba(15,23,42,0.96)_55%,rgba(2,6,23,1)_100%)]"
    : "bg-[radial-gradient(circle,rgba(225,29,72,0.12),rgba(15,23,42,0.96)_55%,rgba(2,6,23,1)_100%)]";

  const cardBorder = isWin ? "border-amber-200/35" : "border-rose-400/35";
  const cardBg = isWin
    ? "bg-[linear-gradient(180deg,#2f1f07_0%,#111827_34%,#0f172a_100%)]"
    : "bg-[linear-gradient(180deg,#2e0916_0%,#111827_34%,#0f172a_100%)]";
  const cardShadow = isWin
    ? "shadow-[0_30px_90px_rgba(245,158,11,0.32)]"
    : "shadow-[0_30px_90px_rgba(225,29,72,0.25)]";

  const title = isWin ? "Champion" : "Defeated";
  const subtitle = isWin
    ? "You hit 10 points first and owned the battle."
    : "The AI outsmarted you. Better luck next time.";
  const titleColor = isWin ? "text-amber-50" : "text-rose-50";
  const eyebrow = isWin ? "Final Win" : "Match Lost";
  const eyebrowColor = isWin ? "text-amber-100/80" : "text-rose-200/80";

  const primaryButton = isWin
    ? "bg-[linear-gradient(135deg,#fcd34d,#f8fafc)] text-slate-950 hover:brightness-105"
    : "bg-[linear-gradient(135deg,#fda4af,#f8fafc)] text-slate-950 hover:brightness-105";

  const secondaryButton = isWin
    ? "border-amber-100/20 hover:bg-white/18"
    : "border-rose-100/20 hover:bg-white/18";

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${overlayBg} px-4`}
        >
          {isWin && (
            <div className="absolute inset-0 overflow-hidden">
              {pieces.map((piece) => (
                <motion.span
                  key={piece.id}
                  className="absolute top-[-10%] h-4 w-2 rounded-full bg-amber-200"
                  style={{ left: piece.left }}
                  initial={{ y: "-10%", rotate: 0, opacity: 0 }}
                  animate={{ y: "120vh", rotate: 320, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: piece.delay, ease: "linear" }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.84, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`relative w-full max-w-xl rounded-[32px] border ${cardBorder} ${cardBg} p-8 text-center ${cardShadow} sm:p-10`}
          >
            {isWin && <CelebrationBurst burstKey="champion-center" className="scale-[1.6]" />}
            <p className={`text-xs uppercase tracking-[0.45em] ${eyebrowColor}`}>{eyebrow}</p>
            <h2 className={`mt-4 text-5xl font-black uppercase tracking-[0.08em] ${titleColor} sm:text-6xl`}>
              {title}
            </h2>
            <p className="mt-4 text-base text-slate-100/85">
              {subtitle}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={onOpenPostcard}
                className={`pointer-events-auto rounded-2xl px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] transition ${primaryButton}`}
              >
                Share Postcard
              </button>
              <button
                type="button"
                onClick={onRestart}
                className={`pointer-events-auto rounded-2xl border bg-white/12 px-5 py-3 text-sm font-semibold text-white transition ${secondaryButton}`}
              >
                Restart Game
              </button>
              <button
                type="button"
                onClick={onClose}
                className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Exit
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
