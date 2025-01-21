import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/Task';

interface TaskFormProps {
  task?: Task;
  initialDate?: string;
  onSubmit: (task: Omit<Task, '_id'>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, initialDate, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, '_id'>>({
    title: '',
    description: '',
    status: 'Pending',
    addDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        addDate: task.addDate.split('T')[0],
        dueDate: task.dueDate.split('T')[0],
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: initialDate,
      }));
    }
  }, [task, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700
            text-gray-900 dark:text-white transition-colors duration-200"
          required
          placeholder="Enter task title"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700
            text-gray-900 dark:text-white transition-colors duration-200"
          rows={4}
          required
          placeholder="Enter task description"
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700
              text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700
              text-gray-900 dark:text-white transition-colors duration-200"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 
            border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 
            border-2 border-transparent rounded-lg hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            transition-colors duration-200"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
} 