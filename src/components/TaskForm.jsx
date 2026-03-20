import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { taskApi } from '../services/api';
import useTaskStore from '../store/useTaskStore';

export default function TaskForm() {
  const queryClient = useQueryClient();
  const { isFormOpen, setFormOpen, editingTask, clearEditingTask } = useTaskStore();
  
  const [formData, setFormData] = useState({ title: '', description: '', status: 'PENDING' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({ 
        title: editingTask.title, 
        description: editingTask.description || '',
        status: editingTask.status 
      });
    } else {
      setFormData({ title: '', description: '', status: 'PENDING' });
    }
  }, [editingTask, isFormOpen]);

  const closeForm = () => {
    setFormOpen(false);
    clearEditingTask();
    setError('');
  };

  const mutation = useMutation({
    mutationFn: (data) => 
      editingTask 
        ? taskApi.update(editingTask.id, data) 
        : taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeForm();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    mutation.mutate(formData);
  };

  if (!isFormOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={closeForm} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-slate-50 focus:bg-white"
                placeholder="e.g., Prepare Q3 presentation"
                disabled={mutation.isPending}
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-slate-50 focus:bg-white resize-none"
                placeholder="Add more details about this task..."
                disabled={mutation.isPending}
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center min-w-[120px]"
            >
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingTask ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
