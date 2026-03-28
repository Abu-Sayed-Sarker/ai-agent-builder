import React from "react";
import type { AgentProfile } from "../../types";

interface ProfileSelectorProps {
  profiles: AgentProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  selectedId,
  onSelect,
}) => {
  const selectedProfile = profiles.find((p) => p.id === selectedId);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center">
          <span className="text-indigo-400 text-xs">◈</span>
        </div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Base Profile
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() =>
              onSelect(selectedId === profile.id ? "" : profile.id)
            }
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group
              ${
                selectedId === profile.id
                  ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                  : "border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-200
                  ${selectedId === profile.id ? "bg-indigo-400" : "bg-slate-600 group-hover:bg-slate-400"}`}
                />
                <span
                  className={`text-sm font-medium transition-colors duration-200
                  ${selectedId === profile.id ? "text-indigo-300" : "text-slate-300 group-hover:text-white"}`}
                >
                  {profile.name}
                </span>
              </div>
              {selectedId === profile.id && (
                <span className="text-indigo-400 text-xs">✓</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-5 line-clamp-1">
              {profile.description}
            </p>
          </button>
        ))}
      </div>

      {selectedProfile && (
        <div className="mt-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
          <p className="text-xs text-indigo-300/80">
            {selectedProfile.description}
          </p>
        </div>
      )}
    </div>
  );
};
