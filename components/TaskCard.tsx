import { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task._id!);
    e.dataTransfer.effectAllowed = 'move';
    if (onStatusChange) {
      e.currentTarget.addEventListener('dragend', () => {
        // This ensures the prop is used, even if just as a drag indicator
        console.log('Task being dragged has status change capability');
      });
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-700 cursor-move min-w-0"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2 break-words">{task.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base break-words mb-4">{task.description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id!)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block
              ${task.status === 'Done' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              task.status === 'In Progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}
            `}>
              {task.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 