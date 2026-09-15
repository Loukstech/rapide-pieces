import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Trash2, Edit2, Calendar, Flag, X } from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdateTitle,
  onUpdatePriority,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdateTitle(task.id, editTitle.trim());
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const priorityMeta: Record<Priority, { label: string; badgeClass: string }> = {
    low: {
      label: 'Basse',
      badgeClass: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/60',
    },
    medium: {
      label: 'Moyenne',
      badgeClass: 'text-amber-700 bg-amber-50/80 border-amber-200/60',
    },
    high: {
      label: 'Haute',
      badgeClass: 'text-rose-700 bg-rose-50/80 border-rose-200/60',
    },
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now();

  return (
    <motion.li
      id={`task-item-${task.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={`group flex items-start gap-3 p-3.5 bg-white rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'border-zinc-200/60 bg-zinc-50/50 opacity-75'
          : 'border-zinc-200 shadow-xs hover:border-zinc-300'
      }`}
    >
      {/* Checkbox button */}
      <button
        id={`toggle-task-${task.id}`}
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Marquer comme non terminée" : "Marquer comme terminée"}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-zinc-900 border-zinc-900 text-white'
            : 'border-zinc-300 hover:border-zinc-500 bg-white'
        }`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      </button>

      {/* Task Content / Inline edit */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              id={`edit-input-${task.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full text-sm font-normal text-zinc-900 bg-zinc-50 border border-zinc-300 rounded px-2 py-1 outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-1 text-zinc-600 hover:text-zinc-900"
              title="Enregistrer"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditTitle(task.title);
                setIsEditing(false);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600"
              title="Annuler"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <p
              onClick={() => !task.completed && setIsEditing(true)}
              className={`text-sm leading-snug break-words transition-all cursor-pointer select-none ${
                task.completed
                  ? 'text-zinc-400 line-through'
                  : 'text-zinc-800 font-normal hover:text-zinc-950'
              }`}
            >
              {task.title}
            </p>

            {/* Badges row: Priority & Due Date */}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {/* Priority badge with quick cycle on click */}
              <button
                type="button"
                onClick={() => {
                  const nextPriority: Record<Priority, Priority> = {
                    low: 'medium',
                    medium: 'high',
                    high: 'low',
                  };
                  onUpdatePriority(task.id, nextPriority[task.priority]);
                }}
                title="Cliquer pour changer la priorité"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                  priorityMeta[task.priority].badgeClass
                }`}
              >
                <Flag className="w-2.5 h-2.5" />
                <span>{priorityMeta[task.priority].label}</span>
              </button>

              {/* Due date badge */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${
                    isOverdue
                      ? 'text-rose-700 bg-rose-50/80 border-rose-200/70'
                      : 'text-zinc-600 bg-zinc-100/80 border-zinc-200'
                  }`}
                  title={isOverdue ? 'Tâche en retard !' : 'Date d’échéance'}
                >
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{formatDueDate(task.dueDate)}</span>
                  {isOverdue && <span className="font-semibold text-rose-600">(Retard)</span>}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && !isEditing && (
          <button
            id={`edit-btn-${task.id}`}
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Modifier la tâche"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          id={`delete-btn-${task.id}`}
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label="Supprimer la tâche"
          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.li>
  );
};
