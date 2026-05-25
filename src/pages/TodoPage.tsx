import { useTodos } from '@/hooks/useTodos';
import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import FilterBar from '@/components/FilterBar';
import StatsBar from '@/components/StatsBar';
import EmptyState from '@/components/EmptyState';
import { CheckCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function TodoPage() {
  const {
    todos,
    allTodos,
    loading,
    error,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    categories,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  } = useTodos();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
            <p className="text-xs text-slate-400">{activeCount} remaining</p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 mb-6 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Form */}
        <AddTodoForm onAdd={addTodo} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading tasks…</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats */}
            {allTodos.length > 0 && (
              <StatsBar
                total={allTodos.length}
                active={activeCount}
                completed={completedCount}
              />
            )}

            {/* Filters */}
            {allTodos.length > 0 && (
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                completedCount={completedCount}
                onClearCompleted={clearCompleted}
              />
            )}

            {/* Todo List */}
            <div>
              {todos.length === 0 ? (
                <EmptyState hasAny={allTodos.length > 0} />
              ) : (
                todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
