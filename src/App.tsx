import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

// Layout & Components
import { Header } from "./components/layout/Header";
import { ProfileSection } from "./components/builder/sections/ProfileSection";
import { SkillPanel } from "./components/builder/SkillPanel";
import { LayerPanel } from "./components/builder/LayerPanel";
import { ProviderSelector } from "./components/builder/ProviderSelector";
import { AgentPreview, SavedAgentCard } from "./components/builder/AgentPreview";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

// Hooks & Store
import { useAgentData } from "./hooks/useAgentData";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import { clearSavedAgents } from "./store/slices/agentSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { data, loading, error, refetch } = useAgentData();
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "layers" | "provider">("profile");

  // --- Redux State ---
  const { profileId, skillIds, layerIds, provider, agentName, savedAgents } = 
    useAppSelector((state) => state.agent);

  // --- Analytics Heartbeat (Bug Fix: fixed stale closure with useRef) ---
  const nameRef = useRef(agentName);
  useEffect(() => { nameRef.current = agentName; }, [agentName]);

  useEffect(() => {
    const interval = setInterval(() => {
      const name = nameRef.current;
      console.log(
        name 
          ? `[Analytics Heartbeat] User is working on: "${name}"`
          : "[Analytics Heartbeat] User is working on an unnamed draft..."
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- Helpers ---
  const handleClearAll = () => {
    if (confirm("Clear all saved agents?")) {
      dispatch(clearSavedAgents());
      toast.success("All saved agents cleared.");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "◈", count: profileId ? 1 : 0 },
    { id: "skills", label: "Skills", icon: "⚡", count: skillIds.length },
    { id: "layers", label: "Layers", icon: "◎", count: layerIds.length },
    { id: "provider", label: "Provider", icon: "◇", count: provider ? 1 : 0 },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <LoadingSpinner message="Forging your builder interface..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200 font-inter">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-cyan-600/6 blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <Header loading={loading} onRefetch={refetch} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white font-space">
            Forge Your AI Agent
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Modular architecture for the modern AI engineer.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <span>⚠</span>
            <span>{error}</span>
            <button onClick={refetch} className="ml-auto text-xs underline hover:no-underline font-medium">Retry Sync</button>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: Builder Controls */}
            <div className="lg:col-span-3 h-fit">
              <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* Modern Navigation Tabs */}
                <div className="flex border-b border-white/8 bg-black/20">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300
                        ${
                          activeTab === tab.id
                            ? "text-white border-b-2 border-indigo-500 bg-indigo-500/5"
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/3 border-b-2 border-transparent"
                        }`}
                    >
                      <span className="text-lg mb-1">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-indigo-500/30 text-indigo-300 text-[9px] flex items-center justify-center leading-none border border-indigo-500/20">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Section Rendering */}
                <div className="p-6 sm:p-8 min-h-100">
                  {activeTab === "profile" && <ProfileSection profiles={data.agentProfiles} />}
                  {activeTab === "skills" && <SkillPanel availableSkills={data.skills} />}
                  {activeTab === "layers" && <LayerPanel availableLayers={data.layers} />}
                  {activeTab === "provider" && <ProviderSelector />}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Preview */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/8 bg-white/2 p-6 sm:p-8 sticky top-24 min-h-125 shadow-2xl backdrop-blur-sm group transition-all duration-500 hover:border-indigo-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Blueprint Preview
                  </h3>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                  </div>
                </div>
                <AgentPreview data={data} />
              </div>
            </div>
          </div>
        )}

        {/* Footer Section: Saved Manifests */}
        {savedAgents.length > 0 && (
          <section className="mt-16 pb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white font-space">
                  Saved Manifests
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access your previously configured AI entities.
                </p>
              </div>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/5 text-slate-500 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedAgents.map((agent) => (
                <SavedAgentCard
                  key={agent.id}
                  agent={agent}
                  data={data}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
