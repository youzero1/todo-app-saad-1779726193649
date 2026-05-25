export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  category: string;
}

// Shape returned by Supabase (todos table)
export interface DbTodo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}
