import { useState } from "react";

const REVEAL_DELAY_MS = 2000;
const RESULT_DISPLAY_MS = 2500;
const FINAL_SHOWDOWN_REVEAL_DELAY_MS = 3000;
const FINAL_SHOWDOWN_RESULT_DISPLAY_MS = 3000;
const WINNING_SCORE = 10;

function shuffleCards(cards) {
  const copy = [...cards];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildRoundQueue(playerPool) {
  const shuffled = shuffleCards(playerPool);
  const rounds = [];

  for (let index = 0; index < shuffled.length - 1; index += 2) {
    const firstPlayer = shuffled[index];
    const secondPlayer = shuffled[index + 1];

    if (Math.random() > 0.5) {
      rounds.push({
        userPlayer: firstPlayer,
        cpuPlayer: secondPlayer
      });
    } else {
      rounds.push({
        userPlayer: secondPlayer,
        cpuPlayer: firstPlayer
      });
    }
  }

  return rounds;
}

export function useTrumpCardsGame(playerPool, lowerIsBetterKeys = []) {
  const initialRounds = buildRoundQueue(playerPool);

  const [roundQueue, setRoundQueue] = useState(initialRounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [selectedStat, setSelectedStat] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [cpuRevealed, setCpuRevealed] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState("");
  const [dramaticRoundActive, setDramaticRoundActive] = useState(false);

  const currentRound = roundQueue[roundIndex] || null;
  const userCard = currentRound?.userPlayer || null;
  const cpuCard = currentRound?.cpuPlayer || null;

  function getNextRoundState(nextRoundIndex) {
    if (nextRoundIndex < roundQueue.length) {
      return {
        nextQueue: roundQueue,
        nextIndex: nextRoundIndex
      };
    }

    return {
      nextQueue: buildRoundQueue(playerPool),
      nextIndex: 0
    };
  }

  function restartGame() {
    const freshRounds = buildRoundQueue(playerPool);

    setRoundQueue(freshRounds);
    setRoundIndex(0);
    setUserScore(0);
    setCpuScore(0);
    setSelectedStat(null);
    setRoundWinner(null);
    setCpuRevealed(false);
    setIsResolving(false);
    setGameOver(false);
    setWinnerMessage("");
    setDramaticRoundActive(false);
  }

  function finishGame(nextUserScore, nextCpuScore) {
    if (nextUserScore >= WINNING_SCORE) {
      setGameOver(true);
      setWinnerMessage("You Win The Game");
      return true;
    }

    if (nextCpuScore >= WINNING_SCORE) {
      setGameOver(true);
      setWinnerMessage("CPU Wins The Game");
      return true;
    }

    return false;
  }

  function playRound(statKey) {
    if (!userCard || !cpuCard || isResolving || gameOver) {
      return;
    }

    const isFinalShowdownRound = userScore === 9 && cpuScore === 9;
    const revealDelay = isFinalShowdownRound ? FINAL_SHOWDOWN_REVEAL_DELAY_MS : REVEAL_DELAY_MS;
    const resultDisplayDelay = isFinalShowdownRound
      ? FINAL_SHOWDOWN_RESULT_DISPLAY_MS
      : RESULT_DISPLAY_MS;

    setSelectedStat(statKey);
    setIsResolving(true);

    const userValue = userCard[statKey];
    const cpuValue = cpuCard[statKey];

    let winner = "draw";
    let nextUserScore = userScore;
    let nextCpuScore = cpuScore;

    const isLowerBetter = lowerIsBetterKeys.includes(statKey);

    if (userValue !== cpuValue) {
      const userWins = isLowerBetter
        ? userValue < cpuValue
        : userValue > cpuValue;

      if (userWins) {
        winner = "user";
        nextUserScore += 1;
      } else {
        winner = "cpu";
        nextCpuScore += 1;
      }
    }

    // Add a pre-reveal delay for the tap animation and dimming effect
    window.setTimeout(() => {
      setCpuRevealed(true);
      setDramaticRoundActive(isFinalShowdownRound);

      window.setTimeout(() => {
        setRoundWinner(winner);

        if (winner === "user") {
          setUserScore(nextUserScore);
        } else if (winner === "cpu") {
          setCpuScore(nextCpuScore);
        }

        const ended = finishGame(nextUserScore, nextCpuScore);

        window.setTimeout(() => {
          const { nextQueue, nextIndex } = getNextRoundState(roundIndex + 1);

          setSelectedStat(null);
          setCpuRevealed(false);
          setIsResolving(false);
          setDramaticRoundActive(false);

          if (!ended) {
            setRoundQueue(nextQueue);
            setRoundIndex(nextIndex);
            setRoundWinner(null);
          }
        }, resultDisplayDelay);
      }, revealDelay);
    }, 400); 
  }

  return {
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
  };
}
