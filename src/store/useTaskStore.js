import { create } from 'zustand';

const useTaskStore = create((set) => ({
  filter: 'ALL', // ALL, COMPLETED, PENDING
  setFilter: (filter) => set({ filter }),
  
  editingTask: null,
  setEditingTask: (task) => set({ editingTask: task }),
  clearEditingTask: () => set({ editingTask: null }),
  
  isFormOpen: false,
  setFormOpen: (isOpen) => set({ isFormOpen: isOpen })
}));

export default useTaskStore;
