import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { FilterStatus } from '../types';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: { all: number; active: number; completed: number };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearCompleted: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts,
  searchQuery,
  onSearchChange,
  onClearCompleted,
}) => {
  const tabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'all', label: 'Toutes', count: counts.all },
    { id: 'active', label: 'En cours', count: counts.active },
    { id: 'completed', label: 'Terminées', count: counts.completed },
  ];

  return (
    <div className="space-y-3 mb-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          id="search-tasks-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une tâche..."
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-zinc-100/70 focus:bg-white border border-transparent focus:border-zinc-300 rounded-lg outline-none transition-all placeholder:text-zinc-400 text-zinc-800"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 px-1"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Filter Tabs & Clear completed */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-200/70 text-zinc-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {counts.completed > 0 && (
          <button
            id="clear-completed-btn"
            type="button"
            onClick={onClearCompleted}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Effacer terminées</span>
          </button>
        )}
      </div>
    </div>
  );
};
