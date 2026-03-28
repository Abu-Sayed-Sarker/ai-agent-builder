import React from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '◻', title, description }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
    <div className="text-3xl mb-1 opacity-30">{icon}</div>
    <p className="text-slate-300 text-sm font-medium">{title}</p>
    <p className="text-slate-500 text-xs">{description}</p>
  </div>
)
