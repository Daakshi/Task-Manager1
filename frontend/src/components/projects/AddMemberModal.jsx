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
      <div className="space-y-5">
        {/* Current members */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-3">Current Members ({project?.members?.length || 0})</p>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {project?.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-2.5 bg-gray-800 rounded-lg"
              >
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {getInitials(member.name)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{member.name}</p>
                  <p className="text-gray-500 text-xs">{member.email}</p>
                </div>
                {member._id === project?.owner?._id && (
                  <span className="ml-auto text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-600/30">Owner</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add member form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Invite by Email <span className="text-red-400">*</span>
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              type="email"
              placeholder="colleague@example.com"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
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
