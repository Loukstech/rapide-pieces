import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { CheckSquare, Sparkles } from 'lucide-react';
import { Task, Priority, FilterStatus } from './types';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { TaskFilters } from './components/TaskFilters';
import { EmptyState } from './components/EmptyState';

const STORAGE_KEY = 'simple_tasks_app_data_v1';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Préparer la présentation pour la réunion de projet',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Répondre aux e-mails prioritaires de l’équipe',
    completed: true,
    priority: 'medium',
    createdAt: Date.now() - 7200000,
  },
  {
    id: '3',
    title: 'Planifier les objectifs pour la semaine prochaine',
    completed: false,
    priority: 'low',
    createdAt: Date.now() - 10800000,
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    return INITIAL_TASKS;
  });

  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // storage unavailable
    }
  }, [tasks]);

  // Task actions
  const handleAddTask = (title: string, priority: Priority, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleUpdatePriority = (id: string, priority: Priority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Calculations & Filtering
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { all: total, active, completed };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status tab
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Filter by search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return task.title.toLowerCase().includes(query);
      }

      return true;
    });
  }, [tasks, currentFilter, searchQuery]);

  // Today's formatted date in French
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(now);
  }, []);

  const progressPercent = counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 py-8 px-4 sm:px-6 flex flex-col justify-start items-center font-sans">
      <main className="w-full max-w-xl">
        {/* Header Section */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                <CheckSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
                Gestion de tâches
              </h1>
            </div>
            <span className="text-xs font-medium text-zinc-500 capitalize bg-white border border-zinc-200/80 px-2.5 py-1 rounded-lg shadow-2xs">
              {todayFormatted}
            </span>
          </div>

          {/* Progress overview */}
          {counts.all > 0 && (
            <div className="mt-4 bg-white p-3 rounded-xl border border-zinc-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="text-zinc-600">Progression globale</span>
                <span className="text-zinc-900 font-semibold">
                  {counts.completed} sur {counts.all} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Task Input Form */}
        <TaskInput onAddTask={handleAddTask} />

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 sm:p-5 shadow-xs">
          <TaskFilters
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            counts={counts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearCompleted={handleClearCompleted}
          />

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <EmptyState filter={currentFilter} isSearching={Boolean(searchQuery.trim())} />
          ) : (
            <ul id="tasks-list" className="space-y-2.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onUpdateTitle={handleUpdateTitle}
                    onUpdatePriority={handleUpdatePriority}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}

          {/* Footer hint */}
          <footer className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Cliquer sur le texte d’une tâche pour la renommer</span>
            </span>
            <span>{counts.active} active{counts.active > 1 ? 's' : ''}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
