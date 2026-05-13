import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { taskService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import { Plus } from 'lucide-react';
import '../../dashboard.css';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Todo', 'In Progress', 'Review', 'Completed'];

const CreateTaskModal = ({ isOpen, onClose, projectId, members, onCreated, defaultStatus }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      priority: 'Medium',
      status: defaultStatus || 'Todo',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        project: projectId,
        assignedTo: data.assignedTo || null,
        dueDate: data.dueDate || null,
      };
      const { data: task } = await taskService.create(payload);
      toast.success('Task created!');
      reset();
      onCreated(task);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
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
            placeholder="Task title..."
            className="db-form-input"
          />
          {errors.title && <p className="db-form-error">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="db-form-group">
          <label className="db-form-label">Description</label>
          <textarea
            {...register('description')}
            placeholder="Add a description..."
            className="db-form-textarea"
          />
        </div>

        {/* Priority & Status row */}
        <div className="db-form-row">
          <div>
            <label className="db-form-label">Priority</label>
            <select {...register('priority')} className="db-form-select">
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="db-form-label">Status</label>
            <select {...register('status')} className="db-form-select">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignee & Due Date row */}
        <div className="db-form-row">
          <div>
            <label className="db-form-label">Assign To</label>
            <select {...register('assignedTo')} className="db-form-select">
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
              className="db-form-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="db-modal-actions">
          <button type="button" onClick={onClose} className="db-btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="db-btn-submit">
            {loading ? <Spinner size="sm" /> : <Plus size={16} />}
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateTaskModal;
