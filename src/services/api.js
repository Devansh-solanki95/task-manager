import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage directly to avoid dependency cycles
    const storageState = localStorage.getItem('auth-storage');
    if (storageState) {
      const { token } = JSON.parse(storageState).state;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  register: (data) => api.post('/auth/register', data).then(res => res.data)
};

let demoTasks = [
  { id: 1, title: 'Review System Architecture', description: 'Analyze the new Java Spring Boot microservices layout.', status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, title: 'Update React Components', description: 'Migrate state management to Zustand and React Query.', status: 'PENDING', createdAt: new Date(Date.now() - 4000000).toISOString() },
  { id: 3, title: 'Prepare for Production', description: 'Dockerize the frontend and deploy via Nginx.', status: 'PENDING', createdAt: new Date().toISOString() }
];

export const taskApi = {
  getAll: (status) => {
    const isDemo = localStorage.getItem('auth-storage')?.includes('demo-token');
    if (isDemo) {
      const filtered = status && status !== 'ALL' ? demoTasks.filter(t => t.status === status) : demoTasks;
      return Promise.resolve({ data: { content: filtered } });
    }
    const params = status && status !== 'ALL' ? { status } : {};
    return api.get('/tasks', { params }).then(res => res.data);
  },
  getById: (id) => {
    const isDemo = localStorage.getItem('auth-storage')?.includes('demo-token');
    if (isDemo) return Promise.resolve({ data: demoTasks.find(t => t.id == id) });
    return api.get(`/tasks/${id}`).then(res => res.data);
  },
  create: (data) => {
    const isDemo = localStorage.getItem('auth-storage')?.includes('demo-token');
    if (isDemo) {
      const newTask = { ...data, id: Date.now(), status: data.status || 'PENDING', createdAt: new Date().toISOString() };
      demoTasks = [newTask, ...demoTasks];
      return Promise.resolve({ data: newTask });
    }
    return api.post('/tasks', data).then(res => res.data);
  },
  update: (id, data) => {
    const isDemo = localStorage.getItem('auth-storage')?.includes('demo-token');
    if (isDemo) {
      demoTasks = demoTasks.map(t => t.id == id ? { ...t, ...data } : t);
      return Promise.resolve({ data: demoTasks.find(t => t.id == id) });
    }
    return api.put(`/tasks/${id}`, data).then(res => res.data);
  },
  delete: (id) => {
    const isDemo = localStorage.getItem('auth-storage')?.includes('demo-token');
    if (isDemo) {
      demoTasks = demoTasks.filter(t => t.id != id);
      return Promise.resolve({ data: null });
    }
    return api.delete(`/tasks/${id}`).then(res => res.data);
  },
};

export default api;
