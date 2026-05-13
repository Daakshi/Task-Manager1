import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService } from '../services';
import { getErrorMessage, formatDate } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import toast from 'react-hot-toast';
import { CheckSquare, Calendar, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRIORITY_COLORS = {
  High:   { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
  Medium: { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
  Low:    { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
  default:{ background: 'rgba(114, 225, 237, 0.15)', color: '#72E1ED' },
};

const DueTasksPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        taskService.getMyTasks(),
        projectService.getAll()
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'Done' } : t));
      toast.success('Task completed!');
      await taskService.update(taskId, { status: 'Done' });
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err));
      fetchData();
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Done');

  return (
    <DashboardLayout projects={projects} onProjectCreated={(p) => setProjects(prev => [p, ...prev])}>
      <div className="db-page">
        <div className="db-greeting" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="db-greeting-h1" style={{ fontSize: '2.4rem' }}>Due Tasks</h1>
              <p className="db-greeting-sub" style={{ fontSize: '1.1rem', opacity: 0.6 }}>
                You have {pendingTasks.length} pending tasks to complete.
              </p>
            </div>
          </div>
        </div>

        <section className="db-section" style={{ maxWidth: '1000px' }}>
          {loading ? (
             <div style={{ padding: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="db-skeleton-row db-skeleton-anim" style={{ height: '70px', marginBottom: '16px' }} />
                ))}
              </div>
          ) : pendingTasks.length === 0 ? (
            <div className="db-empty" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '60px' }}>
              <CheckSquare size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h3>All caught up!</h3>
              <p>You have no pending tasks at the moment.</p>
            </div>
          ) : (
            <div className="db-card-glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div className="db-task-list">
                {pendingTasks.map((task) => (
                  <div key={task._id} className="db-task-row" style={{ padding: '20px 32px' }}>
                    <button 
                      className="db-task-check" 
                      onClick={() => handleToggleTask(task._id)}
                      style={{ cursor: 'pointer', background: 'none', border: '2px solid rgba(255,255,255,0.2)', width: '22px', height: '22px' }}
                    />
                    <div className="db-task-info">
                      <p className="db-task-title" style={{ fontSize: '16px' }}>{task.title}</p>
                      <p className="db-task-meta">
                        {task.project?.name || 'General'} • {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span
                        className="db-priority-badge"
                        style={{
                          ...(PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.default),
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '12px'
                        }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="db-footer">
          <div>
            <span className="db-footer-logo">TaskFlow</span>
            <span className="db-footer-copy">© 2024 TaskFlow Inc. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default DueTasksPage;
