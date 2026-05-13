import React, { useEffect, useRef } from 'react';
import '../landing.css';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-dashboard.png';
import {
  Sparkles, ArrowRight, Play, CheckCircle2,
  Layers, Zap, BarChart3, Moon, Share2,
  MoreHorizontal, Star, Users, TrendingUp,
  Shield, Clock, Globe
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Tiny inline SVG icon used in the hero badge
───────────────────────────────────────────── */
const UserIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ─────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────── */
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
};

/* ─────────────────────────────────────────────
   Feature Card
───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, linkLabel, color }) => {
  const colors = {
    indigo: {
      border: 'rgba(99,91,255,0.25)',
      iconBg: '#f0efff',
      iconColor: '#635BFF',
      link: '#635BFF',
      linkHover: '#4f46e5',
    },
    purple: {
      border: 'rgba(168,85,247,0.25)',
      iconBg: '#faf5ff',
      iconColor: '#a855f7',
      link: '#a855f7',
      linkHover: '#7e22ce',
    },
    teal: {
      border: 'rgba(20,184,166,0.25)',
      iconBg: '#f0fdfa',
      iconColor: '#14b8a6',
      link: '#0d9488',
      linkHover: '#0f766e',
    },
  };
  const c = colors[color] || colors.indigo;

  return (
    <div className="lp-feature-card" style={{ '--card-border': c.border }}>
      <div className="lp-feature-icon" style={{ background: c.iconBg, color: c.iconColor }}>
        <Icon size={22} />
      </div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{desc}</p>
      <a href="#" className="lp-feature-link" style={{ color: c.link }}>
        {linkLabel} <ArrowRight size={15} className="lp-arrow" />
      </a>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
const StatCard = ({ target, suffix, label, icon: Icon, color }) => {
  const [count, ref] = useCounter(target);
  return (
    <div className="lp-stat-card" ref={ref}>
      <div className="lp-stat-icon" style={{ color }}>
        <Icon size={20} />
      </div>
      <div className="lp-stat-number" style={{ color }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="lp-stat-label">{label}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const LandingPage = () => {
  return (
    <div className="lp-root">

      {/* ── Subtle grid background ── */}
      <div className="lp-grid-bg" aria-hidden />

      {/* ── Ambient blobs ── */}
      <div className="lp-blob lp-blob-1" aria-hidden />
      <div className="lp-blob lp-blob-2" aria-hidden />
      <div className="lp-blob lp-blob-3" aria-hidden />

      {/* ════════════════════════════════════
          NAVIGATION
      ════════════════════════════════════ */}
      <header className="lp-header">
        <div className="lp-nav-inner">
          {/* Logo */}
          <div className="lp-logo">TaskFlow</div>

          {/* Nav links */}
          <nav className="lp-nav-links">
          </nav>

          {/* Auth buttons */}
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-btn-ghost">Login</Link>
            <Link to="/signup" className="lp-btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-inner">

          {/* Pill badge */}
          <div className="lp-badge">
            <Sparkles size={13} className="lp-badge-icon" />
            Introducing v2.0 with Smart AI Workflows
          </div>

          {/* Heading */}
          <h1 className="lp-hero-h1">
            Master Your Workflow with{' '}
            <span className="lp-hero-accent">Cognitive Clarity</span>
          </h1>

          {/* Sub-text */}
          <p className="lp-hero-sub">
            Experience an ethereal task management environment designed for focus. TaskFlow
            blends high-performance functionality with a dreamlike aesthetic to reduce your
            cognitive load.
          </p>

          {/* CTA buttons */}
          <div className="lp-hero-ctas">
            <Link to="/signup" className="lp-btn-primary lp-btn-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FEATURES — matches reference exactly
      ════════════════════════════════════ */}
      <section className="lp-features" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-label">
            <Layers size={14} style={{ marginRight: 6 }} /> Tools for Modern Teams
          </div>
          <h2 className="lp-section-h2">Tools for Modern Teams</h2>
          <p className="lp-section-sub">Streamline your operations with features built for speed.</p>

          <div className="lp-features-grid">
            <FeatureCard
              icon={Layers}
              title="Project Management"
              desc="Create expansive projects and orchestrate your team members effortlessly with automated permissions."
              linkLabel="Learn More"
              color="indigo"
            />
            <FeatureCard
              icon={Zap}
              title="Task Management"
              desc="Granular control over every task. Create, edit, and delegate responsibilities with natural language processing."
              linkLabel="Explore Features"
              color="purple"
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Tracking"
              desc="Visualize progress through live dashboards. Status updates reflect instantly across the entire ecosystem."
              linkLabel="View Analytics"
              color="teal"
            />
          </div>
        </div>
      </section>





      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <div className="lp-logo lp-footer-logo">TaskFlow</div>
            <p className="lp-footer-copy">© 2024 TaskFlow Inc. All rights reserved.</p>
          </div>

          <div className="lp-footer-links">
            {['Privacy Policy','Terms of Service','Cookie Settings','Contact Us'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>

          <div className="lp-footer-social">
            <a href="#" className="lp-social-btn"><Share2 size={14} /></a>
            <a href="#" className="lp-social-btn"><Sparkles size={14} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
