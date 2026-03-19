import { motion } from "framer-motion";

const pieces = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  angle: (360 / 12) * index,
  distance: 44 + (index % 3) * 12
}));

export default function CelebrationBurst({ burstKey, tone = "gold", className = "" }) {
  const colors =
    tone === "green"
      ? ["#86efac", "#22c55e", "#dcfce7"]
      : ["#fde68a", "#f59e0b", "#f8fafc"];

  return (
    <div className={["pointer-events-none absolute inset-0 overflow-visible", className].join(" ")}>
      {pieces.map((piece, index) => {
        const x = Math.cos((piece.angle * Math.PI) / 180) * piece.distance;
        const y = Math.sin((piece.angle * Math.PI) / 180) * piece.distance;

        return (
          <motion.span
            key={`${burstKey}-${piece.id}`}
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: colors[index % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
            animate={{ x, y, opacity: [0, 1, 0], scale: [0.2, 1, 0.5] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
