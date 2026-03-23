import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AchievementBadges from "@/components/AchievementBadges";
import CelebrationBurst from "@/components/CelebrationBurst";
import ChampionOverlay from "@/components/ChampionOverlay";
import StreakToast from "@/components/StreakToast";
import PlayerCardV2 from "@/components/cards/PlayerCardV2";
import RoundResult from "@/components/RoundResult";

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
  const [showLossOverlay, setShowLossOverlay] = useState(false);

  useEffect(() => {
    if (gameOver && cpuDeckCount >= targetScore) {
      const timer = setTimeout(() => setShowLossOverlay(true), 1200);
      return () => clearTimeout(timer);
    }
    setShowLossOverlay(false);
  }, [gameOver, cpuDeckCount, targetScore]);

  const isFinalShowdown = userDeckCount === 9 && cpuDeckCount === 9;
  const isPlayerMatchPoint = !isFinalShowdown && userDeckCount === 9;
  const isCpuMatchPoint = !isFinalShowdown && cpuDeckCount === 9;
  const isUserWin = userDeckCount >= targetScore;
  const showOverlay = finalChampion || showLossOverlay;

  return (
    <motion.section
      animate={{
        y: dramaticRoundActive && isResolving ? -4 : 0
      }}
      transition={{ duration: dramaticRoundActive ? 0.8 : 0.3, ease: "easeOut" }}
      className={[
        "relative flex w-full md:w-auto flex-col justify-between overflow-hidden border bg-[linear-gradient(180deg,#18181b_0%,#0f172a_42%,#111827_100%)] px-3 py-4 text-white sm:rounded-[32px] sm:px-6 sm:py-6 lg:px-8",
        "min-h-[calc(100dvh-2rem)] rounded-[24px] sm:min-h-0 sm:shadow-[0_24px_60px_rgba(15,23,42,0.5)]",
        dramaticRoundActive
          ? "border-fuchsia-300/30 shadow-[0_0_60px_rgba(217,70,239,0.12),0_24px_60px_rgba(15,23,42,0.5)]"
          : "border-amber-200/15"
      ].join(" ")}
    >
      <ChampionOverlay
        show={showOverlay}
        isWin={isUserWin}
        onClose={isUserWin ? onCloseCelebration : () => setShowLossOverlay(false)}
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
        <div className="mb-4 flex flex-col items-center justify-between gap-3 text-center sm:mb-8 lg:flex-row lg:text-left">
          <div>
            <p className="hidden text-xs uppercase tracking-[0.35em] text-amber-100/70 sm:block">
              Trading Card Arena
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:mt-2 sm:text-4xl">
              {playerName} <span className="text-slate-500">vs</span> CPU
            </h2>
            <p className="hidden mt-3 text-sm text-slate-200/75 sm:block">
              Win rounds to reach 10 points before the CPU.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold tracking-wide text-slate-100/85 sm:px-4 sm:py-2">
              Race to {targetScore} Points
            </div>
            {!gameOver ? (
              <button
                type="button"
                onClick={onExitRequest}
                className="rounded-full border border-rose-200/18 bg-rose-500/10 px-3 py-1.5 text-rose-100/85 transition hover:border-rose-200/32 hover:bg-rose-500/18 sm:px-4 sm:py-2"
              >
                Exit Game
              </button>
            ) : null}
          </div>
        </div>

        {isPlayerMatchPoint ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-4 rounded-[20px] border border-emerald-300/35 bg-[linear-gradient(135deg,rgba(74,222,128,0.16),rgba(255,255,255,0.05),rgba(15,23,42,0.4))] p-3 text-center shadow-[0_0_36px_rgba(34,197,94,0.12)] animate-match-point-pulse-green sm:mb-8 sm:rounded-[26px] sm:p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-emerald-100/78 sm:text-xs">Momentum</p>
            <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-white sm:mt-2 sm:text-3xl">
              Match Point
            </h3>
            <p className="mt-1 text-xs text-emerald-50/82 sm:mt-2 sm:text-sm">
              1 point to victory.
            </p>
          </motion.div>
        ) : null}

        {isCpuMatchPoint ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-4 rounded-[20px] border border-rose-300/35 bg-[linear-gradient(135deg,rgba(251,113,133,0.16),rgba(255,255,255,0.05),rgba(15,23,42,0.4))] p-3 text-center shadow-[0_0_36px_rgba(251,113,133,0.12)] animate-match-point-pulse sm:mb-8 sm:rounded-[26px] sm:p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-rose-100/78 sm:text-xs">Warning</p>
            <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-white sm:mt-2 sm:text-3xl">
              CPU Match Point
            </h3>
            <p className="mt-1 text-xs text-rose-50/82 sm:mt-2 sm:text-sm">
              Danger! One more loss ends the match.
            </p>
          </motion.div>
        ) : null}

        {isFinalShowdown ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 rounded-[22px] border border-fuchsia-300/35 bg-[linear-gradient(135deg,rgba(217,70,239,0.16),rgba(251,191,36,0.08),rgba(15,23,42,0.44))] p-4 text-center shadow-[0_0_42px_rgba(217,70,239,0.14)] animate-final-showdown sm:mb-8 sm:rounded-[28px] sm:p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-fuchsia-100/80 sm:text-xs">Deadlock</p>
            <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-white sm:mt-2 sm:text-4xl">
              Final Showdown
            </h3>
            <p className="mt-2 text-xs text-fuchsia-50/84 sm:mt-3 sm:text-base">
              It all comes down to this round.
            </p>
          </motion.div>
        ) : null}

        <div className="relative flex flex-1 flex-col justify-center gap-3 sm:grid sm:gap-5 md:grid-cols-[1fr_120px_1fr] lg:grid-cols-[22rem_200px_22rem] md:items-center md:justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`user-v2-${userPlayer?.name || "empty"}`}
              initial={{ opacity: 0, y: -60, x: -30, rotate: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: 120, x: -40, rotate: -12, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="order-1 flex w-full justify-center md:order-none md:justify-start"
            >
            <div className="mx-auto flex w-full max-w-sm flex-col md:max-w-[22rem] lg:w-[22rem]">
              <div className="mb-3 sm:mb-5">
                <div className="mb-1.5 flex items-end justify-between sm:mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 sm:text-xs">{playerName}</span>
                  <span className="text-lg font-black leading-none text-white sm:text-xl">{userDeckCount}<span className="text-[10px] text-slate-500 sm:text-xs">/{targetScore}</span></span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-[linear-gradient(90deg,#0891b2,#22d3ee)] shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userDeckCount / targetScore) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
              <p className="mb-2 text-center text-[10px] uppercase tracking-[0.28em] text-slate-300/70 sm:mb-3 sm:text-xs md:text-left">
                Tap A Stat On Your Card
              </p>
              {userPlayer ? (
                <PlayerCardV2
                  name={userPlayer.name}
                  stats={userPlayer}
                  variant="user"
                  hidden={false}
                  highlighted={roundWinner === "user"}
                  selectedStat={selectedStat}
                  onStatSelect={onStatSelect}
                  isSelectable={!isResolving && !gameOver}
                  disabled={isResolving || gameOver}
                  outcome={userCardOutcome}
                  burstKey={`user-${effectKey}`}
                />
              ) : (
                <div className="mx-auto flex h-[280px] w-full max-w-sm items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-xs text-slate-300/70 sm:h-[540px] sm:rounded-3xl sm:text-sm">
                  No cards left
                </div>
              )}
            </div>
            </motion.div>
          </AnimatePresence>

          <div className="order-2 z-20 -my-2 flex flex-col items-center justify-center gap-2 sm:my-0 sm:gap-4 md:order-none">
            {!gameOver ? (
              <>
                <div className="flex rounded-full border border-amber-100/15 bg-[linear-gradient(135deg,rgba(250,204,21,0.2),rgba(255,255,255,0.05))] px-4 py-2 text-sm font-black uppercase tracking-[0.3em] text-amber-50 shadow-[0_10px_20px_rgba(0,0,0,0.5)] backdrop-blur-md lg:hidden">
                  VS
                </div>

                <div className="hidden w-full max-w-[200px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(15,23,42,0.55))] px-5 py-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.28)] lg:block">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-amber-100/70">Matchup</p>
                  <div className="mt-4 rounded-full border border-amber-100/15 bg-[linear-gradient(135deg,rgba(250,204,21,0.14),rgba(255,255,255,0.05))] px-5 py-3 text-lg font-black uppercase tracking-[0.35em] text-amber-50">
                    VS
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-300/70">
                    Tap A Stat
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300/72">
                    The CPU card reveals after your selection.
                  </p>
                </div>
              </>
            ) : null}

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

            {gameOver && !showOverlay ? (
              <div className="fixed left-1/2 top-1/2 z-[110] w-[min(90vw,320px)] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-amber-200/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.85))] p-5 text-center shadow-[0_30px_60px_rgba(15,23,42,0.8)] backdrop-blur-md sm:rounded-3xl sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-100/70 sm:text-xs">
                  Match Complete
                </p>
                <h3 className="mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl">{winnerMessage}</h3>
                <button
                  type="button"
                  onClick={onRestart}
                  className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#fcd34d,#f8fafc)] px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:brightness-105 sm:mt-6"
                >
                  Restart Game
                </button>
                <button
                  type="button"
                  onClick={onOpenPostcard}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:mt-3 sm:px-5 sm:py-3"
                >
                  Share Postcard
                </button>
              </div>
            ) : null}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={`cpu-v2-${cpuPlayer?.name || "empty"}`}
              initial={{ opacity: 0, y: -60, x: 30, rotate: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: 120, x: 40, rotate: 12, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="order-3 flex w-full justify-center md:order-none md:justify-end"
            >
            <div className="mx-auto flex w-full max-w-sm flex-col md:max-w-[22rem] lg:w-[22rem]">
              <div className="order-3 mt-3 sm:order-1 sm:mb-5 sm:mt-0">
                <div className="mb-1.5 flex items-end justify-between sm:mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 sm:text-xs">CPU</span>
                  <span className="text-lg font-black leading-none text-white sm:text-xl">{cpuDeckCount}<span className="text-[10px] text-slate-500 sm:text-xs">/{targetScore}</span></span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-[linear-gradient(90deg,#e11d48,#fb7185)] shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(cpuDeckCount / targetScore) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
              <p className="order-1 mb-2 text-center text-[10px] uppercase tracking-[0.28em] text-slate-300/70 sm:order-2 sm:mb-3 sm:text-xs md:text-left">
                CPU Card
              </p>
              <motion.div
                className="order-2 sm:order-3"
                animate={{ opacity: cpuRevealed ? 1 : 1 }}
                transition={{ duration: dramaticRoundActive ? 0.8 : 0.3, ease: "easeOut" }}
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
                  <div className="mx-auto flex h-[100px] w-full max-w-sm items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-xs text-slate-300/70 sm:h-[540px] sm:rounded-3xl sm:text-sm">
                    No cards left
                  </div>
                )}
              </motion.div>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 sm:mt-12 sm:pt-8">
          <p className="mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">Match Achievements</p>
          <AchievementBadges achievements={achievements} />
        </div>

        {roundWinner === "user" ? (
          <CelebrationBurst burstKey={`board-${effectKey}`} className="top-24 scale-125" />
        ) : null}
      </div>
    </motion.section>
  );
}
