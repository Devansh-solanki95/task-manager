import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Plus, ListTodo, LogOut } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './pages/Login';
import Register from './pages/Register';
import useTaskStore from './store/useTaskStore';
import useAuthStore from './store/useAuthStore';

function Dashboard() {
  const { filter, setFilter, setFormOpen } = useTaskStore();
  const { user, logout } = useAuthStore();

  const handleCreateTask = () => {
    setFormOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: 'ALL', label: 'All Tasks' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'COMPLETED', label: 'Completed' }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary-600 to-indigo-800 -z-10" />
      <div className="fixed top-0 inset-x-0 h-[300px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay -z-10" />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-safe">
        
        {/* Header section */}
        <header className="mb-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
            </div>
            <p className="text-primary-100 text-lg ml-1 font-medium">
              Welcome back, <span className="font-bold text-white">{user}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCreateTask}
              className="group flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary-700 hover:bg-slate-50 transition-all rounded-xl font-semibold shadow-xl shadow-primary-900/20 active:scale-95"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              New Task
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Section */}
        <div className="bg-slate-50 min-h-[300px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 -mx-4 sm:mx-0 border border-slate-200/60">
          
          {/* Tabs */}
          <div className="flex p-1 mb-6 bg-slate-200/50 rounded-xl w-full sm:w-auto overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  filter === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <TaskList />
        </div>
      </main>

      <TaskForm />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
