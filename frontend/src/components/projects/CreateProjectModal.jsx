import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { projectService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import { FolderPlus } from 'lucide-react';
import '../../dashboard.css';

const CreateProjectModal = ({ isOpen, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: project } = await projectService.create(data);
      toast.success(`Project "${project.name}" created!`);
      reset();
      onCreated(project);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="db-form-group">
          <label className="db-form-label">
            Project Name <span className="db-form-label-req">*</span>
          </label>
          <input
            {...register('name', {
              required: 'Project name is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
            placeholder="e.g. Marketing Campaign"
            className="db-form-input"
          />
          {errors.name && <p className="db-form-error">{errors.name.message}</p>}
        </div>

        <div className="db-form-group">
          <label className="db-form-label">Description</label>
          <textarea
            {...register('description')}
            placeholder="Describe your project..."
            className="db-form-textarea"
          />
        </div>

        <div className="db-modal-actions">
          <button type="button" onClick={onClose} className="db-btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="db-btn-submit">
            {loading ? <Spinner size="sm" /> : <FolderPlus size={16} />}
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
        
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
