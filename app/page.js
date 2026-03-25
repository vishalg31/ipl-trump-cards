"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AchievementToast from "@/components/AchievementToast";
import GameBoard from "@/components/GameBoard";
import PostcardModal from "@/components/PostcardModal";
import { realPlayersDeck, realBowlersDeck } from "@/lib/playerDeck";
import { useTrumpCardsGame } from "@/lib/useTrumpCardsGame";

const statLabelMap = {
  strike_rate_raw: "Strike Rate",
  boundary_rate_raw: "Boundary Rate",
  consistency_raw: "Average",
  impact_score: "Impact Score",
  economy_raw: "Economy",
  dot_ball_percentage_raw: "Dot Ball %"
};

export default function HomePage() {
  const [deckMode, setDeckMode] = useState("batters");
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [countdownValue, setCountdownValue] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const activeDeck = deckMode === "batters" ? realPlayersDeck : realBowlersDeck;
  const lowerIsBetterKeys = deckMode === "bowlers" ? ["economy_raw", "strike_rate_raw"] : [];

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
  } = useTrumpCardsGame(activeDeck, lowerIsBetterKeys);
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

        const margin = Math.abs(pendingRoundMeta.userValue - pendingRoundMeta.cpuValue);
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

  function handleTimeout() {
    if (!userCard || !cpuCard || isResolving || gameOver) {
      return;
    }

    // Smart Forfeit: Find a stat where the CPU is guaranteed to win
    const stats = deckMode === "batters" 
      ? ["strike_rate_raw", "boundary_rate_raw", "consistency_raw", "impact_score"]
      : ["economy_raw", "strike_rate_raw", "dot_ball_percentage_raw", "impact_score"];
    let autoPick = stats[0];
    
    for (const stat of stats) {
      const isLowerBetter = lowerIsBetterKeys.includes(stat);
      const cpuWins = isLowerBetter ? cpuCard[stat] < userCard[stat] : cpuCard[stat] > userCard[stat];
      if (cpuWins) {
        autoPick = stat;
        break;
      }
    }

    // Instantly trigger the round using the losing stat
    handlePlayRound(autoPick);
  }

  function handleStartGame() {
    const cleanedName = playerNameInput.trim();

    if (!cleanedName) {
      return;
    }

    setPlayerName(cleanedName);
    restartGame();
    setShowRulesModal(true);
  }

  function handleRulesAcknowledge() {
    setShowRulesModal(false);
    setCountdownValue(3);
  }

  const userCardOutcome =
    roundWinner === "user" ? "win" : roundWinner === "cpu" ? "loss" : roundWinner === "draw" ? "draw" : null;
  const cpuCardOutcome =
    roundWinner === "cpu" ? "win" : roundWinner === "user" ? "loss" : roundWinner === "draw" ? "draw" : null;
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
        deckMode={deckMode}
      />

      {showRulesModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/78 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 text-center shadow-[0_24px_70px_rgba(2,6,23,0.6)]">
            <p className="text-xs uppercase tracking-[0.34em] text-crease">How It Works</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">One Quick Rule Check</h2>
            <p className="mt-4 text-sm leading-7 text-mist sm:text-base">
              Each round, you and the CPU are dealt one random player.{" "}
              {deckMode === "batters" 
                ? "Choose a stat: Strike Rate, Boundary Rate, Average, or Impact. The higher stat wins the round."
                : "Choose a stat: Economy, Strike Rate, Dot Ball %, or Impact. For Economy and Strike Rate, lower is better!"}
              {isBlindMode ? <span className="font-bold text-fuchsia-300"> Blind Mode is ON: Your card stats are hidden! Pick based purely on your cricket knowledge!</span> : ""}
              {" "}You have 15 seconds to pick, or the CPU steals the point! First to 10 points wins the match.
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

      <div
        className={[
          "mx-auto flex w-full max-w-7xl flex-col gap-6",
          hasStarted ? "min-h-[calc(100vh-3rem)] items-center justify-center" : ""
        ].join(" ")}
      >
        {hasStarted ? (
          <>
            <div className="w-full text-center">
              <p className="text-xs uppercase tracking-[0.34em] text-crease sm:text-sm">
                IPL Trump Cards
              </p>
            </div>
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
              onExitRequest={() => {
                if (gameOver) {
                  handleExitGame();
                } else {
                  setShowExitConfirm(true);
                }
              }}
              onTimeout={handleTimeout}
              isBlindMode={isBlindMode}
            />
          </>
        ) : (
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4 sm:gap-8 sm:py-8 lg:px-8">
            {/* Main Split-Pane Card */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/5 shadow-2xl backdrop-blur-3xl md:grid md:grid-cols-2">
              
              {/* Vibrant Rainbow Glowing Background Effects */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-cyan-400/30 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/30 blur-[100px]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/20 blur-[120px]" />

              {/* Left Column: Hero/Title Area */}
              <div className="relative flex flex-col justify-center border-b border-white/5 p-8 sm:p-12 md:border-b-0 md:border-r">
                <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  IPL Trump <br />
                  <span className="bg-gradient-to-br from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Cards</span>
                </h1>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300 sm:text-base">
                  A fast-paced, stat-driven cricket card game powered by a decade of real IPL data. Outsmart the CPU to claim the trophy! 🏆
                </p>
              </div>

              {/* Right Column: Setup Form */}
              <div className="relative flex flex-col justify-center p-8 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Match Setup</p>

                <div className="mt-6 flex flex-col gap-4">
                  {/* Deck Toggles */}
                  <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5 backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setDeckMode("batters")}
                      className={`flex-1 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition sm:text-sm ${deckMode === "batters" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                      🏏 Batters
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeckMode("bowlers")}
                      className={`flex-1 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition sm:text-sm ${deckMode === "bowlers" ? "bg-emerald-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                      🥎 Bowlers
                    </button>
                  </div>

                  {/* Blind Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsBlindMode(!isBlindMode)}
                    className={`w-full rounded-2xl border px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition sm:text-sm ${isBlindMode ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.15)]" : "border-white/10 bg-black/20 text-slate-400 hover:bg-black/40 hover:text-white"}`}
                  >
                    {isBlindMode ? "🙈 Blind Mode: Active" : "👀 Blind Mode: Off"}
                  </button>

                  {/* Name Input */}
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={(event) => setPlayerNameInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleStartGame();
                      }
                    }}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-lg font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50"
                    maxLength={24}
                  />

                  {/* Start Button */}
                  <button
                    type="button"
                    onClick={handleStartGame}
                    disabled={!playerNameInput.trim()}
                    className="mt-2 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    Play Ball ⚡
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Feature Highlights */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-xl shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]">⚔️</div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-300">Head to Head</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">10 rounds. 15 seconds per pick. Outsmart the CPU in a fast-paced duel.</p>
              </div>
              <div className="rounded-[24px] border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-xl shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]">📊</div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-300">Live Data</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">Powered by real player statistics from the 2016-2025 IPL seasons.</p>
              </div>
              <div className="rounded-[24px] border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500/10 text-xl shadow-[inset_0_0_12px_rgba(217,70,239,0.2)]">🔥</div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-fuchsia-300">Dynamic Stats</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">Pound for pound comparisons. Higher is better for batters, lower for bowlers.</p>
              </div>
            </div>

            <footer className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <span>Made by Vishal.</span>
              <a href="mailto:vgvishal31@gmail.com" className="flex items-center gap-1.5 font-semibold text-slate-400 transition hover:text-white" aria-label="Email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5Zm2.2-.5L12 10.6 19.8 5ZM20 6.56l-7.43 5.35a1 1 0 0 1-1.14 0L4 6.56V18.5c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5Z"/></svg>
                Email
              </a>
            </footer>
          </div>
        )}
      </div>
    </main>
  );
}
