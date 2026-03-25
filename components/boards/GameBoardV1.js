import { motion } from "framer-motion";
import PlayerCardV1 from "@/components/cards/PlayerCardV1";
import RoundResult from "@/components/RoundResult";

export default function GameBoardV1({
  playerName,
  userPlayer,
  cpuPlayer,
  selectedStat,
  onStatSelect,
  roundWinner,
  isResolving,
  dramaticRoundActive,
  cpuRevealed,
  gameOver,
  winnerMessage,
  onRestart,
  userDeckCount,
  cpuDeckCount,
  drawPileCount
}) {
  const isFinalShowdown = userDeckCount === 9 && cpuDeckCount === 9;
  const isPlayerMatchPoint = !isFinalShowdown && userDeckCount === 9;
  const isCpuMatchPoint = !isFinalShowdown && cpuDeckCount === 9;

  const isBowler = userPlayer?.hasOwnProperty("economy_raw");
  const statLabels = isBowler
    ? [
        { key: "economy_raw", label: "Economy" },
        { key: "strike_rate_raw", label: "Strike Rate" },
        { key: "dot_ball_percentage_raw", label: "Dot Ball %" },
        { key: "impact_score", label: "Impact Score" }
      ]
    : [
        { key: "strike_rate_raw", label: "Strike Rate" },
        { key: "boundary_rate_raw", label: "Boundary Rate" },
        { key: "consistency_raw", label: "Average" },
        { key: "impact_score", label: "Impact Score" }
      ];

  return (
    <motion.section
      animate={{
        scale: dramaticRoundActive && isResolving ? 1.012 : 1,
        y: dramaticRoundActive && isResolving ? -4 : 0
      }}
      transition={{ duration: dramaticRoundActive ? 0.8 : 0.3, ease: "easeOut" }}
      className={[
        "relative overflow-hidden rounded-[32px] border bg-slate-950 px-4 py-6 text-white shadow-[0_0_60px_rgba(34,211,238,0.08)] sm:px-6 lg:px-8",
        dramaticRoundActive ? "border-fuchsia-300/30" : "border-cyan-400/15"
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.10),transparent_30%)]" />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Battle Arena</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {playerName} vs CPU
            </h2>
            <p className="mt-3 text-sm text-slate-300/75">
              Win rounds to reach 10 points before the CPU.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium">
              {isBowler ? "🥎 Bowlers" : "🏏 Batters"}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {playerName}'s Score: {userDeckCount}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              CPU Score: {cpuDeckCount}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Target Score: {drawPileCount}
            </div>
          </div>
        </div>

        {isPlayerMatchPoint ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-6 mx-auto flex max-w-fit items-center justify-center gap-3 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-5 py-2.5 shadow-[0_0_20px_rgba(34,197,94,0.1)] animate-match-point-pulse-green"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Match Point</span>
            <span className="h-3 w-px bg-emerald-300/30"></span>
            <span className="text-xs font-medium text-emerald-100/90">1 point to victory</span>
          </motion.div>
        ) : null}

        {isCpuMatchPoint ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-6 mx-auto flex max-w-fit items-center justify-center gap-3 rounded-full border border-rose-300/35 bg-rose-400/10 px-5 py-2.5 shadow-[0_0_20px_rgba(251,113,133,0.1)] animate-match-point-pulse"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-300">CPU Match Point</span>
            <span className="h-3 w-px bg-rose-300/30"></span>
            <span className="text-xs font-medium text-rose-100/90">Danger</span>
          </motion.div>
        ) : null}

        {isFinalShowdown ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 mx-auto flex max-w-fit items-center justify-center gap-3 rounded-full border border-fuchsia-300/35 bg-fuchsia-400/10 px-5 py-2.5 shadow-[0_0_24px_rgba(217,70,239,0.12)] animate-final-showdown"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">Final Showdown</span>
            <span className="h-3 w-px bg-fuchsia-300/30"></span>
            <span className="text-xs font-medium text-fuchsia-100/90">Deadlock</span>
          </motion.div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
          <motion.div
            key={`user-v1-${userPlayer?.name || "empty"}-${userDeckCount}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 text-center text-xs uppercase tracking-[0.28em] text-slate-400 xl:text-left">
              Current Round Card
            </p>
            {userPlayer ? (
              <PlayerCardV1
                name={userPlayer.name}
                stats={userPlayer}
                hidden={false}
                highlighted={roundWinner === "user"}
                selectedStat={selectedStat}
              />
            ) : (
              <div className="flex min-h-[360px] w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-400">
                No cards left
              </div>
            )}
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
              VS
            </div>

            <RoundResult roundWinner={roundWinner} dramatic={dramaticRoundActive && Boolean(roundWinner)} />

            <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-center text-xs uppercase tracking-[0.24em] text-cyan-300/75">
                Select A Stat
              </p>
              {isBowler ? (
                <p className="mt-2 text-center text-[11px] font-medium text-emerald-300/90">
                  Tip: Lower Economy & Strike Rate wins!
                </p>
              ) : null}

              <div className="mt-4 grid gap-3">
                {statLabels.map((stat) => {
                  const isActive = selectedStat === stat.key;

                  return (
                    <button
                      key={stat.key}
                      type="button"
                      onClick={() => onStatSelect(stat.key)}
                      disabled={isResolving || gameOver}
                      className={[
                        "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
                        isActive
                          ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
                          : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-cyan-400/30 hover:bg-slate-800",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      ].join(" ")}
                    >
                      {stat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {gameOver ? (
              <div className="w-full max-w-xs rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-5 text-center shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                  Match Complete
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{winnerMessage}</h3>
                <button
                  type="button"
                  onClick={onRestart}
                  className="mt-5 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Restart Game
                </button>
              </div>
            ) : null}
          </div>

          <motion.div
            key={`cpu-v1-${cpuPlayer?.name || "empty"}-${cpuDeckCount}-${cpuRevealed ? "open" : "closed"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 text-center text-xs uppercase tracking-[0.28em] text-slate-400 xl:text-left">
              Current Round Card
            </p>
            <motion.div
              animate={{ rotateY: cpuRevealed ? 0 : 180 }}
              transition={{ duration: dramaticRoundActive ? 1.05 : 0.45, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {cpuPlayer ? (
                <PlayerCardV1
                  name={cpuPlayer.name}
                  stats={cpuPlayer}
                  hidden={!cpuRevealed}
                  highlighted={roundWinner === "cpu"}
                  selectedStat={selectedStat}
                />
              ) : (
                <div className="flex min-h-[360px] w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-400">
                  No cards left
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
