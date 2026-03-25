import { AnimatePresence, motion } from "framer-motion";

export default function StreakToast({ show }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Intense screen edge glow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 shadow-[inset_0_0_120px_rgba(234,88,12,0.3)] sm:shadow-[inset_0_0_200px_rgba(234,88,12,0.3)]" 
          />
          
          {/* Screen background color flash */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.5, times: [0, 0.1, 1], ease: "easeOut" }}
            className="absolute inset-0 bg-orange-500 mix-blend-color-dodge"
          />

          <motion.div
            initial={{ scale: 0.5, y: 20, opacity: 0, rotate: -3 }}
            animate={{ scale: [0.5, 1.1, 1], y: 0, opacity: 1, rotate: [-3, 2, 0] }}
            exit={{ scale: 1.1, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <div className="absolute inset-0 scale-[2] animate-pulse rounded-full bg-orange-600/30 blur-[50px] sm:scale-[3] sm:blur-[80px]" />
            <h2 
              className="relative text-6xl font-black uppercase italic tracking-wider text-white sm:text-8xl"
              style={{ textShadow: "0 0 20px rgba(249, 115, 22, 0.9), 0 0 50px rgba(234, 88, 12, 0.7)" }}
            >
              On Fire!
            </h2>
            <p className="relative mt-2 text-sm font-bold uppercase tracking-[0.4em] text-orange-200 sm:text-base">
              Winning Streak
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
