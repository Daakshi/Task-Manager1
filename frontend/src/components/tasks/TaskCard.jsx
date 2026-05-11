import { useState } from 'react';
import { taskService } from '../../services';
import { getErrorMessage, formatDate, getPriorityColor, isOverdue, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Calendar, ChevronDown, User } from 'lucide-react';
import Spinner from '../common/Spinner';

const STATUSES = ['Todo', 'In Progress', 'Done'];

const TaskCard = ({ task, members, onEdit, onDelete, onStatusChange }) => {
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;
    setChangingStatus(true);
    try {
      const { data: updated } = await taskService.update(task._id, { status: newStatus });
      onStatusChange(updated);
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setDeleting(true);
    try {
      await taskService.delete(task._id);
      onDelete(task._id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  const priorityClass = getPriorityColor(task.priority);
  const overdue = isOverdue(task.dueDate) && task.status !== 'Done';

  return (
    <div className="bg-white border border-slate-100 hover:border-indigo-200 rounded-2xl p-5 group transition-all hover:shadow-md hover:shadow-indigo-100/50 hover:-translate-y-1 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-slate-800 text-sm font-bold leading-tight line-clamp-2 flex-1">{task.title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete task"
          >
            {deleting ? <Spinner size="sm" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4 line-clamp-2">{task.description}</p>
      )}

      {/* Priority badge */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priorityClass.replace('text-', 'text-').replace('border-', 'border-').replace('bg-', 'bg-')}`}>
          {task.priority}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        {/* Due date */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${overdue ? 'text-red-500 bg-red-50 px-2 py-1 rounded-md' : 'text-slate-500'}`}>
          <Calendar size={12} />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Assignee */}
        {task.assignedTo ? (
          <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-full border border-slate-100" title={task.assignedTo.name}>
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm">
              {getInitials(task.assignedTo.name)}
            </div>
            <span className="text-slate-600 text-[11px] font-bold max-w-[70px] truncate">{task.assignedTo.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium px-2 py-1">
            <User size={12} />
            <span>Unassigned</span>
          </div>
        )}
      </div>

      {/* Status change dropdown */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="relative">
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={changingStatus}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer disabled:opacity-50 transition-all hover:bg-slate-100"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {changingStatus ? (
            <Spinner size="sm" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500" />
          ) : (
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
