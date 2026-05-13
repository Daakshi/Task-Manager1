import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import '../landing.css';



const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Grid bg */}
      <div className="lp-grid-bg" aria-hidden />
      <div className="lp-blob lp-blob-1" aria-hidden />
      <div className="lp-blob lp-blob-2" aria-hidden />
      <div className="lp-blob lp-blob-3" aria-hidden />

      {/* ── Navbar ── */}
      <header className="lp-header">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo" style={{ textDecoration: 'none' }}>TaskFlow</Link>
          <nav className="lp-nav-links">
          </nav>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-btn-ghost">Login</Link>
            <Link to="/signup" className="lp-btn-primary lp-nav-link--active">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="auth-main">
        <div className="auth-card">

          {/* Heading */}
          <div className="auth-heading">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join TaskFlow to manage your projects</p>
          </div>

          {/* Toggle */}
          <div className="auth-toggle">
            <Link to="/login" className="auth-toggle-btn">Login</Link>
            <Link to="/signup" className="auth-toggle-btn auth-toggle-btn--active">Sign Up</Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'At least 2 characters' },
                  })}
                  placeholder="John Doe"
                  className="auth-input"
                />
              </div>
              {errors.name && <p className="auth-error">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                  type="email"
                  placeholder="you@taskflow.com"
                  className="auth-input"
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="auth-input auth-input--password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="auth-eye-btn"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="auth-submit-btn" style={{ marginTop: 8 }}>
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">Sign in</Link>
          </p>
        </div>

        <p className="auth-ssl">🔒 Secure SSL Encrypted Connection</p>
      </main>

      {/* ── Footer ── */}
      <footer className="auth-footer">
        <div className="auth-footer-inner">
          <div className="auth-footer-left">
            <span className="lp-logo">TaskFlow</span>
            <span className="auth-footer-copy">© 2024 TaskFlow Inc. All rights reserved.</span>
          </div>
          <div className="auth-footer-links">
            {['Privacy Policy','Terms of Service'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;
