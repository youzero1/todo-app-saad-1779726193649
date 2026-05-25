import { ClipboardList } from 'lucide-react';

type EmptyStateProps = {
  hasAny: boolean;
};

export default function EmptyState({ hasAny }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <ClipboardList size={32} className="text-indigo-300" />
      </div>
      <p className="text-slate-500 font-medium text-sm">
        {hasAny ? 'No tasks match your filter' : 'No tasks yet!'}
      </p>
      <p className="text-slate-400 text-xs mt-1">
        {hasAny ? 'Try changing your search or filter.' : 'Add a task above to get started.'}
      </p>
    </div>
  );
}
