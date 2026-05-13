import { useState, useEffect } from 'react';
import '../dashboard.css';
import { Link } from 'react-router-dom';
import { projectService, taskService } from '../services';
import { getErrorMessage } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  MoreHorizontal, Calendar, Users, Filter,
  History, FolderOpen, Plus,
} from 'lucide-react';

/* ── helpers ── */
const CATEGORY_COLORS = {
  Development: { bg: '#ede9fe', text: '#7c3aed', border: '#7c3aed' },
  Marketing:   { bg: '#fce7f3', text: '#be185d', border: '#ec4899' },
  Research:    { bg: '#d1fae5', text: '#065f46', border: '#14b8a6' },
  Design:      { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  default:     { bg: '#e0e7ff', text: '#3730a3', border: '#635BFF' },
};

const PRIORITY_COLORS = {
  High:   { background: '#fee2e2', color: '#dc2626' },
  Medium: { background: '#fef3c7', color: '#b45309' },
  Low:    { background: '#d1fae5', color: '#065f46' },
  default:{ background: '#e0f2fe', color: '#0284c7' },
};

const PROGRESS_COLORS = [
  'linear-gradient(90deg,#635BFF,#a855f7)',
  'linear-gradient(90deg,#ec4899,#f97316)',
  'linear-gradient(90deg,#14b8a6,#06b6d4)',
];



/* ── Project Card ── */
const ProjectCard = ({ project, index }) => {
  const cats = ['Development','Marketing','Research','Design'];
  const cat  = cats[index % cats.length];
  const c    = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;
  const prog = [75, 32, 90][index % 3];

  return (
    <Link to={`/projects/${project._id}`} className="db-project-card" style={{ '--accent': c.border }}>
      <div className="db-project-card-top">
        <span className="db-project-badge" style={{ background: c.bg, color: c.text }}>{cat}</span>
        <button className="db-project-menu" onClick={e => e.preventDefault()}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h3 className="db-project-title">{project.name}</h3>
      <p className="db-project-desc">
        {project.description || 'No description provided for this project yet.'}
      </p>

      <div className="db-project-progress">
        <div className="db-progress-label">
          <span>Progress</span>
          <span>{prog}%</span>
        </div>
        <div className="db-progress-track">
          <div
            className="db-progress-fill"
            style={{ width: `${prog}%`, background: PROGRESS_COLORS[index % 3] }}
          />
        </div>
      </div>

      <div className="db-project-footer">
        <div className="db-member-avatars">
          {project.members.slice(0, 3).map((m, i) => (
            <div key={i} className="db-member-avatar" style={{ zIndex: 10 - i }}>
              {(m.name || m.email || 'U')[0].toUpperCase()}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="db-member-avatar db-member-avatar--more">
              +{project.members.length - 3}
            </div>
          )}
        </div>
        <div className="db-project-date">
          <Calendar size={12} />
          <span>Oct 24</span>
        </div>
      </div>
    </Link>
  );
};

/* ── Empty state ── */
const EmptyProjects = () => (
  <div className="db-empty">
    <div className="db-empty-icon"><FolderOpen size={28} /></div>
    <h3>No projects yet</h3>
    <p>Create your first project to start organising tasks with your team.</p>
  </div>
);

/* ══════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════ */
const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [checked, setChecked]   = useState({});

  useEffect(() => { 
    fetchProjects(); 
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await taskService.getMyTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch user tasks', err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleProjectCreated = (p) => setProjects(prev => [p, ...prev]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  return (
    <DashboardLayout projects={projects} onProjectCreated={handleProjectCreated}>
      <div className="db-page">

        {/* ── Greeting ── */}
        <div className="db-greeting">
          <div>
            <h1 className="db-greeting-h1">{greeting}, {firstName}.</h1>
            <p className="db-greeting-sub">Here is what's happening with your projects today.</p>
          </div>
        </div>

        {/* ── Active Projects ── */}
        <section className="db-section">
          <div className="db-section-header">
            <h2 className="db-section-title">Active Projects</h2>
            <Link to="/projects" className="db-view-all">View All</Link>
          </div>

          {loading ? (
            <div className="db-loading"><Spinner size="lg" /></div>
          ) : projects.length === 0 ? (
            <EmptyProjects />
          ) : (
            <div className="db-projects-grid">
              {projects.slice(0, 3).map((p, i) => (
                <ProjectCard key={p._id} project={p} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── Tasks Due Soon ── */}
        <section className="db-section" style={{ marginTop: 8 }}>
          <div className="db-section-header">
            <h2 className="db-section-title">Tasks Due Soon</h2>
            <button className="db-icon-action"><Filter size={16}/></button>
          </div>

          {tasksLoading ? (
            <div className="db-loading"><Spinner size="md" /></div>
          ) : tasks.length === 0 ? (
            <div className="db-empty">
              <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="db-tasks-panel" style={{ padding: 0 }}>
              <div className="db-task-list">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task._id} className="db-task-row" style={{ padding: '14px 20px' }}>
                    <div className="db-task-check" />
                    <div className="db-task-info">
                      <p className="db-task-title">{task.title}</p>
                      <p className="db-task-meta">
                        {task.project?.name || 'No Project'} •{' '}
                        {task.dueDate
                          ? `Due ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : 'No Date'}
                      </p>
                    </div>
                    <span
                      className="db-priority-badge"
                      style={{
                        ...(PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.default),
                      }}
                    >
                      {task.priority || 'Medium'}
                    </span>
                  </div>
                ))}
              </div>
              {tasks.length > 4 && (
                <button className="db-show-more">
                  Show {tasks.length - 4} more tasks
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="db-footer">
          <span className="db-footer-logo">TaskFlow</span>
          <span className="db-footer-copy">© 2024 TaskFlow Inc. All rights reserved.</span>
          <div className="db-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </footer>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
