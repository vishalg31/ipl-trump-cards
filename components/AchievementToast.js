import { AnimatePresence, motion } from "framer-motion";

export default function AchievementToast({ achievement }) {
  return (
    <AnimatePresence>
      {achievement ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-40 w-[min(92vw,26rem)] -translate-x-1/2 rounded-[24px] border border-amber-100/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(15,23,42,0.9))] px-5 py-4 text-white shadow-[0_22px_50px_rgba(15,23,42,0.38)]"
        >
          <p className="text-[11px] uppercase tracking-[0.34em] text-amber-100/75">Achievement</p>
          <p className="mt-2 text-lg font-bold text-white">{achievement.title}</p>
          <p className="mt-1 text-sm text-slate-200/80">{achievement.description}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
