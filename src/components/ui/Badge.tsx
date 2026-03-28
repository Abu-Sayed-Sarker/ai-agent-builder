import React from 'react'

interface BadgeProps {
  label: string
  color: string
}

export const Badge: React.FC<BadgeProps> = ({ label, color }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
    style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
  >
    {label}
  </span>
)
