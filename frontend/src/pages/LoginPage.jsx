import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import '../landing.css';



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
      <div className="lp-blob lp-blob-3" aria-hidden />

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
            {['Privacy Policy','Terms of Service'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
