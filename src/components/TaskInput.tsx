import React, { useState } from 'react';
import { Plus, Calendar, Flag, ChevronDown } from 'lucide-react';
import { Priority } from '../types';

interface TaskInputProps {
  onAddTask: (title: string, priority: Priority, dueDate?: string, category?: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(title.trim(), priority, dueDate || undefined);
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setShowOptions(false);
  };

  const priorityLabels: Record<Priority, { label: string; color: string }> = {
    low: { label: 'Basse', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    medium: { label: 'Moyenne', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    high: { label: 'Haute', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  };

  return (
    <form id="task-input-form" onSubmit={handleSubmit} className="mb-6">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-900/5 transition-all p-3">
        <div className="flex items-center gap-2">
          <input
            id="new-task-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="flex-1 text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none px-2 py-1.5"
            autoComplete="off"
          />
          <button
            id="toggle-options-btn"
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors ${
              showOptions || dueDate || priority !== 'medium' ? 'bg-zinc-100 text-zinc-900' : ''
            }`}
            title="Options supplémentaires"
            aria-label="Options de la tâche"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`} />
          </button>
          <button
            id="add-task-btn"
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 active:scale-98 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {showOptions && (
          <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500 font-medium">Priorité :</span>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors ${
                      priority === p
                        ? priorityLabels[p].color
                        : 'text-zinc-600 bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {priorityLabels[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500 font-medium">Échéance :</span>
              <input
                id="task-due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-2 py-0.5 rounded-md border border-zinc-200 text-zinc-700 bg-zinc-50 text-xs focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
