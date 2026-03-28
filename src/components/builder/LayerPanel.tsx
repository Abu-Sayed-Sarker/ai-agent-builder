import React, { useState } from 'react'
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable,
  verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Layer } from '../../types'
import { LAYER_TYPE_COLORS } from '../../constants/providers'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

interface SortableLayerCardProps {
  layer: Layer
  onRemove: (id: string) => void
}

const SortableLayerCard: React.FC<SortableLayerCardProps> = ({ layer, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: layer.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

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
          <span className="text-sm font-medium text-white truncate">{layer.name}</span>
          <Badge label={layer.type} color={LAYER_TYPE_COLORS[layer.type] || '#94a3b8'} />
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">{layer.description}</p>
      </div>

      <button
        onClick={() => onRemove(layer.id)}
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
        title="Remove layer"
      >
        ✕
      </button>
    </div>
  )
}

interface LayerPanelProps {
  availableLayers: Layer[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ availableLayers, selectedIds, onChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const selectedLayers = selectedIds.map(id => availableLayers.find(l => l.id === id)).filter(Boolean) as Layer[]
  const unselectedLayers = availableLayers.filter(l => !selectedIds.includes(l.id))

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = selectedIds.indexOf(active.id as string)
      const newIndex = selectedIds.indexOf(over.id as string)
      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(selectedIds, oldIndex, newIndex))
      }
    }
  }

  const addLayer = (id: string) => {
    if (!selectedIds.includes(id)) onChange([...selectedIds, id])
  }

  const removeLayer = (id: string) => onChange(selectedIds.filter(l => l !== id))

  const activeLayer = activeId ? availableLayers.find(l => l.id === activeId) : null

  // Group unselected layers by type for organization
  const layersByType = unselectedLayers.reduce<Record<string, Layer[]>>((acc, layer) => {
    if (!acc[layer.type]) acc[layer.type] = []
    acc[layer.type].push(layer)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center">
          <span className="text-cyan-400 text-xs">◎</span>
        </div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Personality Layers</label>
        {selectedIds.length > 0 && (
          <span className="ml-auto text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
            {selectedIds.length} active
          </span>
        )}
      </div>

      {/* Available layers grouped by type */}
      {Object.keys(layersByType).length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-xs text-slate-500">Click to add:</p>
          {Object.entries(layersByType).map(([type, layers]) => (
            <div key={type}>
              <p className="text-xs text-slate-600 mb-1 capitalize">{type}</p>
              <div className="flex flex-wrap gap-1.5">
                {layers.map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => addLayer(layer.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/8 bg-white/3 text-xs text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-150"
                  >
                    <span className="text-slate-500">+</span>
                    {layer.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sortable selected layers */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={selectedIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {selectedLayers.length > 0 ? (
              selectedLayers.map(layer => (
                <SortableLayerCard key={layer.id} layer={layer} onRemove={removeLayer} />
              ))
            ) : (
              <EmptyState
                icon="◎"
                title="No layers added"
                description="Click a layer above to customize your agent's behavior"
              />
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeLayer && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-cyan-500/40 bg-[#1a1b2e] shadow-2xl shadow-cyan-500/20">
              <span className="text-sm font-medium text-white">{activeLayer.name}</span>
              <Badge label={activeLayer.type} color={LAYER_TYPE_COLORS[activeLayer.type] || '#94a3b8'} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
