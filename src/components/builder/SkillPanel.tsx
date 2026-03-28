import React, { useState } from "react";
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter,
  type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { setSkillIds, toggleSkill } from "../../store/slices/agentSlice";
import type { Skill } from "../../types";
import { CATEGORY_COLORS } from "../../constants/providers";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

interface SortableSkillCardProps {
  skill: Skill;
  onRemove: (id: string) => void;
}

const SortableSkillCard: React.FC<SortableSkillCardProps> = ({ skill, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/8 bg-white/4 group hover:bg-white/6 transition-colors duration-150"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 shrink-0 transition-colors"
        title="Drag to reorder"
      >
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
          <circle cx="4" cy="3" r="1.5" />
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="4" cy="13" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{skill.name}</span>
          <Badge label={skill.category} color={CATEGORY_COLORS[skill.category] || "#94a3b8"} />
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">{skill.description}</p>
      </div>

      <button
        onClick={() => onRemove(skill.id)}
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
        title="Remove skill"
      >
        ✕
      </button>
    </div>
  );
};

interface SkillPanelProps {
  availableSkills: Skill[];
}

export const SkillPanel: React.FC<SkillPanelProps> = ({ availableSkills }) => {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.agent.skillIds);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const selectedSkills = selectedIds
    .map((id) => availableSkills.find((s) => s.id === id))
    .filter(Boolean) as Skill[];
  const unselectedSkills = availableSkills.filter((s) => !selectedIds.includes(s.id));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedIds.indexOf(active.id as string);
      const newIndex = selectedIds.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(setSkillIds(arrayMove(selectedIds, oldIndex, newIndex)));
      }
    }
  };

  const activeSkill = activeId ? availableSkills.find((s) => s.id === activeId) : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center">
          <span className="text-violet-400 text-xs">⚡</span>
        </div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Skills</label>
        {selectedIds.length > 0 && (
          <span className="ml-auto text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
            {selectedIds.length} active
          </span>
        )}
      </div>

      {unselectedSkills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-2">Click to add:</p>
          <div className="flex flex-wrap gap-2">
            {unselectedSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => dispatch(toggleSkill(skill.id))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/8 bg-white/3 text-xs text-slate-300 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300 transition-all duration-150"
              >
                <span className="text-slate-500">+</span>
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={selectedIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {selectedSkills.length > 0 ? (
              selectedSkills.map((skill) => (
                <SortableSkillCard key={skill.id} skill={skill} onRemove={(id) => dispatch(toggleSkill(id))} />
              ))
            ) : (
              <EmptyState
                icon="⚡"
                title="No skills added"
                description="Click a skill above to add it to your agent"
              />
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeSkill && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-violet-500/40 bg-[#1a1b2e] shadow-2xl shadow-violet-500/20">
              <span className="text-sm font-medium text-white">{activeSkill.name}</span>
              <Badge label={activeSkill.category} color={CATEGORY_COLORS[activeSkill.category] || "#94a3b8"} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
