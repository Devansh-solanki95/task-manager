import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, Pencil, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { taskApi } from '../services/api';
import useTaskStore from '../store/useTaskStore';

export default function TaskCard({ task }) {
  const queryClient = useQueryClient();
  const { setEditingTask, setFormOpen } = useTaskStore();

  const toggleStatusMutation = useMutation({
    mutationFn: () => taskApi.update(task.id, { 
      ...task, 
      status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => taskApi.delete(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleEdit = () => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={`group p-5 rounded-2xl glass transition-all duration-300 hover:shadow-2xl border ${isCompleted ? 'border-primary-100 bg-white/40' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-4">
        <button 
          onClick={() => toggleStatusMutation.mutate()}
          className="mt-1 flex-shrink-0 text-slate-400 hover:text-primary-500 transition-colors"
          disabled={toggleStatusMutation.isPending}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6 text-primary-500" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div className={`flex-1 transition-all ${isCompleted ? 'opacity-60' : 'opacity-100'}`}>
          <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed break-words">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleEdit}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit Task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteMutation.mutate();
            }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Task"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
