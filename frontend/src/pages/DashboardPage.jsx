import { useState, useEffect } from 'react';
import '../dashboard.css';
import { Link } from 'react-router-dom';
import { projectService, taskService } from '../services';
import { getErrorMessage, formatDate } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/common/Spinner';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Filter, ArrowRight, MoreHorizontal, Calendar, FolderOpen
} from 'lucide-react';



/* ── helpers ── */
const CATEGORY_COLORS = {
  Development: { bg: 'rgba(190, 242, 100, 0.15)', text: '#BEF264', border: '#BEF264' },
  Marketing:   { bg: 'rgba(114, 225, 237, 0.15)', text: '#72E1ED', border: '#72E1ED' },
  Research:    { bg: 'rgba(20, 184, 166, 0.2)', text: '#5eead4', border: '#14b8a6' },
  Design:      { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: '#f59e0b' },
  default:     { bg: 'rgba(190, 242, 100, 0.15)', text: '#BEF264', border: '#BEF264' },
};

const PRIORITY_COLORS = {
  High:   { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
  Medium: { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
  Low:    { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
  default:{ background: 'rgba(114, 225, 237, 0.15)', color: '#72E1ED' },
};

const PROGRESS_COLORS = [
  'linear-gradient(90deg, #BEF264, #72E1ED)',
  'linear-gradient(90deg, #72E1ED, #BEF264)',
  'linear-gradient(90deg, #BEF264, #72E1ED)',
];



/* ── Project Card ── */
const ProjectCard = ({ project, index }) => {
  const cats = ['Development','Marketing','Research','Design'];
  const cat  = cats[index % cats.length];
  const c    = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;
  const prog = project.progress || [75, 32, 90][index % 3];

  return (
    <Link to={`/projects/${project._id}`} className="db-project-card" style={{ '--accent': c.border }}>
      {/* Glow Effect */}
      <div className="db-project-card-glow" style={{ background: c.border }} />

      <div className="db-project-card-inner">
        <div className="db-project-card-header">
          <div className="db-project-card-cat">
            <div className="db-cat-dot" style={{ background: c.border }} />
            <span style={{ color: c.text }}>{cat}</span>
          </div>
          <div className="db-project-card-menu">
             <MoreHorizontal size={14} />
          </div>
        </div>

        <div className="db-project-card-body">
          <h3 className="db-project-title">{project.name}</h3>
          <p className="db-project-desc">
            {project.description || 'Elevating the workflow through intelligent task management and real-time collaboration.'}
          </p>
        </div>

        <div className="db-project-card-progress">
          <div className="db-progress-info">
            <span>Project Health</span>
            <span>{prog}%</span>
          </div>
          <div className="db-progress-bar-wrap">
            <div 
              className="db-progress-bar-fill" 
              style={{ width: `${prog}%`, background: `linear-gradient(90deg, ${c.border}, #ffffff)` }} 
            />
          </div>
        </div>

        <div className="db-project-card-footer">
          <div className="db-member-stack">
            {project.members.slice(0, 3).map((m, i) => (
              <div 
                key={i} 
                className="db-stack-item" 
                style={{ 
                  zIndex: 5 - i,
                  background: `linear-gradient(135deg, ${c.border}, #ffffff)`,
                  color: '#000'
                }}
              >
                {(m.name || m.email || 'U')[0].toUpperCase()}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="db-stack-item db-stack-more">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <div className="db-project-date-tag">
            <Calendar size={12} />
            <span>{project.createdAt ? formatDate(project.createdAt) : 'Oct 24'}</span>
          </div>
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

  // Derive dynamic activities from real tasks
  const activities = tasks.slice(0, 5).map(t => ({
    id: t._id,
    type: t.status === 'Done' ? 'completed' : 'updated',
    userName: user?.name || 'User',
    action: t.status === 'Done' ? 'completed' : 'is working on',
    taskName: t.title,
    timestamp: t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    details: t.project?.name || 'TaskFlow'
  }));

  const handleProjectCreated = (p) => setProjects(prev => [p, ...prev]);

  const handleToggleTask = async (taskId) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'Done' } : t));
      toast.success('Task marked as completed! 🎉');
      
      await taskService.update(taskId, { status: 'Done' });
      // Fresh fetch to keep everything synced
      fetchTasks();
    } catch (err) {
      toast.error(getErrorMessage(err));
      fetchTasks(); // Revert on error
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  return (
    <DashboardLayout projects={projects} onProjectCreated={handleProjectCreated}>
      <div className="db-page">

        {/* ── Greeting ── */}
        <div className="db-greeting" style={{ marginBottom: '32px' }}>
          <div>
            <h1 className="db-greeting-h1" style={{ fontSize: '2.4rem' }}>{greeting}, {firstName}.</h1>
            <p className="db-greeting-sub" style={{ fontSize: '1.1rem', opacity: 0.6 }}>
              You have {tasks.filter(t => t.status !== 'Done').length} pending tasks for today.
            </p>
          </div>
        </div>

        {/* ── Grid Row 1: Metrics / Projects ── */}
        <section className="db-section">
          <div className="db-section-header">
            <h2 className="db-section-title">Active Projects</h2>
          </div>

          {loading ? (
            <div className="db-projects-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="db-skeleton-card db-skeleton-anim" />
              ))}
            </div>
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

        {/* ── Grid Row 2: Activity & Tasks ── */}
        <div className="db-dashboard-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 0.8fr', 
          gap: '24px', 
          marginTop: '40px' 
        }}>
          
          {/* Left: Recent Activity */}
          <section className="db-section" id="activity" style={{ margin: 0 }}>
            <div className="db-section-header">
              <h2 className="db-section-title">Activity Timeline</h2>
            </div>
            <div className="db-card-glass" style={{ padding: '24px', borderRadius: '24px', minHeight: '400px' }}>
              <ActivityTimeline activities={activities} />
            </div>
          </section>

          {/* Right: Tasks Due Soon */}
          <section className="db-section" id="due-tasks" style={{ margin: 0 }}>
            <div className="db-section-header">
              <h2 className="db-section-title">Due Tasks</h2>
            </div>

            {tasksLoading ? (
              <div style={{ padding: '24px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="db-skeleton-row db-skeleton-anim" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="db-empty" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                <p style={{ fontSize: 14, color: '#71717a' }}>No urgent tasks.</p>
              </div>
            ) : (
              <div className="db-tasks-panel" style={{ padding: 0, background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                <div className="db-task-list">
                  {tasks.filter(t => t.status !== 'Done').slice(0, 4).map((task) => (
                    <div key={task._id} className="db-task-row" style={{ padding: '16px 24px' }}>
                      <button 
                        className="db-task-check" 
                        onClick={() => handleToggleTask(task._id)}
                        style={{ cursor: 'pointer', background: 'none', border: '2px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#BEF264'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                      />
                      <div className="db-task-info">
                        <p className="db-task-title">{task.title}</p>
                        <p className="db-task-meta">
                          {task.project?.name || 'Task'} • {task.dueDate ? formatDate(task.dueDate) : 'No Date'}
                        </p>
                      </div>
                      <span
                        className="db-priority-badge"
                        style={{
                          ...(PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.default),
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                    </div>
                  ))}
                </div>
                {tasks.length > 4 && (
                  <button className="db-show-more" style={{ borderRadius: '0 0 24px 24px' }}>
                    View all {tasks.length} tasks
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="db-footer">
          <div>
            <span className="db-footer-logo">TaskFlow</span>
            <span className="db-footer-copy">© 2024 TaskFlow Inc. All rights reserved.</span>
          </div>
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
