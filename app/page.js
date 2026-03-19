"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AchievementToast from "@/components/AchievementToast";
import GameBoard from "@/components/GameBoard";
import PostcardModal from "@/components/PostcardModal";
import { realPlayersDeck } from "@/lib/playerDeck";
import { useTrumpCardsGame } from "@/lib/useTrumpCardsGame";

const statLabelMap = {
  strike_rate: "Strike Rate",
  boundary_rate: "Boundary Rate",
  consistency: "Average",
  impact_score: "Impact Score"
};

export default function HomePage() {
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [countdownValue, setCountdownValue] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const {
    userScore,
    cpuScore,
    selectedStat,
    roundWinner,
    cpuRevealed,
    isResolving,
    gameOver,
    winnerMessage,
    dramaticRoundActive,
    userCard,
    cpuCard,
    playRound,
    restartGame
  } = useTrumpCardsGame(realPlayersDeck);
  const [userWinStreak, setUserWinStreak] = useState(0);
  const [effectKey, setEffectKey] = useState(0);
  const [showStreakToast, setShowStreakToast] = useState(false);
  const [showChampionOverlay, setShowChampionOverlay] = useState(false);
  const [pendingRoundMeta, setPendingRoundMeta] = useState(null);
  const [achievementToast, setAchievementToast] = useState(null);
  const [showPostcard, setShowPostcard] = useState(false);
  const [achievements, setAchievements] = useState({
    bestWinStreak: 0,
    biggestStatWin: {
      margin: 0,
      statLabel: ""
    },
    comebackWins: 0
  });

  useEffect(() => {
    if (!roundWinner) {
      return;
    }

    setEffectKey((previous) => previous + 1);

    if (roundWinner === "user") {
      setUserWinStreak((previous) => {
        const nextValue = previous + 1;

        if (nextValue >= 3) {
          setShowStreakToast(true);
        }

        return nextValue;
      });
    }

    if (roundWinner === "cpu" || roundWinner === "draw") {
      setUserWinStreak(0);
      setShowStreakToast(false);
    }

    if (roundWinner === "user" && pendingRoundMeta) {
      const achievementMessages = [];

      setAchievements((previous) => {
        const nextAchievements = {
          ...previous,
          bestWinStreak: Math.max(previous.bestWinStreak, userWinStreak + 1),
          biggestStatWin: { ...previous.biggestStatWin },
          comebackWins: previous.comebackWins
        };

        const margin = pendingRoundMeta.userValue - pendingRoundMeta.cpuValue;
        const formattedMargin = Number(margin.toFixed(2));

        if (margin > previous.biggestStatWin.margin) {
          nextAchievements.biggestStatWin = {
            margin,
            statLabel: statLabelMap[pendingRoundMeta.statKey]
          };
          achievementMessages.push({
            title: "Biggest Stat Win",
            description: `New best margin: +${formattedMargin} on ${statLabelMap[pendingRoundMeta.statKey]}.`
          });
        }

        if (pendingRoundMeta.userScoreBefore < pendingRoundMeta.cpuScoreBefore) {
          nextAchievements.comebackWins += 1;
          achievementMessages.unshift({
            title: "Comeback Win",
            description: "You won the round while trailing on the scoreboard."
          });
        }

        if (userWinStreak + 1 >= 3) {
          achievementMessages.unshift({
            title: "Win Streak",
            description: `${userWinStreak + 1} straight round wins. You're on fire.`
          });
        }

        return nextAchievements;
      });

      if (achievementMessages.length > 0) {
        setAchievementToast(achievementMessages[0]);
      }
    }

    setPendingRoundMeta(null);
  }, [roundWinner]);

  useEffect(() => {
    if (gameOver) {
      setUserWinStreak(0);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!showStreakToast) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setShowStreakToast(false);
    }, 1600);

    return () => window.clearTimeout(timerId);
  }, [showStreakToast]);

  useEffect(() => {
    setShowChampionOverlay(gameOver && winnerMessage === "You Win The Game");
  }, [gameOver, winnerMessage]);

  useEffect(() => {
    if (!achievementToast) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setAchievementToast(null);
    }, 2200);

    return () => window.clearTimeout(timerId);
  }, [achievementToast]);

  useEffect(() => {
    if (countdownValue === null) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      if (countdownValue <= 1) {
        setHasStarted(true);
        setCountdownValue(null);
        return;
      }

      setCountdownValue((previous) => previous - 1);
    }, 900);

    return () => window.clearTimeout(timerId);
  }, [countdownValue]);

  function resetMetaState() {
    setUserWinStreak(0);
    setEffectKey((previous) => previous + 1);
    setShowStreakToast(false);
    setShowChampionOverlay(false);
    setPendingRoundMeta(null);
    setAchievementToast(null);
    setShowPostcard(false);
    setAchievements({
      bestWinStreak: 0,
      biggestStatWin: {
        margin: 0,
        statLabel: ""
      },
      comebackWins: 0
    });
  }

  function handleRestart() {
    resetMetaState();
    restartGame();
  }

  function handleExitGame() {
    setPlayerNameInput(playerName);
    setPlayerName("");
    setHasStarted(false);
    setShowRulesModal(false);
    setCountdownValue(null);
    setShowExitConfirm(false);
    resetMetaState();
    restartGame();
  }

  function handlePlayRound(statKey) {
    if (!userCard || !cpuCard || isResolving || gameOver) {
      return;
    }

    setPendingRoundMeta({
      statKey,
      userValue: userCard[statKey],
      cpuValue: cpuCard[statKey],
      userScoreBefore: userScore,
      cpuScoreBefore: cpuScore
    });
    playRound(statKey);
  }

  function handleStartGame() {
    const cleanedName = playerNameInput.trim();

    if (!cleanedName) {
      return;
    }

    setPlayerName(cleanedName);
    setShowRulesModal(true);
  }

  function handleRulesAcknowledge() {
    setShowRulesModal(false);
    setCountdownValue(3);
  }

  const userCardOutcome =
    roundWinner === "user" ? "win" : roundWinner === "cpu" ? "loss" : roundWinner === "draw" ? "draw" : null;
  const cpuCardOutcome = roundWinner === "draw" ? "draw" : null;
  const finalChampion = showChampionOverlay;
  const userNearLoss = userScore === 9;
  const cpuNearLoss = cpuScore === 9;

  return (
    <main className="min-h-screen bg-stadium px-4 py-6 text-white sm:px-6 lg:px-10">
      <AchievementToast achievement={achievementToast} />
      <PostcardModal
        open={showPostcard}
        onClose={() => setShowPostcard(false)}
        playerName={playerName}
        winnerMessage={winnerMessage}
        userDeckCount={userScore}
        cpuDeckCount={cpuScore}
        achievements={achievements}
      />

      {showRulesModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/78 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 text-center shadow-[0_24px_70px_rgba(2,6,23,0.6)]">
            <p className="text-xs uppercase tracking-[0.34em] text-crease">How It Works</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">One Quick Rule Check</h2>
            <p className="mt-4 text-sm leading-7 text-mist sm:text-base">
              Each round, you and the CPU are dealt one random player. Choose a stat: Strike
              Rate, Boundary Rate, Average, or Impact. The higher stat wins the round. First to
              10 points wins the match.
            </p>
            <button
              type="button"
              onClick={handleRulesAcknowledge}
              className="mt-6 rounded-2xl bg-ember px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#ff7f50]"
            >
              Got It
            </button>
          </div>
        </div>
      ) : null}

      {countdownValue !== null ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/72 backdrop-blur-sm">
          <motion.div
            key={countdownValue}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-full border border-amber-200/25 bg-[linear-gradient(135deg,rgba(250,204,21,0.18),rgba(255,255,255,0.08))] px-12 py-9 text-center shadow-[0_0_40px_rgba(250,204,21,0.18)]"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-amber-100/75">Match Starts In</p>
            <p className="mt-2 text-6xl font-black text-white sm:text-7xl">{countdownValue}</p>
          </motion.div>
        </div>
      ) : null}

      {showExitConfirm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/78 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 text-center shadow-[0_24px_70px_rgba(2,6,23,0.6)]">
            <p className="text-xs uppercase tracking-[0.34em] text-rose-100/70">Exit Match</p>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">Leave This Game?</h2>
            <p className="mt-4 text-sm leading-7 text-mist">
              Your current match progress will be lost. You will return to the start screen.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExitGame}
                className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Exit Game
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-black/20 p-6 backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-crease">Real IPL Data. Real Matchups.</p>
              <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                IPL Trump Cards
              </h1>
              <p className="mt-3 text-base font-semibold text-white sm:text-lg">Can you beat the CPU? ↓</p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-mist sm:text-base">
                A fast, stat-driven cricket card game powered by real IPL batting data from the
                2024-2025 seasons.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-mist sm:text-base">
                Pick your stat, reveal the CPU card, and race to 10 round wins.
              </p>
              <p className="mt-4 text-sm font-semibold tracking-[0.12em] text-crease">Made by Vishal</p>
            </div>

            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.46))] p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-crease">How It Works</p>
              <p className="mt-4 text-sm leading-7 text-mist">
                Each round, you and the CPU are dealt one random player. Choose a stat: Strike
                Rate, Boundary Rate, Average, or Impact. The higher stat wins the round. First to
                10 points wins the match.
              </p>
            </div>
          </div>
        </section>

        {hasStarted ? (
          <GameBoard
            playerName={playerName}
            userPlayer={userCard}
            cpuPlayer={cpuCard}
            selectedStat={selectedStat}
            onStatSelect={handlePlayRound}
            roundWinner={roundWinner}
            isResolving={isResolving}
            dramaticRoundActive={dramaticRoundActive}
            cpuRevealed={cpuRevealed}
            gameOver={gameOver}
            winnerMessage={winnerMessage}
            onRestart={handleRestart}
            userDeckCount={userScore}
            cpuDeckCount={cpuScore}
            targetScore={10}
            userCardOutcome={userCardOutcome}
            cpuCardOutcome={cpuCardOutcome}
            effectKey={effectKey}
            finalChampion={finalChampion}
            userNearLoss={userNearLoss}
            cpuNearLoss={cpuNearLoss}
            showStreakToast={showStreakToast}
            onCloseCelebration={() => setShowChampionOverlay(false)}
            achievements={achievements}
            onOpenPostcard={() => setShowPostcard(true)}
            onExitRequest={() => setShowExitConfirm(true)}
          />
        ) : (
          <section className="mx-auto flex min-h-[440px] w-full max-w-3xl items-center justify-center rounded-[32px] border border-white/10 bg-black/20 p-6 backdrop-blur md:p-10">
            <div className="w-full max-w-xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-crease">Player Onboarding</p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-none text-white sm:text-5xl">
                Enter Your Name
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-mist sm:text-base">
                Start the match by naming your deck. Your name will appear during gameplay so the
                battle feels personalized from the first round.
              </p>

              <div className="mx-auto mt-8 flex max-w-md flex-col gap-4">
                <input
                  type="text"
                  value={playerNameInput}
                  onChange={(event) => setPlayerNameInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleStartGame();
                    }
                  }}
                  placeholder="Enter player name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-lg font-semibold text-white outline-none transition placeholder:text-white/35 focus:border-crease/60 focus:bg-white/10"
                  maxLength={24}
                />
                <button
                  type="button"
                  onClick={handleStartGame}
                  disabled={!playerNameInput.trim()}
                  className="rounded-2xl bg-ember px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#ff7f50] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                >
                  Start Game
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-4 rounded-[28px] border border-white/10 bg-black/20 p-6 backdrop-blur md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-crease">Gameplay loop</p>
            <p className="mt-3 text-sm leading-6 text-mist">
              Every round is a new matchup. No fixed decks, no repetition - just fast, dynamic
              gameplay driven by real player stats.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-crease">Final direction</p>
            <p className="mt-3 text-sm leading-6 text-mist">
              This is the final gameplay experience: one board, one loop, fully focused.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-crease">Next steps</p>
            <p className="mt-3 text-sm leading-6 text-mist">
              With the real IPL dataset now integrated, the focus moves to multi-player gameplay
            </p>
          </div>
        </section>

        <footer className="pb-2 text-center text-sm text-mist">
          Built with Next.js, Tailwind CSS, and Framer Motion.
        </footer>
      </div>
    </main>
  );
}
