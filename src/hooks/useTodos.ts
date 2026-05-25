import { useState, useEffect, useCallback } from 'react';
import { Todo, Priority, FilterType, DbTodo } from '@/types';
import { supabase } from '@/lib/supabase';

function dbTodoToTodo(row: DbTodo): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    priority: 'medium',
    createdAt: new Date(row.created_at).getTime(),
    category: 'General',
  };
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTodos = useCallback(async () => {
    if (!supabase) {
      setError(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTodos((data as DbTodo[]).map(dbTodoToTodo));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  // Real-time subscription
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const channel = client
      .channel('todos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => {
          void fetchTodos();
        }
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [fetchTodos]);

  async function addTodo(
    text: string,
    _priority: Priority,
    _category: string
  ): Promise<void> {
    if (!text.trim() || !supabase) return;
    setError(null);
    const { error: insertError } = await supabase
      .from('todos')
      .insert([{ text: text.trim(), completed: false }]);
    if (insertError) {
      setError(insertError.message);
    }
    // Real-time subscription will trigger fetchTodos automatically
  }

  async function toggleTodo(id: string): Promise<void> {
    if (!supabase) return;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    const { error: updateError } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
      // Revert optimistic update on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: todo.completed } : t))
      );
    }
  }

  async function deleteTodo(id: string): Promise<void> {
    if (!supabase) return;
    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      // Refetch to restore correct state
      void fetchTodos();
    }
  }

  async function editTodo(id: string, text: string): Promise<void> {
    if (!text.trim() || !supabase) return;
    const trimmed = text.trim();
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
    const { error: updateError } = await supabase
      .from('todos')
      .update({ text: trimmed })
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
      void fetchTodos();
    }
  }

  async function clearCompleted(): Promise<void> {
    if (!supabase) return;
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;
    // Optimistic update
    setTodos((prev) => prev.filter((t) => !t.completed));
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .in('id', completedIds);
    if (deleteError) {
      setError(deleteError.message);
      void fetchTodos();
    }
  }

  const categories = [
    'all',
    ...Array.from(new Set(todos.map((t) => t.category))),
  ];

  const filtered = todos.filter((t) => {
    const matchFilter =
      filter === 'all' || (filter === 'active' ? !t.completed : t.completed);
    const matchCategory =
      categoryFilter === 'all' || t.category === categoryFilter;
    const matchSearch = t.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchFilter && matchCategory && matchSearch;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return {
    todos: filtered,
    allTodos: todos,
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
  };
}
