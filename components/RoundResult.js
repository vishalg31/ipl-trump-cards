import { AnimatePresence, motion } from "framer-motion";

export default function RoundResult({ roundWinner, dramatic = false }) {
  const messageMap = {
    user: "You Win This Round",
    cpu: "CPU Wins This Round",
    draw: "Draw"
  };

  const toneMap = {
    user: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    cpu: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    draw: "border-amber-400/30 bg-amber-400/10 text-amber-200"
  };

  return (
    <AnimatePresence mode="wait">
      {roundWinner ? (
        <motion.div
          key={roundWinner}
          initial={{ opacity: 0, y: dramatic ? 18 : 10, scale: dramatic ? 0.9 : 0.96 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: dramatic ? [0.94, 1.08, 1] : 1
          }}
          exit={{ opacity: 0, y: -10, scale: dramatic ? 0.92 : 0.96 }}
          transition={{ duration: dramatic ? 0.42 : 0.22, ease: "easeOut" }}
          className={[
            "min-h-[52px] rounded-2xl border px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em]",
            dramatic ? "shadow-[0_0_30px_rgba(250,204,21,0.18)]" : "",
            toneMap[roundWinner]
          ].join(" ")}
        >
          {messageMap[roundWinner]}
        </motion.div>
      ) : (
        <div className="min-h-[52px]" />
      )}
    </AnimatePresence>
  );
}
