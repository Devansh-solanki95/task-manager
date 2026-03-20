import { useQuery } from '@tanstack/react-query';
import { Loader2, Inbox } from 'lucide-react';
import TaskCard from './TaskCard';
import { taskApi } from '../services/api';
import useTaskStore from '../store/useTaskStore';

export default function TaskList() {
  const { filter } = useTaskStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => taskApi.getAll(filter)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center justify-center text-center">
        <p className="font-semibold mb-2">Failed to load tasks</p>
        <p className="text-sm opacity-80">{error?.message || 'Please check if the backend is running.'}</p>
      </div>
    );
  }

  const tasks = data?.data?.content || [];

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">No tasks found</h3>
        <p className="text-slate-500 max-w-sm">
          {filter === 'ALL' 
            ? "You don't have any tasks yet. Create one to get started!" 
            : `You don't have any ${filter.toLowerCase()} tasks.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
