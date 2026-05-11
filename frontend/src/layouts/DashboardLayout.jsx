import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import {
  CheckSquare,
  LayoutDashboard,
  FolderOpen,
  LogOut,
  Sun,
  Moon,
  Plus,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { getInitials } from '../utils/helpers';

const DashboardLayout = ({ children, projects, onProjectCreated }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreated = (project) => {
    if (onProjectCreated) onProjectCreated(project);
    navigate(`/projects/${project._id}`);
  };

  return (
    <div className="flex h-screen app-bg text-slate-800 overflow-hidden font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 glass border-r border-white/60 flex flex-col transition-transform duration-300 m-4 rounded-3xl overflow-hidden shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/30 bg-white/40">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <CheckSquare size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">TaskFlow</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-slate-500 hover:text-slate-800 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium mb-2 transition-all ${
              location.pathname === '/dashboard'
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {/* Projects section */}
          <div className="mt-6 mb-2">
            <div className="flex items-center justify-between px-2 mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</span>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="w-6 h-6 rounded-full bg-white/50 hover:bg-white text-slate-600 hover:text-black flex items-center justify-center transition-all shadow-sm"
                title="New project"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-1">
              {projects && projects.length > 0 ? (
                projects.map((p) => (
                  <Link
                    key={p._id}
                    to={`/projects/${p._id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all group ${
                      location.pathname === `/projects/${p._id}`
                        ? 'bg-white shadow-sm text-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <FolderOpen size={16} className="flex-shrink-0" />
                    <span className="truncate flex-1 font-medium">{p.name}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))
              ) : (
                <p className="text-slate-500 text-xs px-4 py-2 italic">No projects yet</p>
              )}
            </div>
          </div>
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-white/30 p-4 space-y-2 bg-white/20">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/60 shadow-sm border border-white/40">
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 text-sm font-bold truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate font-medium">{user?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-4 py-4 pr-4">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-8 py-5 glass border border-white/60 rounded-3xl mb-4 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors bg-white/50 p-2 rounded-xl"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-md"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default DashboardLayout;
