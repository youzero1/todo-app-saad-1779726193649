import { useState } from 'react';
import { Check, Trash2, Pencil, X, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { Todo } from '@/types';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

const priorityStyles = {
  low: 'border-l-emerald-400 bg-emerald-50',
  medium: 'border-l-amber-400 bg-amber-50',
  high: 'border-l-rose-400 bg-rose-50',
};

const priorityBadge = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleEdit() {
    if (!editText.trim()) return;
    onEdit(todo.id, editText);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  }

  return (
    <div
      className={clsx(
        'group flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-sm mb-3 transition-all hover:shadow-md',
        priorityStyles[todo.priority],
        todo.completed && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={clsx(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5',
          todo.completed
            ? 'bg-indigo-500 border-indigo-500 text-white'
            : 'border-slate-300 hover:border-indigo-400'
        )}
      >
        {todo.completed && <Check size={13} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            type="text"
            value={editText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEdit}
            className="w-full bg-white rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none ring-2 ring-indigo-400"
          />
        ) : (
          <>
            <p
              className={clsx(
                'text-sm font-medium text-slate-700 break-words',
                todo.completed && 'line-through text-slate-400'
              )}
            >
              {todo.text}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', priorityBadge[todo.priority])}>
                {todo.priority}
              </span>
              <span className="text-xs text-slate-400">{todo.category}</span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!todo.completed && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <Pencil size={15} />
          </button>
        )}
        {editing && (
          <button
            onClick={() => { setEditText(todo.text); setEditing(false); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <X size={15} />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
        >
          <Trash2 size={15} />
        </button>
        {todo.completed && (
          <CheckCheck size={15} className="text-indigo-400 ml-1" />
        )}
      </div>
    </div>
  );
}
