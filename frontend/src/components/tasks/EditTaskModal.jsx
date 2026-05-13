import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { taskService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import { Save } from 'lucide-react';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Todo', 'In Progress', 'Done'];

const EditTaskModal = ({ isOpen, onClose, task, members, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        assignedTo: data.assignedTo || null,
        dueDate: data.dueDate || null,
      };
      const { data: updated } = await taskService.update(task._id, payload);
      toast.success('Task updated!');
      onUpdated(updated);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="db-form-group">
          <label className="db-form-label">
            Title <span className="db-form-label-req">*</span>
          </label>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
            className="db-form-input"
          />
          {errors.title && <p className="db-form-error">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="db-form-group">
          <label className="db-form-label">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="db-form-textarea"
          />
        </div>

        {/* Priority & Status */}
        <div className="db-form-row">
          <div>
            <label className="db-form-label">Priority</label>
            <select
              {...register('priority')}
              className="db-form-select"
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="db-form-label">Status</label>
            <select
              {...register('status')}
              className="db-form-select"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="db-form-row">
          <div>
            <label className="db-form-label">Assign To</label>
            <select
              {...register('assignedTo')}
              className="db-form-select"
            >
              <option value="">Unassigned</option>
              {members?.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="db-form-label">Due Date</label>
            <input
              {...register('dueDate')}
              type="date"
              className="db-form-input [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="db-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="db-btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="db-btn-submit"
          >
            {loading ? <Spinner size="sm" /> : <Save size={16} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
