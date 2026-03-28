import React from "react";
import { PROVIDERS } from "../../constants/providers";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { setProvider } from "../../store/slices/agentSlice";

export const ProviderSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.agent.provider);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center">
          <span className="text-amber-400 text-xs">◇</span>
        </div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          AI Provider
        </label>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => dispatch(setProvider(selected === provider.id ? "" : provider.id))}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200
              ${
                selected === provider.id
                  ? "shadow-lg bg-indigo-500/10"
                  : "border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5"
              }`}
            style={
              selected === provider.id
                ? {
                    borderColor: `${provider.color}60`,
                    boxShadow: `0 0 20px ${provider.color}20`,
                  }
                : {}
            }
            title={provider.label}
          >
            <span
              className="text-xl transition-transform duration-200 hover:scale-110"
              style={
                selected === provider.id
                  ? { color: provider.color }
                  : { color: "#64748b" }
              }
            >
              {provider.icon}
            </span>
            <span
              className="text-xs font-medium transition-colors duration-200"
              style={
                selected === provider.id
                  ? { color: provider.color }
                  : { color: "#64748b" }
              }
            >
              {provider.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
