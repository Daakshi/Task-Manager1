import React, { useEffect, useRef } from 'react';
import '../landing.css';
import { Link } from 'react-router-dom';
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
   Feature Card
───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, linkLabel, color }) => {
  const colors = {
    indigo: {
      border: 'rgba(99,102,241,0.15)',
      iconBg: 'rgba(99,102,241,0.12)',
      iconColor: '#6366f1',
      link: '#6366f1',
      linkHover: '#818cf8',
    },
    purple: {
      border: 'rgba(99,102,241,0.15)',
      iconBg: 'rgba(99,102,241,0.12)',
      iconColor: '#6366f1',
      link: '#6366f1',
      linkHover: '#818cf8',
    },
    teal: {
      border: 'rgba(99,102,241,0.15)',
      iconBg: 'rgba(99,102,241,0.12)',
      iconColor: '#6366f1',
      link: '#6366f1',
      linkHover: '#818cf8',
    },
  };
  const c = colors[color] || colors.indigo;

  return (
    <div className="lp-feature-card" style={{ '--card-border': c.border }}>
      <div className="lp-feature-icon" style={{ background: c.iconBg, color: c.iconColor }}>
        <Icon size={24} />
      </div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{desc}</p>
      <a href="#" className="lp-feature-link" style={{ color: c.link }}>
        {linkLabel} <ArrowRight size={16} className="lp-arrow" />
      </a>
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
          <div className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', background: '#BEF264', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: '12px', height: '12px', background: '#000', borderRadius: '2px' }} />
            </div>
            TaskFlow
          </div>

          {/* Nav links removed */}

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

      {/* Hero image removed */}

      {/* ════════════════════════════════════
          FEATURES — matches reference exactly
      ════════════════════════════════════ */}
      <section className="lp-features" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-label">
            <Layers size={14} style={{ marginRight: 8 }} /> Tools for Modern Teams
          </div>
          <h2 className="lp-section-h2">Tools for Modern Teams</h2>
          <p className="lp-section-sub">Streamline your operations with features built for speed and precision in a high-fidelity interface.</p>

          <div className="lp-features-grid">
            <FeatureCard
              icon={Layers}
              title="Project Management"
              desc="Organize complex workflows with layered glass containers that help you visualize progress without the clutter."
              linkLabel="Learn More"
              color="indigo"
            />
            <FeatureCard
              icon={Zap}
              title="Task Management"
              desc="Prioritize with intent. Our focus-first design ensures your most important tasks always take center stage."
              linkLabel="Explore Features"
              color="purple"
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Tracking"
              desc="Live updates synced across every device. Experience zero latency in team collaboration and instant status reflection."
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
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
