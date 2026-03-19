import { motion } from "framer-motion";
import AchievementBadges from "@/components/AchievementBadges";
import CelebrationBurst from "@/components/CelebrationBurst";
import ChampionOverlay from "@/components/ChampionOverlay";
import StreakToast from "@/components/StreakToast";
import PlayerCardV2 from "@/components/cards/PlayerCardV2";
import RoundResult from "@/components/RoundResult";

const statLabels = [
  { key: "strike_rate", label: "Strike Rate" },
  { key: "boundary_rate", label: "Boundary Rate" },
  { key: "consistency", label: "Average" },
  { key: "impact_score", label: "Impact Score" }
];

export default function GameBoardV2({
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
  targetScore,
  userCardOutcome,
  cpuCardOutcome,
  effectKey,
  finalChampion,
  userNearLoss,
  cpuNearLoss,
  showStreakToast,
  onCloseCelebration,
  achievements,
  onOpenPostcard,
  onExitRequest
}) {
  const isFinalShowdown = userDeckCount === 9 && cpuDeckCount === 9;
  const isPlayerMatchPoint = !isFinalShowdown && userDeckCount === 9;
  const isCpuMatchPoint = !isFinalShowdown && cpuDeckCount === 9;

  return (
    <motion.section
      animate={{
        scale: dramaticRoundActive && isResolving ? 1.015 : 1,
        y: dramaticRoundActive && isResolving ? -4 : 0
      }}
      transition={{ duration: dramaticRoundActive ? 0.8 : 0.3, ease: "easeOut" }}
      className={[
        "relative overflow-hidden rounded-[32px] border bg-[linear-gradient(180deg,#18181b_0%,#0f172a_42%,#111827_100%)] px-4 py-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.5)] sm:px-6 lg:px-8",
        dramaticRoundActive
          ? "border-fuchsia-300/30 shadow-[0_0_60px_rgba(217,70,239,0.12),0_24px_60px_rgba(15,23,42,0.5)]"
          : "border-amber-200/15"
      ].join(" ")}
    >
      <ChampionOverlay
        show={finalChampion}
        onClose={onCloseCelebration}
        onRestart={onRestart}
        onOpenPostcard={onOpenPostcard}
      />
      <StreakToast show={showStreakToast} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(226,232,240,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(148,163,184,0.18),rgba(250,204,21,0.65),rgba(226,232,240,0.18))]" />
      {dramaticRoundActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.14),transparent_44%),radial-gradient(circle_at_top,rgba(251,191,36,0.1),transparent_36%)]"
        />
      ) : null}

      <div className="relative z-10">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-100/70">
              Trading Card Arena
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {playerName} vs CPU
            </h2>
            <p className="mt-3 text-sm text-slate-200/75">
              Win rounds to reach 10 points before the CPU.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div
              className={[
                "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100/85",
                userNearLoss
                  ? "animate-heartbeat border-emerald-300/40 text-emerald-100 shadow-[0_0_24px_rgba(34,197,94,0.22)]"
                  : ""
              ].join(" ")}
            >
              {playerName}'s Score: {userDeckCount}
            </div>
            <div
              className={[
                "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100/85",
                cpuNearLoss ? "animate-heartbeat border-rose-300/35 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,0.24)]" : ""
              ].join(" ")}
            >
              CPU Score: {cpuDeckCount}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100/85">
              Target Score: {targetScore}
            </div>
            {!gameOver ? (
              <button
                type="button"
                onClick={onExitRequest}
                className="rounded-full border border-rose-200/18 bg-rose-500/10 px-4 py-2 text-slate-100/85 transition hover:border-rose-200/32 hover:bg-rose-500/18"
              >
                Exit Game
              </button>
            ) : null}
          </div>
        </div>

        <div className="mb-8">
          <AchievementBadges achievements={achievements} />
        </div>

        {isPlayerMatchPoint ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 rounded-[26px] border border-emerald-300/35 bg-[linear-gradient(135deg,rgba(74,222,128,0.16),rgba(255,255,255,0.05),rgba(15,23,42,0.4))] p-4 text-center shadow-[0_0_36px_rgba(34,197,94,0.12)] animate-match-point-pulse-green"
          >
            <p className="text-xs uppercase tracking-[0.36em] text-emerald-100/78">Momentum</p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl">
              Match Point
            </h3>
            <p className="mt-2 text-sm text-emerald-50/82">
              1 point to victory.
            </p>
          </motion.div>
        ) : null}

        {isCpuMatchPoint ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 rounded-[26px] border border-rose-300/35 bg-[linear-gradient(135deg,rgba(251,113,133,0.16),rgba(255,255,255,0.05),rgba(15,23,42,0.4))] p-4 text-center shadow-[0_0_36px_rgba(251,113,133,0.12)] animate-match-point-pulse"
          >
            <p className="text-xs uppercase tracking-[0.36em] text-rose-100/78">Warning</p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl">
              CPU Match Point
            </h3>
            <p className="mt-2 text-sm text-rose-50/82">
              Danger! One more loss ends the match.
            </p>
          </motion.div>
        ) : null}

        {isFinalShowdown ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 rounded-[28px] border border-fuchsia-300/35 bg-[linear-gradient(135deg,rgba(217,70,239,0.16),rgba(251,191,36,0.08),rgba(15,23,42,0.44))] p-5 text-center shadow-[0_0_42px_rgba(217,70,239,0.14)] animate-final-showdown"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-100/80">Deadlock</p>
            <h3 className="mt-2 text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
              Final Showdown
            </h3>
            <p className="mt-3 text-sm text-fuchsia-50/84 sm:text-base">
              It all comes down to this round.
            </p>
          </motion.div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
          <motion.div
            key={`user-v2-${userPlayer?.name || "empty"}-${userDeckCount}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 text-center text-xs uppercase tracking-[0.28em] text-slate-300/70 xl:text-left">
              Current Round Card
            </p>
            {userPlayer ? (
              <PlayerCardV2
                name={userPlayer.name}
                stats={userPlayer}
                variant="user"
                hidden={false}
                highlighted={roundWinner === "user"}
                selectedStat={selectedStat}
                outcome={userCardOutcome}
                burstKey={`user-${effectKey}`}
              />
            ) : (
              <div className="flex min-h-[360px] w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-300/70">
                No cards left
              </div>
            )}
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full border border-amber-100/15 bg-[linear-gradient(135deg,rgba(250,204,21,0.12),rgba(255,255,255,0.06))] px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-50">
              VS
            </div>

            {roundWinner === "draw" ? (
              <motion.div
                key={`draw-${effectKey}`}
                initial={{ opacity: 0.2, scale: 0.94 }}
                animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.94, 1.03, 1] }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="pointer-events-none absolute h-20 w-20 rounded-full bg-white/10 blur-xl"
              />
            ) : null}

            <RoundResult roundWinner={roundWinner} dramatic={dramaticRoundActive && Boolean(roundWinner)} />

            <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.42))] p-4 backdrop-blur-sm">
              <p className="text-center text-xs uppercase tracking-[0.24em] text-amber-100/75">
                Choose Your Category
              </p>

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
                          ? "border-amber-200/50 bg-[linear-gradient(135deg,rgba(250,204,21,0.18),rgba(255,255,255,0.06))] text-amber-50"
                          : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-amber-100/30 hover:bg-slate-800",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      ].join(" ")}
                    >
                      {stat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {gameOver && !finalChampion ? (
              <div className="w-full max-w-xs rounded-3xl border border-amber-200/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.72))] p-5 text-center shadow-[0_20px_45px_rgba(15,23,42,0.4)]">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">
                  Match Complete
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{winnerMessage}</h3>
                <button
                  type="button"
                  onClick={onRestart}
                  className="mt-5 rounded-2xl bg-[linear-gradient(135deg,#fcd34d,#f8fafc)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105"
                >
                  Restart Game
                </button>
                <button
                  type="button"
                  onClick={onOpenPostcard}
                  className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Share Postcard
                </button>
              </div>
            ) : null}
          </div>

          <motion.div
            key={`cpu-v2-${cpuPlayer?.name || "empty"}-${cpuDeckCount}-${cpuRevealed ? "open" : "closed"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 text-center text-xs uppercase tracking-[0.28em] text-slate-300/70 xl:text-left">
              Current Round Card
            </p>
            <motion.div
              animate={{ rotateY: cpuRevealed ? 0 : 180 }}
              transition={{ duration: dramaticRoundActive ? 1.05 : 0.45, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {cpuPlayer ? (
                <PlayerCardV2
                  name={cpuPlayer.name}
                  stats={cpuPlayer}
                  variant="cpu"
                  hidden={!cpuRevealed}
                  highlighted={roundWinner === "cpu"}
                  selectedStat={selectedStat}
                  outcome={cpuCardOutcome}
                  burstKey={`cpu-${effectKey}`}
                />
              ) : (
                <div className="flex min-h-[360px] w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-300/70">
                  No cards left
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {roundWinner === "user" ? (
          <CelebrationBurst burstKey={`board-${effectKey}`} className="top-24 scale-125" />
        ) : null}
      </div>
    </motion.section>
  );
}
