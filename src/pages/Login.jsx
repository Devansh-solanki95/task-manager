import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ username: 'demo', password: 'password' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (data) => {
      login(data.data.username, data.data.token);
      navigate('/');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Login failed Check your credentials.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // DEMO MODE BYPASS
    if (formData.username.toLowerCase() === 'demo' && formData.password === 'password') {
      login('DemoUser', 'demo-token');
      navigate('/');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 px-4">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary-600 to-indigo-800 -z-10" />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to manage your tasks</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-sm text-blue-700 font-medium text-center">
            Demo Mode enabled. Just click Sign In!
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-slate-50 focus:bg-white"
              placeholder="johndoe"
              disabled={mutation.isPending}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              disabled={mutation.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3.5 mt-2 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
