export default function ScorePill({ label, value }) {
  return (
    <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-mist">
      <span className="mr-2 text-white/60">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
