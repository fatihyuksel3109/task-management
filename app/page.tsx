'use client';

import { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { Task } from '@/types/Task';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (task: Omit<Task, '_id'>) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    setShowForm(false);
    fetchTasks();
  };

  const handleUpdateTask = async (task: Omit<Task, '_id'>) => {
    await fetch(`/api/tasks/${editingTask?._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    setEditingTask(undefined);
    fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTasks();
  };

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'Pending').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    completed: tasks.filter(task => task.status === 'Done').length,
    dueToday: tasks.filter(task => {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate.split('T')[0] === today;
    }).length,
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget as HTMLElement;
    column.classList.add('bg-opacity-70');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const column = e.currentTarget as HTMLElement;
    column.classList.remove('bg-opacity-70');
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const column = e.currentTarget as HTMLElement;
    column.classList.remove('bg-opacity-70');
    
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId);
    
    if (task && task.status !== newStatus) {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      fetchTasks();
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Welcome to TaskFlow</h1>
            <p className="text-base md:text-lg text-indigo-100 mb-6 md:mb-8">
              Stay organized and boost your productivity with our intuitive task management system.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto bg-white text-indigo-600 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center md:justify-start gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Task
            </button>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{taskStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{taskStats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{taskStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Today</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{taskStats.dueToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">Task Board</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {(['Pending', 'In Progress', 'Done'] as const).map((status) => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
              className={`
                rounded-xl p-4 transition-colors duration-200 min-w-0 overflow-hidden
                ${status === 'Pending' ? 'bg-red-50' : 
                  status === 'In Progress' ? 'bg-yellow-50' : 
                  'bg-green-50'}
              `}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full
                  ${status === 'Pending' ? 'bg-red-500' : 
                    status === 'In Progress' ? 'bg-yellow-500' : 
                    'bg-green-500'}
                `}></div>
                <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
                <span className="text-sm text-gray-500 ml-auto">
                  {tasks.filter(t => t.status === status).length} tasks
                </span>
              </div>
              <div className="space-y-4">
                {tasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={async (taskId, newStatus) => {
                        const task = tasks.find(t => t._id === taskId);
                        if (task) {
                          await handleUpdateTask({ ...task, status: newStatus });
                        }
                      }}
                    />
                  ))}
                {tasks.filter(t => t.status === status).length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md shadow-2xl m-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h2>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(undefined);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
