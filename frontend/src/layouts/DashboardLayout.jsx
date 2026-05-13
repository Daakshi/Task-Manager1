import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import {
  LayoutDashboard, CheckSquare, FolderOpen, Users,
  BarChart2, Settings, HelpCircle, LogOut, Plus,
  Menu, X, Bell, Search,
} from 'lucide-react';
import { getInitials } from '../utils/helpers';
import '../dashboard.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderOpen,      label: 'Projects'  },
  { to: '/due-tasks', icon: CheckSquare,     label: 'Due Tasks' },
  { to: '/activity',  icon: BarChart2,       label: 'Activity Timeline' },
];

const DashboardLayout = ({ children, projects, onProjectCreated }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const handleCreated = (project) => {
    if (onProjectCreated) onProjectCreated(project);
    navigate(`/projects/${project._id}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="db-root">
      {/* Background Blobs & Grid */}
      <div className="db-grid-bg" />
      <div className="db-blob db-blob-1" />
      <div className="db-blob db-blob-2" />
      <div className="db-blob db-blob-3" />

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════════════════════════════════
          SIDEBAR
      ════════════════════════════════ */}
      <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar--open' : ''}`}>

        <div className="db-sidebar-logo">
          <div className="db-logo-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '28px', height: '28px', background: '#BEF264', borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: '10px', height: '10px', background: '#000', borderRadius: '2px' }} />
            </div>
            TaskFlow
          </div>
        </div>

        {/* Nav */}
        <nav className="db-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`db-nav-item ${isActive(to) ? 'db-nav-item--active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom Section */}
        <div className="db-sidebar-bottom">
          <div className="db-sidebar-footer-links">
            <Link to="/profile" className="db-footer-link">
              <Settings size={16} /> Settings
            </Link>
          </div>

          {/* User card at bottom */}
          <div className="db-user-card" style={{ margin: '16px 0 0 0' }}>
            <div className="db-user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="db-user-info">
              <p className="db-user-name">{user?.name || 'User'}</p>
              <p className="db-user-role">{user?.role || 'Member'}</p>
            </div>
            <button className="db-logout-mini" onClick={handleLogout} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════
          MAIN AREA
      ════════════════════════════════ */}
      <div className="db-main">
        {/* Ambient blobs */}
        <div className="lp-blob lp-blob-1" aria-hidden />
        <div className="lp-blob lp-blob-2" aria-hidden />
        <div className="lp-blob lp-blob-3" aria-hidden />

        {/* Top bar */}
        <header className="db-topbar">


          <div className="db-search-wrap">
            <Search size={18} className="db-search-icon" />
            <input type="text" placeholder="Search tasks, projects, people..." className="db-search-input" />
            <span className="db-search-cmd">⌘ K</span>
          </div>

          <div style={{ flex: 1 }} />

          <div className="db-topbar-actions">
            <button className="db-top-icon-btn" onClick={handleLogout}><LogOut size={18} /></button>
            <button
              className="db-new-project-btn-top"
              onClick={() => setCreateModalOpen(true)}
            >
              New Project
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="db-content">
          {children}
        </div>
      </div>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default DashboardLayout;
