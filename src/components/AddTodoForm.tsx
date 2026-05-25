import { useState } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { Priority } from '@/types';

type AddTodoFormProps = {
  onAdd: (text: string, priority: Priority, category: string) => void;
};

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');
  const [expanded, setExpanded] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, category);
    setText('');
    setPriority('medium');
    setCategory('');
    setExpanded(false);
  }

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { value: 'high', label: 'High', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all',
            text.trim()
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPriority(opt.value)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  opt.color,
                  priority === opt.value ? 'ring-2 ring-offset-1 ring-indigo-400' : 'opacity-60 hover:opacity-100'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="flex-1 min-w-32 bg-slate-50 rounded-lg px-3 py-1.5 text-xs text-slate-600 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-auto"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
