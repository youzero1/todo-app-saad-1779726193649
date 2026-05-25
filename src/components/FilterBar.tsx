import clsx from 'clsx';
import { FilterType } from '@/types';
import { Search } from 'lucide-react';

type FilterBarProps = {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  categories: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

export default function FilterBar({
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  searchQuery,
  setSearchQuery,
  activeCount,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Done' },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-100 text-sm text-slate-600 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 items-center">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                filter === f.value
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="ml-auto text-xs text-slate-400 hover:text-rose-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-50"
          >
            Clear {completedCount} done
          </button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                categoryFilter === cat
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              )}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
