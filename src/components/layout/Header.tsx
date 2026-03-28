import React from 'react'

interface HeaderProps {
  loading: boolean
  onRefetch: () => void
}

export const Header: React.FC<HeaderProps> = ({ loading, onRefetch }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
              ⬡
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight font-space">
                AgentForge
              </h1>
              <p className="text-xs text-slate-500 leading-none">AI Agent Profile Builder</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefetch}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                         border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                className={`inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full ${loading ? 'animate-spin' : ''}`}
                style={{ opacity: loading ? 1 : 0.6 }}
              />
              {loading ? 'Syncing...' : 'Sync Data'}
            </button>

            <div className="h-8 w-px bg-white/10" />

            <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-medium text-white shadow shadow-violet-500/20">
              AB
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
