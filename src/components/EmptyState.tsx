import React from 'react';
import { CheckCircle2, ListFilter, ClipboardCheck } from 'lucide-react';
import { FilterStatus } from '../types';

interface EmptyStateProps {
  filter: FilterStatus;
  isSearching: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter, isSearching }) => {
  if (isSearching) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <ListFilter className="w-8 h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
        <p className="text-sm font-medium text-zinc-700">Aucun résultat trouvé</p>
        <p className="text-xs text-zinc-400 mt-1">Essayez un autre mot-clé dans la recherche.</p>
      </div>
    );
  }

  if (filter === 'completed') {
    return (
      <div className="py-12 text-center text-zinc-500">
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
        <p className="text-sm font-medium text-zinc-700">Aucune tâche terminée</p>
        <p className="text-xs text-zinc-400 mt-1">Cochez une tâche pour la marquer comme achevée.</p>
      </div>
    );
  }

  if (filter === 'active') {
    return (
      <div className="py-12 text-center text-zinc-500">
        <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-emerald-400 stroke-[1.5]" />
        <p className="text-sm font-medium text-zinc-700">Toutes les tâches sont terminées !</p>
        <p className="text-xs text-zinc-400 mt-1">Bravo, vous n’avez plus aucune tâche en cours.</p>
      </div>
    );
  }

  return (
    <div className="py-12 text-center text-zinc-500">
      <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
      <p className="text-sm font-medium text-zinc-700">Votre liste est vide</p>
      <p className="text-xs text-zinc-400 mt-1">Ajoutez une tâche ci-dessus pour commencer votre journée.</p>
    </div>
  );
};
