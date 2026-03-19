import { AnimatePresence, motion } from "framer-motion";

export default function StreakToast({ show }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.94 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-none fixed left-1/2 top-6 z-40 -translate-x-1/2 rounded-full border border-orange-300/30 bg-[linear-gradient(135deg,rgba(251,146,60,0.9),rgba(234,88,12,0.86))] px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_44px_rgba(249,115,22,0.32)]"
        >
          On Fire!
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
