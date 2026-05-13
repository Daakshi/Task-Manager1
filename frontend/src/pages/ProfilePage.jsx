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
  User, Mail, Lock, Eye, EyeOff,
  Shield, Check, Camera, ArrowLeft,
  Sparkles, KeyRound, BadgeCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── scoped styles ─────────────────────────────────── */
const S = {
  page: {
    minHeight: '100%',
    background: 'linear-gradient(135deg,#f0f1fb 0%,#e8eaff 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  // Hero banner
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #635BFF 0%, #8C52FF 55%, #c084fc 100%)',
    padding: '48px 40px 80px',
    overflow: 'hidden',
  },
  heroOrb1: {
    position: 'absolute', top: -60, right: -60,
    width: 240, height: 240, borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  heroOrb2: {
    position: 'absolute', bottom: -80, left: -40,
    width: 300, height: 300, borderRadius: '50%',
    background: 'rgba(140,82,255,0.3)', filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  heroGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  heroInner: {
    position: 'relative', zIndex: 2,
    maxWidth: 860, margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: 28,
  },
  avatarRing: {
    position: 'relative', flexShrink: 0,
  },
  avatar: {
    width: 96, height: 96,
    borderRadius: 24,
    background: 'linear-gradient(135deg,#fbbf24,#f97316)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 34, fontWeight: 900, color: '#fff',
    border: '3px solid rgba(255,255,255,0.4)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    letterSpacing: -1,
  },
  cameraBtn: {
    position: 'absolute', bottom: -8, right: -8,
    width: 30, height: 30, borderRadius: '50%',
    background: '#fff', border: '2px solid #e8eaf6',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#635BFF', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
  heroText: { flex: 1 },
  heroName: {
    fontSize: 30, fontWeight: 900, color: '#fff',
    letterSpacing: -0.75, margin: '0 0 4px',
    textShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  heroEmail: {
    fontSize: 15, color: 'rgba(255,255,255,0.8)',
    margin: '0 0 14px', fontWeight: 500,
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 999, padding: '5px 14px',
    fontSize: 12, fontWeight: 700, color: '#fff',
  },
  heroDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px #4ade80',
  },
  heroBack: {
    position: 'absolute', top: 20, right: 24, zIndex: 10,
    width: 36, height: 36, borderRadius: 10,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', cursor: 'pointer',
    transition: 'background 0.2s',
  },
  // Content area
  content: {
    maxWidth: 860, margin: '-44px auto 0',
    padding: '0 24px 48px',
    position: 'relative', zIndex: 5,
  },
  // Stat pills row
  statsRow: {
    display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
  },
  statPill: {
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: 14, padding: '12px 20px',
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: '0 4px 20px rgba(99,91,255,0.08)',
    flex: 1, minWidth: 140,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  statVal: { fontSize: 14, fontWeight: 800, color: '#0f172a' },
  // Cards
  card: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.9)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(99,91,255,0.06), 0 1px 0 rgba(255,255,255,0.8) inset',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '18px 28px',
    borderBottom: '1px solid rgba(99,91,255,0.07)',
    background: 'rgba(248,249,255,0.6)',
  },
  cardIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: -0.3 },
  cardBody: { padding: '28px 28px' },
  // Form
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: '#f8faff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12, fontSize: 14, fontWeight: 500,
    color: '#0f172a', padding: '11px 14px 11px 42px',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputDisabled: {
    background: '#f1f2fb', color: '#94a3b8', cursor: 'not-allowed',
  },
  eyeBtn: {
    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#94a3b8', display: 'flex', alignItems: 'center',
    transition: 'color 0.2s', padding: 0,
  },
  hint: { fontSize: 11, color: '#94a3b8', marginTop: 6, fontStyle: 'italic' },
  errorText: { fontSize: 11, color: '#ef4444', marginTop: 5, fontWeight: 600 },
  divider: { height: 1, background: 'rgba(99,91,255,0.08)', margin: '24px 0' },
  saveBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'linear-gradient(135deg,#635BFF,#8C52FF)',
    color: '#fff', fontSize: 14, fontWeight: 700,
    border: 'none', borderRadius: 12, padding: '11px 28px',
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 16px rgba(99,91,255,0.35)',
    transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
  },
};

/* ─── ProfilePage ────────────────────────────────────── */
const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw]         = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const { register: regProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } =
    useForm({ defaultValues: { name: user?.name || '' } });

  const { register: regPw, handleSubmit: handlePwSubmit, formState: { errors: pwErrors }, watch: watchPw, reset: resetPw } =
    useForm();

  useEffect(() => {
    projectService.getAll().then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const onProfileSave = async (data) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/me', { name: data.name });
      if (setUser) setUser(res.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSavingProfile(false); }
  };

  const onPasswordSave = async (data) => {
    setSavingPassword(true);
    try {
      await api.put('/auth/me/password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      resetPw();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSavingPassword(false); }
  };

  const newPw = watchPw('newPassword');
  const memberSince = new Date().getFullYear();

  return (
    <DashboardLayout projects={projects} onProjectCreated={(p) => setProjects((prev) => [p, ...prev])}>
      <div style={S.page}>

        {/* ── Hero Banner ── */}
        <div style={S.hero}>
          <div style={S.heroGrid} aria-hidden />
          <div style={S.heroOrb1} aria-hidden />
          <div style={S.heroOrb2} aria-hidden />

          {/* Back button */}
          <button style={S.heroBack} onClick={() => navigate(-1)} title="Go back">
            <ArrowLeft size={18} />
          </button>

          <div style={S.heroInner}>
            {/* Avatar */}
            <div style={S.avatarRing}>
              <div style={S.avatar}>{getInitials(user?.name)}</div>
              <div style={S.cameraBtn}><Camera size={13} /></div>
            </div>

            {/* Info */}
            <div style={S.heroText}>
              <h1 style={S.heroName}>{user?.name || 'Your Name'}</h1>
              <p style={S.heroEmail}>{user?.email || 'your@email.com'}</p>
              <div style={S.heroBadge}>
                <div style={S.heroDot} />
                Active Account
              </div>
            </div>

            {/* Sparkle */}
            <Sparkles size={22} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
          </div>
        </div>

        {/* ── Content ── */}
        <div style={S.content}>

          {/* Stat pills */}
          <div style={S.statsRow}>
            <div style={S.statPill}>
              <div style={{ ...S.statIcon, background: '#ede9fe' }}>
                <BadgeCheck size={18} style={{ color: '#635BFF' }} />
              </div>
              <div>
                <div style={S.statLabel}>Member Since</div>
                <div style={S.statVal}>{memberSince}</div>
              </div>
            </div>
            <div style={S.statPill}>
              <div style={{ ...S.statIcon, background: '#fce7f3' }}>
                <User size={18} style={{ color: '#ec4899' }} />
              </div>
              <div>
                <div style={S.statLabel}>Projects</div>
                <div style={S.statVal}>{projects.length}</div>
              </div>
            </div>
            <div style={S.statPill}>
              <div style={{ ...S.statIcon, background: '#d1fae5' }}>
                <Shield size={18} style={{ color: '#10b981' }} />
              </div>
              <div>
                <div style={S.statLabel}>Security</div>
                <div style={S.statVal}>Protected</div>
              </div>
            </div>
          </div>

          {/* ── Personal Information Card ── */}
          <form onSubmit={handleProfileSubmit(onProfileSave)}>
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ ...S.cardIconWrap, background: '#ede9fe' }}>
                  <User size={16} style={{ color: '#635BFF' }} />
                </div>
                <div>
                  <div style={S.cardTitle}>Personal Information</div>
                </div>
              </div>

              <div style={S.cardBody}>
                <div style={S.formGrid}>
                  {/* Full Name */}
                  <div>
                    <label style={S.label}>Full Name</label>
                    <div style={S.inputWrap}>
                      <User size={15} style={S.inputIcon} />
                      <input
                        {...regProfile('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'At least 2 characters' },
                        })}
                        type="text"
                        placeholder="Your full name"
                        style={{ ...S.input, ...(profileErrors.name ? { borderColor: '#ef4444' } : {}) }}
                        onFocus={e => { e.target.style.borderColor = '#635BFF'; e.target.style.boxShadow = '0 0 0 3px rgba(99,91,255,0.12)'; }}
                        onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    {profileErrors.name && <p style={S.errorText}>{profileErrors.name.message}</p>}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label style={S.label}>Email Address</label>
                    <div style={S.inputWrap}>
                      <Mail size={15} style={S.inputIcon} />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        style={{ ...S.input, ...S.inputDisabled }}
                      />
                    </div>
                    <p style={S.hint}>Email cannot be changed without contacting support.</p>
                  </div>
                </div>

                <div style={S.divider} />

                <button
                  type="submit"
                  disabled={savingProfile}
                  style={{ ...S.saveBtn, opacity: savingProfile ? 0.65 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,91,255,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,91,255,0.35)'; }}
                >
                  <Check size={15} />
                  {savingProfile ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>

          {/* ── Change Password Card ── */}
          <form onSubmit={handlePwSubmit(onPasswordSave)}>
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ ...S.cardIconWrap, background: '#fef3c7' }}>
                  <KeyRound size={16} style={{ color: '#d97706' }} />
                </div>
                <div>
                  <div style={S.cardTitle}>Change Password</div>
                </div>
              </div>

              <div style={S.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 520 }}>

                  {/* Current Password */}
                  <div>
                    <label style={S.label}>Current Password</label>
                    <div style={S.inputWrap}>
                      <Lock size={15} style={S.inputIcon} />
                      <input
                        {...regPw('currentPassword', { required: 'Current password is required' })}
                        type={showCurrentPw ? 'text' : 'password'}
                        placeholder="Your current password"
                        style={{ ...S.input, paddingRight: 44, ...(pwErrors.currentPassword ? { borderColor: '#ef4444' } : {}) }}
                        onFocus={e => { e.target.style.borderColor = '#635BFF'; e.target.style.boxShadow = '0 0 0 3px rgba(99,91,255,0.12)'; }}
                        onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button type="button" style={S.eyeBtn} onClick={() => setShowCurrentPw(!showCurrentPw)}>
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.currentPassword && <p style={S.errorText}>{pwErrors.currentPassword.message}</p>}
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={S.label}>New Password</label>
                    <div style={S.inputWrap}>
                      <Lock size={15} style={S.inputIcon} />
                      <input
                        {...regPw('newPassword', {
                          required: 'New password is required',
                          minLength: { value: 6, message: 'At least 6 characters' },
                        })}
                        type={showNewPw ? 'text' : 'password'}
                        placeholder="New password (min. 6 characters)"
                        style={{ ...S.input, paddingRight: 44, ...(pwErrors.newPassword ? { borderColor: '#ef4444' } : {}) }}
                        onFocus={e => { e.target.style.borderColor = '#635BFF'; e.target.style.boxShadow = '0 0 0 3px rgba(99,91,255,0.12)'; }}
                        onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button type="button" style={S.eyeBtn} onClick={() => setShowNewPw(!showNewPw)}>
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.newPassword && <p style={S.errorText}>{pwErrors.newPassword.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={S.label}>Confirm New Password</label>
                    <div style={S.inputWrap}>
                      <Lock size={15} style={S.inputIcon} />
                      <input
                        {...regPw('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (v) => v === newPw || 'Passwords do not match',
                        })}
                        type={showConfirmPw ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        style={{ ...S.input, paddingRight: 44, ...(pwErrors.confirmPassword ? { borderColor: '#ef4444' } : {}) }}
                        onFocus={e => { e.target.style.borderColor = '#635BFF'; e.target.style.boxShadow = '0 0 0 3px rgba(99,91,255,0.12)'; }}
                        onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button type="button" style={S.eyeBtn} onClick={() => setShowConfirmPw(!showConfirmPw)}>
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.confirmPassword && <p style={S.errorText}>{pwErrors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div style={S.divider} />

                <button
                  type="submit"
                  disabled={savingPassword}
                  style={{ ...S.saveBtn, background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 4px 16px rgba(217,119,6,0.35)', opacity: savingPassword ? 0.65 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  <Shield size={15} />
                  {savingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
