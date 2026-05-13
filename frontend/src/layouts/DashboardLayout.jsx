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
  { to: '/projects',  icon: FolderOpen,     label: 'Projects'  },
];

const DashboardLayout = ({ children, projects, onProjectCreated }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleCreated = (project) => {
    if (onProjectCreated) onProjectCreated(project);
    navigate(`/projects/${project._id}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="db-root">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════════════════════════════════
          SIDEBAR
      ════════════════════════════════ */}
      <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="db-sidebar-logo">
          <span className="db-logo-text">TaskFlow</span>
          <button className="db-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="db-user-card">
          <div className="db-user-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="db-user-info">
            <p className="db-user-name">{user?.name || 'User'}</p>
            <p className="db-user-role">Product Designer</p>
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

        {/* New Project button */}
        <div className="db-sidebar-bottom">
          <button
            className="db-new-project-btn"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={16} />
            New Project
          </button>

          <div className="db-sidebar-footer-links">
            <Link to="/profile" className="db-footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={16} /> Settings
            </Link>
            <button className="db-footer-link db-footer-link--logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════
          MAIN AREA
      ════════════════════════════════ */}
      <div className="db-main">

        {/* Top bar */}
        <header className="db-topbar">
          <button className="db-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div style={{ flex: 1 }} />
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
