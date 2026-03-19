"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { AnimatePresence, motion } from "framer-motion";

function AchievementBadge({ text }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
      <p className="text-sm font-semibold leading-5 text-white">{text}</p>
    </div>
  );
}

export default function PostcardModal({
  open,
  onClose,
  playerName,
  winnerMessage,
  userDeckCount,
  cpuDeckCount,
  achievements
}) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const dominationLine =
    achievements.comebackWins > 0
      ? "INSANE COMEBACK"
      : userDeckCount === 10 && cpuDeckCount === 0
        ? "TOTAL DOMINATION"
        : "CLUTCH VICTORY";

  const achievementBadges = [
    `🔥 On Fire: ${
      achievements.bestWinStreak > 0 ? `${achievements.bestWinStreak} Win Streak` : "Not Yet"
    }`,
    `💥 Biggest Hit: ${
      achievements.biggestStatWin.margin > 0
        ? `+${achievements.biggestStatWin.margin} ${achievements.biggestStatWin.statLabel}`
        : "Not Yet"
    }`,
    `🎯 Comeback King: ${
      achievements.comebackWins > 0
        ? `${achievements.comebackWins} Time${achievements.comebackWins > 1 ? "s" : ""}`
        : "Not Yet"
    }`
  ];

  async function handleDownload() {
    if (!cardRef.current) {
      return;
    }

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });

      const link = document.createElement("a");
      link.download = `${playerName.toLowerCase().replace(/\s+/g, "-")}-ipl-trump-cards-postcard.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/75 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto flex min-h-full w-full max-w-5xl items-center"
          >
            <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
              <div className="flex justify-center">
                <div
                  ref={cardRef}
                  className="flex w-full max-w-[760px] flex-col gap-4 rounded-[32px] border border-fuchsia-300/20 bg-[linear-gradient(145deg,#140a25_0%,#111827_32%,#0f172a_68%,#1d4ed8_100%)] p-4 text-white shadow-[0_28px_80px_rgba(15,23,42,0.52)] sm:p-6"
                >
                  <div className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.26),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.28))] p-5 text-center sm:p-7">
                    <p className="text-[11px] uppercase tracking-[0.42em] text-amber-100/75">
                      IPL Trump Cards
                    </p>
                    <h2 className="text-4xl font-black uppercase leading-none text-amber-50 drop-shadow-[0_0_24px_rgba(250,204,21,0.35)] sm:text-6xl">
                      🏆 Champion
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-black uppercase leading-tight text-white sm:text-2xl">
                      🔥 {playerName} Dominated The Game 🔥
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-[linear-gradient(160deg,rgba(250,204,21,0.16),rgba(255,255,255,0.06),rgba(15,23,42,0.38))] p-5 sm:p-6">
                    <p className="text-center text-[11px] uppercase tracking-[0.34em] text-slate-100/70">
                      Final Score
                    </p>
                    <div className="flex flex-col gap-2 text-center">
                      <p className="text-3xl font-black text-white sm:text-4xl">
                        {playerName}: {userDeckCount} points
                      </p>
                      <p className="text-2xl font-bold text-slate-100/90 sm:text-3xl">
                        CPU: {cpuDeckCount} points
                      </p>
                    </div>
                    <p className="text-center text-sm font-black uppercase tracking-[0.24em] text-cyan-200 sm:text-base">
                      {dominationLine} ⚡
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.34))] p-5 sm:p-6">
                    <p className="text-[11px] uppercase tracking-[0.34em] text-slate-100/70">
                      Achievements
                    </p>
                    <div className="flex flex-col gap-3">
                      {achievementBadges.map((badge) => (
                        <AchievementBadge key={badge} text={badge} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-[26px] border border-fuchsia-300/16 bg-[linear-gradient(135deg,rgba(168,85,247,0.18),rgba(255,255,255,0.04),rgba(15,23,42,0.26))] p-5 text-center sm:p-6">
                    <p className="text-xl font-black text-white sm:text-2xl">
                      Think you can beat this? 👇
                    </p>
                    <p className="text-sm text-slate-100/80 sm:text-base">
                      Can you top this performance?
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                    <p className="text-base font-bold text-white">Play now → vishalbuilds.com</p>
                    <div className="self-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
                      #IPLTrumpCards
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(15,23,42,0.9))] p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.38)]">
                <p className="text-xs uppercase tracking-[0.32em] text-amber-100/75">Share Postcard</p>
                <h3 className="mt-3 text-2xl font-bold">Download your match card</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/75">
                  This version uses a simple vertical layout so every section is captured clearly in
                  the exported image.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="rounded-2xl bg-[linear-gradient(135deg,#fcd34d,#f8fafc)] px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDownloading ? "Generating..." : "Download Image"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
