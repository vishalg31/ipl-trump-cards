import { AnimatePresence, motion } from "framer-motion";

export default function RoundResult({ roundWinner, dramatic = false }) {
  const messageMap = {
    user: "You Win This Round",
    cpu: "CPU Wins This Round",
    draw: "Draw"
  };

  const toneMap = {
    user: "border-emerald-400/40 bg-[linear-gradient(135deg,rgba(16,185,129,0.95),rgba(5,150,105,0.9))] text-white shadow-[0_20px_50px_rgba(16,185,129,0.35)]",
    cpu: "border-rose-400/40 bg-[linear-gradient(135deg,rgba(225,29,72,0.95),rgba(190,18,60,0.9))] text-white shadow-[0_20px_50px_rgba(225,29,72,0.35)]",
    draw: "border-amber-400/40 bg-[linear-gradient(135deg,rgba(245,158,11,0.95),rgba(217,119,6,0.9))] text-white shadow-[0_20px_50px_rgba(245,158,11,0.35)]"
  };

  return (
    <AnimatePresence>
      {roundWinner ? (
        <motion.div
          key={roundWinner}
          initial={{ opacity: 0, x: "-50%", y: "-30%", scale: dramatic ? 0.8 : 0.9 }}
          animate={{
            opacity: 1,
            x: "-50%",
            y: "-50%",
            scale: dramatic ? [0.94, 1.08, 1] : 1
          }}
          exit={{ opacity: 0, x: "-50%", y: "-70%", scale: 0.9 }}
          transition={{ duration: dramatic ? 0.42 : 0.22, ease: "easeOut" }}
          className={[
            "pointer-events-none fixed left-1/2 top-1/2 z-[100] w-[min(90vw,320px)] rounded-[24px] border px-6 py-5 text-center text-base font-black uppercase tracking-[0.2em] backdrop-blur-md sm:text-lg",
            dramatic ? "shadow-[0_0_30px_rgba(250,204,21,0.18)]" : "",
            toneMap[roundWinner]
          ].join(" ")}
        >
          {messageMap[roundWinner]}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
