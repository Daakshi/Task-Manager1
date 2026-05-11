import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { projectService } from '../services';
import { useEffect } from 'react';
import api from '../services/api';
import { getErrorMessage, getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({ defaultValues: { name: user?.name || '' } });

  const {
    register: regPw,
    handleSubmit: handlePwSubmit,
    formState: { errors: pwErrors },
    watch: watchPw,
    reset: resetPw,
  } = useForm();

  useEffect(() => {
    projectService.getAll().then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const onProfileSave = async (data) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/me', { name: data.name });
      if (setUser) setUser(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSave = async (data) => {
    setSavingPassword(true);
    try {
      await api.put('/auth/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPw();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  const newPw = watchPw('newPassword');

  return (
    <DashboardLayout projects={projects} onProjectCreated={(p) => setProjects((prev) => [p, ...prev])}>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Profile Settings</h1>
          <p className="text-gray-400 text-sm">Manage your account information and security</p>
        </div>

        {/* Avatar card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-900/40 flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Active account</span>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <form
          onSubmit={handleProfileSubmit(onProfileSave)}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
              <User size={16} className="text-violet-400" />
            </div>
            <h3 className="text-white font-semibold">Personal Information</h3>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Full Name
              </label>
              <input
                {...regProfile('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                type="text"
                placeholder="Your full name"
                className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                  profileErrors.name ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {profileErrors.name && (
                <p className="text-red-400 text-xs mt-1">{profileErrors.name.message}</p>
              )}
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-9 pr-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-5 flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-600/20"
          >
            <Save size={15} />
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        {/* Password form */}
        <form
          onSubmit={handlePwSubmit(onPasswordSave)}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-amber-400" />
            </div>
            <h3 className="text-white font-semibold">Change Password</h3>
          </div>

          <div className="space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  {...regPw('currentPassword', { required: 'Current password is required' })}
                  type={showCurrentPw ? 'text' : 'password'}
                  placeholder="Your current password"
                  className={`w-full bg-gray-800 border rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                    pwErrors.currentPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwErrors.currentPassword && (
                <p className="text-red-400 text-xs mt-1">{pwErrors.currentPassword.message}</p>
              )}
            </div>

            {/* New password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  {...regPw('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="New password (min 6 chars)"
                  className={`w-full bg-gray-800 border rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                    pwErrors.newPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwErrors.newPassword && (
                <p className="text-red-400 text-xs mt-1">{pwErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  {...regPw('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (v) => v === newPw || 'Passwords do not match',
                  })}
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`w-full bg-gray-800 border rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                    pwErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{pwErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-5 flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-600/20"
          >
            <Shield size={15} />
            {savingPassword ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
