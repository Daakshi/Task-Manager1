import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { projectService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import { UserPlus } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const AddMemberModal = ({ isOpen, onClose, project, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: updated } = await projectService.addMember(project._id, data.email);
      toast.success('Member added successfully!');
      reset();
      onUpdated(updated);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <div className="space-y-6">
        {/* Current members */}
        <div>
          <p className="db-form-label mb-3">Current Members ({project?.members?.length || 0})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {project?.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-width-0">
                  <p className="text-white text-sm font-semibold truncate">{member.name}</p>
                  <p className="text-gray-400 text-xs truncate">{member.email}</p>
                </div>
                {member._id === project?.owner?._id && (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold uppercase tracking-wider">Owner</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add member form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="db-form-group">
            <label className="db-form-label">
              Invite by Email <span className="db-form-label-req">*</span>
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              type="email"
              placeholder="colleague@example.com"
              className="db-form-input"
            />
            {errors.email && <p className="db-form-error">{errors.email.message}</p>}
          </div>

          <div className="db-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="db-btn-cancel"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="db-btn-submit"
            >
              {loading ? <Spinner size="sm" /> : <UserPlus size={16} />}
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddMemberModal;
