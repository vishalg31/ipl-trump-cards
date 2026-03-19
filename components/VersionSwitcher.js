import { uiVersionOptions } from "@/lib/uiVersions";

export default function VersionSwitcher({ selectedVersion, onChange }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-black/20 p-4 backdrop-blur md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-crease">UI Versions</p>
          <p className="mt-2 text-sm text-mist">
            Switch visual themes locally while keeping the same game logic and data.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {uiVersionOptions.map((option) => {
            const isSelected = selectedVersion === option.id;
            const isPlanned = option.status !== "ready";

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => !isPlanned && onChange(option.id)}
                disabled={isPlanned}
                className={[
                  "rounded-2xl border px-4 py-3 text-left transition",
                  isSelected
                    ? "border-crease bg-crease/15 text-white"
                    : "border-white/10 bg-white/5 text-mist hover:border-white/20 hover:bg-white/10",
                  isPlanned ? "cursor-not-allowed opacity-45" : ""
                ].join(" ")}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
