"use client";

import { useRef, useState, useEffect } from "react";
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
  achievements,
  deckMode = "batters"
}) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  // Determine the exact narrative of the match
  const isLoss = cpuDeckCount >= 10;
  const isTiebreaker = userDeckCount === 10 && cpuDeckCount === 9;
  const isClose = userDeckCount === 10 && cpuDeckCount >= 7 && cpuDeckCount <= 8;

  let outcomeKey = "domination";
  if (isLoss) outcomeKey = "loss";
  else if (isTiebreaker) outcomeKey = "tiebreaker";
  else if (isClose) outcomeKey = "close";

  // Visual and text themes for each narrative
  const themes = {
    loss: {
      title: "💀 DEFEATED",
      subtitle: `The AI outsmarted ${playerName}... Who can avenge me?`,
      bgGradient: "bg-[linear-gradient(145deg,#2e0916_0%,#111827_40%,#4c0519_100%)]",
      accent: "text-rose-400",
      glow: "rgba(244,63,94,0.35)",
    },
    tiebreaker: {
      title: "🥶 NAIL-BITER",
      subtitle: `9-9 Tiebreaker! ${playerName} clutched it!`,
      bgGradient: "bg-[linear-gradient(145deg,#140a25_0%,#111827_32%,#701a75_100%)]",
      accent: "text-fuchsia-400",
      glow: "rgba(217,70,239,0.35)",
    },
    close: {
      title: "😅 CLOSE CALL",
      subtitle: `Down to the wire! ${playerName} snuck past the AI!`,
      bgGradient: "bg-[linear-gradient(145deg,#2f1f07_0%,#111827_40%,#0f172a_100%)]",
      accent: "text-amber-400",
      glow: "rgba(251,191,36,0.35)",
    },
    domination: {
      title: "👑 DOMINATION",
      subtitle: `${playerName} absolutely crushed the AI!`,
      bgGradient: "bg-[linear-gradient(145deg,#022c22_0%,#111827_40%,#0f172a_100%)]",
      accent: "text-emerald-400",
      glow: "rgba(52,211,153,0.35)",
    }
  };

  const activeTheme = themes[outcomeKey];
  const shareUrl = "https://cricket.vishalbuilds.com/ipl-trump-cards";
  const shareText = `I just played IPL Trump Cards (${deckMode === "bowlers" ? "Bowlers" : "Batters"} Edition)! ${activeTheme.subtitle}\n\nCan you beat my score? Play here:`;

  const formattedBiggestMargin =
    achievements.biggestStatWin.margin > 0
      ? Number(achievements.biggestStatWin.margin.toFixed(2))
      : 0;

  const achievementBadges = [
    `🔥 On Fire: ${
      achievements.bestWinStreak > 0 ? `${achievements.bestWinStreak} Win Streak` : "Not Yet"
    }`,
    `💥 Biggest Hit: ${
      formattedBiggestMargin > 0
        ? `+${formattedBiggestMargin} ${achievements.biggestStatWin.statLabel}`
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

  function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  }

  function shareToWhatsApp() {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
  }

  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  }

  async function handleNativeShare() {
    if (!cardRef.current) return;
    
    try {
      setIsDownloading(true);
      // 1. Generate the image first
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      // 2. Convert it into a physical File object
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'ipl-trump-cards-result.png', { type: blob.type });

      // 3. Ask the device if it supports sharing files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          text: shareText,
          files: [file]
        });
      } else {
        // Fallback for older devices that only support text sharing
        await navigator.share({
          text: shareText,
          url: shareUrl
        });
      }
    } catch (err) {
      console.log('Share canceled or failed', err);
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
              <div className="order-2 flex justify-center lg:order-1">
                <div
                  ref={cardRef}
                  className={`flex w-full max-w-[760px] flex-col gap-4 rounded-[32px] border border-white/10 ${activeTheme.bgGradient} p-4 text-white shadow-[0_28px_80px_rgba(15,23,42,0.52)] sm:p-6`}
                >
                  <div className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.26),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.28))] p-5 text-center sm:p-7">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-amber-100/75">
                        IPL Trump Cards
                      </p>
                      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">
                        {deckMode === "bowlers" ? "🥎 Bowlers" : "🏏 Batters"}
                      </span>
                    </div>
                    <h2 className="text-4xl font-black uppercase leading-none text-white sm:text-6xl" style={{ textShadow: `0 0 24px ${activeTheme.glow}` }}>
                      {activeTheme.title}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-black uppercase leading-tight text-white sm:text-2xl">
                      {activeTheme.subtitle}
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
                    <p className={`text-center text-sm font-black uppercase tracking-[0.24em] sm:text-base ${activeTheme.accent}`}>
                      {isLoss ? "BETTER LUCK NEXT TIME 🔄" : "WELL PLAYED CHAMPION ⚡"}
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

                  <div className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(15,23,42,0.26))] p-5 text-center sm:p-6">
                    <p className="text-xl font-black text-white sm:text-2xl">
                      {isLoss ? "Think you can do better? 👇" : "Think you can beat this? 👇"}
                    </p>
                    <p className="text-sm text-slate-100/80 sm:text-base">
                      {isLoss ? "Try your hand at the draft!" : "Can you top this performance?"}
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

              <div className="order-1 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(15,23,42,0.9))] p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.38)] lg:order-2">
                <p className="text-xs uppercase tracking-[0.32em] text-amber-100/75">Match Postcard</p>
                <h3 className="mt-3 text-2xl font-bold">Share your postcard with friends</h3>

                <div className="mt-4 mb-4 sm:mt-6 sm:mb-6">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Share Instantly</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={shareToTwitter} className="flex items-center justify-center rounded-xl bg-black py-3 border border-white/15 transition hover:bg-white/10">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.925H5.03l12.053 13.845z"/></svg>
                    </button>
                    <button onClick={shareToWhatsApp} className="flex items-center justify-center rounded-xl bg-[#25D366] text-white py-3 transition hover:brightness-110">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                    <button onClick={shareToFacebook} className="flex items-center justify-center rounded-xl bg-[#1877F2] text-white py-3 transition hover:brightness-110">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </button>

                    {canNativeShare ? (
                      <button onClick={handleNativeShare} className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white py-3 transition hover:brightness-110" title="Share to Instagram">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </button>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-50 cursor-not-allowed text-white py-3">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:flex sm:flex-col">
                  <button
                    type="button"
                    onClick={canNativeShare ? handleNativeShare : handleDownload}
                    disabled={isDownloading}
                    className="flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fcd34d,#f8fafc)] px-2 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
                  >
                    {isDownloading ? "Wait..." : canNativeShare ? "Share / Save" : "Download Postcard"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-5 sm:py-4 sm:text-sm"
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
