import { CheckSquare, Circle, List } from 'lucide-react';

type StatsBarProps = {
  total: number;
  active: number;
  completed: number;
};

export default function StatsBar({ total, active, completed }: StatsBarProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-slate-600">
            <List size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold">{total}</span>
            <span className="text-xs text-slate-400">total</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Circle size={16} className="text-amber-400" />
            <span className="text-sm font-semibold">{active}</span>
            <span className="text-xs text-slate-400">active</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckSquare size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold">{completed}</span>
            <span className="text-xs text-slate-400">done</span>
          </div>
        </div>
        <span className="text-sm font-bold text-indigo-500">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
