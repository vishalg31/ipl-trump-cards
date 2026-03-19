export default function AchievementBadges({ achievements }) {
  const badgeItems = [
    {
      id: "streak",
      label: "Best Streak",
      value: achievements.bestWinStreak > 0 ? `${achievements.bestWinStreak} wins` : "Not yet"
    },
    {
      id: "biggest",
      label: "Biggest Stat Win",
      value:
        achievements.biggestStatWin.margin > 0
          ? `+${achievements.biggestStatWin.margin} ${achievements.biggestStatWin.statLabel}`
          : "Not yet"
    },
    {
      id: "comeback",
      label: "Comeback Wins",
      value: achievements.comebackWins > 0 ? `${achievements.comebackWins}` : "Not yet"
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
      {badgeItems.map((badge) => (
        <div
          key={badge.id}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
        >
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-300/65">{badge.label}</p>
          <p className="mt-2 text-sm font-semibold text-white">{badge.value}</p>
        </div>
      ))}
    </div>
  );
}
