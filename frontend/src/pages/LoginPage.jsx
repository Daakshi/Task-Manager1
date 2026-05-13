import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import '../landing.css';

/* ── Google SVG ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ── Apple SVG ── */
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6 9.8c-.1-2.4 2-3.6 2.1-3.7-1.1-1.6-2.8-1.9-3.4-1.9-1.4-.1-2.8.8-3.6.8-.8 0-1.9-.8-3-.8-1.3 0-2.6.7-3.3 1.9C3.8 8.8 3 12 4.4 14.4c.7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.6-.7 1.2 0 1.6.7 2.6.7 1.1 0 1.8-1 2.5-2 .8-1.2 1.2-2.3 1.2-2.4-.1-.1-2.1-.8-2.2-3.1zM11.9 4.1c.6-.7 1-1.7.9-2.7-1 0-2 .6-2.5 1.3-.5.6-.9 1.6-.8 2.5.9.1 1.9-.4 2.4-1.1z"/>
  </svg>
);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back! 👋');
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

      {/* ── Navbar (same as landing) ── */}
      <header className="lp-header">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo" style={{ textDecoration: 'none' }}>TaskFlow</Link>
          <nav className="lp-nav-links">
          </nav>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-btn-ghost">Login</Link>
            <Link to="/signup" className="lp-btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="auth-main">
        <div className="auth-card">

          {/* Heading */}
          <div className="auth-heading">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Streamline your workflow with TaskFlow</p>
          </div>

          {/* Toggle */}
          <div className="auth-toggle">
            <Link to="/login" className="auth-toggle-btn auth-toggle-btn--active">Login</Link>
            <Link to="/signup" className="auth-toggle-btn">Sign Up</Link>
          </div>

          {/* Social */}
          <div className="auth-social-row">
            <button className="auth-social-btn">
              <GoogleIcon /> Google
            </button>
            <button className="auth-social-btn">
              <AppleIcon /> Apple
            </button>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">OR EMAIL</span>
            <span className="auth-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                  placeholder="alex@clarityflow.com"
                  className="auth-input"
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                <a href="#" className="auth-forgot">Forgot Password?</a>
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
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

            {/* Remember */}
            <div className="auth-remember">
              <input type="checkbox" id="keep" className="auth-checkbox" />
              <label htmlFor="keep" className="auth-remember-label">Keep me logged in</label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-switch-link">Create Free Account</Link>
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
            {['Privacy Policy','Terms of Service','Cookie Settings','Contact Us'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
