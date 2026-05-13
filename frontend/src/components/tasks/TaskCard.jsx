import { useState } from 'react';
import { taskService } from '../../services';
import { getErrorMessage, formatDate, getPriorityColor, isOverdue, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Calendar, ChevronDown, User } from 'lucide-react';
import Spinner from '../common/Spinner';

const STATUSES = ['Todo', 'In Progress', 'Done'];

const PRIORITY_STYLES = {
  High:   { bg: '#fee2e2', color: '#dc2626', dot: '#dc2626' },
  Medium: { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' },
  Low:    { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
};

const STATUS_STYLES = {
  'Todo':        { bg: '#ede9fe', color: '#7c3aed' },
  'In Progress': { bg: '#fef3c7', color: '#b45309' },
  'Done':        { bg: '#d1fae5', color: '#065f46' },
};

const TaskCard = ({ task, members, onEdit, onDelete, onStatusChange, onDragStart }) => {
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;
    setChangingStatus(true);
    try {
      const { data: updated } = await taskService.update(task._id, { status: newStatus });
      onStatusChange(updated);
      toast.success(`Moved to "${newStatus}"`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
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

  const overdue = isOverdue(task.dueDate) && task.status !== 'Done';
  const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const ss = STATUS_STYLES[task.status]   || STATUS_STYLES['Todo'];

  return (
    <div 
      className="tc-card cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
    >
      {/* Priority + actions */}
      <div className="tc-top">
        <span className="tc-priority-badge" style={{ background: ps.bg, color: ps.color }}>
          <span className="tc-priority-dot" style={{ background: ps.dot }} />
          {task.priority}
        </span>
        <div className="tc-actions">
          <button className="tc-action-btn" onClick={() => onEdit(task)} title="Edit">
            <Pencil size={13} />
          </button>
          <button className="tc-action-btn tc-action-btn--del" onClick={handleDelete} disabled={deleting} title="Delete">
            {deleting ? <Spinner size="sm" /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`tc-title ${task.status === 'Done' ? 'tc-title--done' : ''}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="tc-desc">{task.description}</p>
      )}

      {/* Footer */}
      <div className="tc-footer">
        {/* Due date */}
        <div className={`tc-date ${overdue ? 'tc-date--overdue' : ''}`}>
          <Calendar size={11} />
          <span>{formatDate(task.dueDate) || '—'}</span>
        </div>

        {/* Assignee */}
        {task.assignedTo ? (
          <div className="tc-assignee" title={task.assignedTo.name}>
            <div className="tc-assignee-avatar">
              {getInitials(task.assignedTo.name)}
            </div>
            <span className="tc-assignee-name">{task.assignedTo.name}</span>
          </div>
        ) : (
          <div className="tc-unassigned">
            <User size={11} /> Unassigned
          </div>
        )}
      </div>

      {/* Status selector */}
      <div className="tc-status-wrap">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={changingStatus}
          className="tc-status-select"
          style={{ color: ss.color, background: ss.bg }}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {changingStatus
          ? <Spinner size="sm" className="tc-status-spinner" />
          : <ChevronDown size={12} className="tc-status-caret" />
        }
      </div>
    </div>
  );
};

export default TaskCard;
