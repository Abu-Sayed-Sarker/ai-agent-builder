import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "./components/layout/Header";
import { ProfileSelector } from "./components/builder/ProfileSelector";
import { SkillPanel } from "./components/builder/SkillPanel";
import { LayerPanel } from "./components/builder/LayerPanel";
import { ProviderSelector } from "./components/builder/ProviderSelector";
import {
  AgentPreview,
  SavedAgentCard,
} from "./components/builder/AgentPreview";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { useAgentData } from "./hooks/useAgentData";
import { useSavedAgents } from "./hooks/useSavedAgents";

export default function App() {
  // --- Configuration State ---
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [agentName, setAgentName] = useState("");

  // --- Data Fetching (Bug Fix: removed artificial delay and per-selection refetch calls) ---
  const { data, loading, error, refetch } = useAgentData();

  // Bug Fix: Analytics heartbeat now correctly references agentName via a ref
  // to avoid the stale closure bug from the original empty-dep useEffect.
  const agentNameRef = useRef(agentName);
  useEffect(() => {
    agentNameRef.current = agentName;
  }, [agentName]);

  useEffect(() => {
    const interval = setInterval(() => {
      const name = agentNameRef.current;
      if (name !== "") {
        console.log(
          `[Analytics Heartbeat] User is working on agent named: "${name}"`,
        );
      } else {
        console.log(
          "[Analytics Heartbeat] User is working on an unnamed agent draft...",
        );
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []); // the empty dep array is intentional; we use the ref for fresh value

  // --- Saved Agents (Bug Fix: UUID-based IDs, not array index) ---
  const callbacks = useCallback(
    () => ({
      setProfile: setSelectedProfile,
      setSkills: setSelectedSkills,
      setLayers: setSelectedLayers,
      setProvider: setSelectedProvider,
      setName: setAgentName,
    }),
    [],
  );

  const { savedAgents, saveAgent, deleteAgent, clearAllAgents, loadAgent } =
    useSavedAgents(callbacks());

  const handleSave = () => {
    if (!agentName.trim()) {
      alert("Please enter a name for your agent.");
      return;
    }
    saveAgent({
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    });
    setAgentName("");
  };

  const [activeTab, setActiveTab] = useState<
    "profile" | "skills" | "layers" | "provider"
  >("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: "◈",
      count: selectedProfile ? 1 : 0,
    },
    { id: "skills", label: "Skills", icon: "⚡", count: selectedSkills.length },
    { id: "layers", label: "Layers", icon: "◎", count: selectedLayers.length },
    {
      id: "provider",
      label: "Provider",
      icon: "◇",
      count: selectedProvider ? 1 : 0,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200">
      {/* Background glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-cyan-600/6 blur-3xl" />
      </div>

      <Header loading={loading} onRefetch={refetch} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h2
            className="text-2xl font-bold text-white font-space"
          >
            Build Your AI Agent
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Select a profile, add skills, stack personality layers, and choose a
            provider.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <span>⚠</span>
            <span>{error}</span>
            <button
              onClick={refetch}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/5 bg-white/2 p-8">
            <LoadingSpinner message="Fetching agent configuration..." />
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left panel — Configuration */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-white/8 bg-black/20">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200
                        ${
                          activeTab === tab.id
                            ? "text-white border-b-2 border-indigo-500 bg-indigo-500/5"
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/3 border-b-2 border-transparent"
                        }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] flex items-center justify-center leading-none">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-6">
                  {activeTab === "profile" && (
                    <ProfileSelector
                      profiles={data.agentProfiles}
                      selectedId={selectedProfile}
                      onSelect={setSelectedProfile}
                    />
                  )}
                  {activeTab === "skills" && (
                    <SkillPanel
                      availableSkills={data.skills}
                      selectedIds={selectedSkills}
                      onChange={setSelectedSkills}
                    />
                  )}
                  {activeTab === "layers" && (
                    <LayerPanel
                      availableLayers={data.layers}
                      selectedIds={selectedLayers}
                      onChange={setSelectedLayers}
                    />
                  )}
                  {activeTab === "provider" && (
                    <ProviderSelector
                      selected={selectedProvider}
                      onSelect={setSelectedProvider}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right panel — Live Preview */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/8 bg-white/2 p-6 sticky top-24 min-h-125">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
                  Live Preview
                </h3>
                <AgentPreview
                  data={data}
                  selectedProfile={selectedProfile}
                  selectedSkills={selectedSkills}
                  selectedLayers={selectedLayers}
                  selectedProvider={selectedProvider}
                  agentName={agentName}
                  onNameChange={setAgentName}
                  onSave={handleSave}
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Saved Agents section */}
        {savedAgents.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="text-lg font-semibold text-white font-space"
                >
                  Saved Agents
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {savedAgents.length} agent
                  {savedAgents.length !== 1 ? "s" : ""} saved
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Clear all saved agents?")) clearAllAgents();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/5 text-slate-500 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
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
                  onLoad={loadAgent}
                  onDelete={deleteAgent}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
