import React from "react";
import toast from "react-hot-toast";
import type { AgentData, SavedAgent } from "../../types";
import {
  LAYER_TYPE_COLORS,
  CATEGORY_COLORS,
  PROVIDERS,
} from "../../constants/providers";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import {
  addSavedAgent,
  deleteSavedAgent,
  loadAgentDraft,
  setAgentName,
} from "../../store/slices/agentSlice";

interface AgentPreviewProps {
  data: AgentData;
}

export const AgentPreview: React.FC<AgentPreviewProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { profileId, skillIds, layerIds, provider: providerId, agentName } = 
    useAppSelector((state) => state.agent);

  const profile = data.agentProfiles.find((p) => p.id === profileId);
  const skills = skillIds
    .map((id) => data.skills.find((s) => s.id === id))
    .filter(Boolean);
  const layers = layerIds
    .map((id) => data.layers.find((l) => l.id === id))
    .filter(Boolean);
  const provider = PROVIDERS.find((p) => p.id === providerId);

  const completionPct = Math.round(
    ([profileId ? 1 : 0, skillIds.length > 0 ? 1 : 0, providerId ? 1 : 0].reduce(
      (a, b) => a + b,
      0,
    ) /
      3) *
      100,
  );

  const handleSave = () => {
    if (!agentName.trim()) {
      toast.error("Please enter a name for your agent.");
      return;
    }

    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),
      name: agentName,
      profileId,
      skillIds,
      layerIds,
      provider: providerId,
      createdAt: new Date().toISOString(),
    };

    dispatch(addSavedAgent(newAgent));
    dispatch(setAgentName(""));
    toast.success(`Agent "${newAgent.name}" saved!`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Configuration Progress</span>
          <span className="text-xs text-slate-300 font-medium">
            {completionPct}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Profile
        </h3>
        {profile ? (
          <div className="p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
            <p className="text-sm font-semibold text-indigo-300">
              {profile.name}
            </p>
            <p className="text-xs text-slate-400 mt-1">{profile.description}</p>
          </div>
        ) : (
          <EmptyState
            icon="◈"
            title="No profile selected"
            description="Choose a base profile on the left"
          />
        )}
      </div>

      <div className="mb-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Provider
        </h3>
        {provider ? (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{
              borderColor: `${provider.color}40`,
              backgroundColor: `${provider.color}10`,
            }}
          >
            <span style={{ color: provider.color }}>{provider.icon}</span>
            <span
              className="text-sm font-medium"
              style={{ color: provider.color }}
            >
              {provider.label}
            </span>
          </div>
        ) : (
          <EmptyState
            icon="◇"
            title="No provider selected"
            description="Choose an AI provider"
          />
        )}
      </div>

      <div className="mb-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Skills <span className="text-slate-600 normal-case font-normal">({skills.length})</span>
        </h3>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {skills.map(
              (skill) =>
                skill && (
                  <Badge
                    key={skill.id}
                    label={skill.name}
                    color={CATEGORY_COLORS[skill.category] || "#94a3b8"}
                  />
                ),
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-600">No skills added</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Layers <span className="text-slate-600 normal-case font-normal">({layers.length})</span>
        </h3>
        {layers.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {layers.map(
              (layer) =>
                layer && (
                  <Badge
                    key={layer.id}
                    label={layer.name}
                    color={LAYER_TYPE_COLORS[layer.type] || "#94a3b8"}
                  />
                ),
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-600">No layers added</p>
        )}
      </div>

      <div className="mt-auto border-t border-white/5 pt-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Save Agent
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Agent name..."
            value={agentName}
            onChange={(e) => dispatch(setAgentName(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-slate-600
                       focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all duration-200"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl font-medium text-sm bg-linear-to-br from-indigo-600 to-violet-700
                       text-white hover:from-indigo-500 hover:to-violet-600 shadow-lg shadow-indigo-500/25
                       transition-all duration-200 hover:shadow-indigo-500/40 active:scale-95 whitespace-nowrap"
          >
            Save Agent
          </button>
        </div>
      </div>
    </div>
  );
};

interface SavedAgentCardProps {
  agent: SavedAgent;
  data: AgentData | null;
}

export const SavedAgentCard: React.FC<SavedAgentCardProps> = ({ agent, data }) => {
  const dispatch = useAppDispatch();
  const profile = data?.agentProfiles.find((p) => p.id === agent.profileId);
  const provider = PROVIDERS.find((p) => p.id === agent.provider);
  const date = new Date(agent.createdAt).toLocaleDateString();

  const handleDelete = () => {
    dispatch(deleteSavedAgent(agent.id));
    toast.success("Agent deleted.");
  };

  const handleLoad = () => {
    dispatch(loadAgentDraft(agent));
    toast.success(`Loaded "${agent.name}" settings.`);
  };

  return (
    <div className="p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{date}</p>
        </div>
        {provider && (
          <span
            className="text-lg"
            style={{ color: provider.color }}
            title={provider.label}
          >
            {provider.icon}
          </span>
        )}
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 w-14">Profile</span>
          <span className="text-xs text-slate-400">{profile?.name || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 w-14">Skills</span>
          <span className="text-xs text-slate-400">
            {agent.skillIds?.length || 0} added
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 w-14">Layers</span>
          <span className="text-xs text-slate-400">
            {agent.layerIds?.length || 0} stacked
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleLoad}
          className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/15 hover:border-indigo-500/50 transition-all duration-150"
        >
          Load
        </button>
        <button
          onClick={handleDelete}
          className="py-1.5 px-3 rounded-lg text-xs font-medium border border-white/5 text-slate-500 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
