import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService } from '../services';
import { getErrorMessage } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import toast from 'react-hot-toast';
import { History, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityPage = () => {
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

  const activities = tasks.map(t => ({
    id: t._id,
    type: t.status === 'Done' ? 'completed' : 'updated',
    userName: user?.name || 'User',
    action: t.status === 'Done' ? 'completed' : 'is working on',
    taskName: t.title,
    timestamp: t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    details: t.project?.name || 'TaskFlow'
  }));

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
              <h1 className="db-greeting-h1" style={{ fontSize: '2.4rem' }}>Activity Timeline</h1>
              <p className="db-greeting-sub" style={{ fontSize: '1.1rem', opacity: 0.6 }}>
                Keeping track of all your professional movements.
              </p>
            </div>
          </div>
        </div>

        <section className="db-section" style={{ maxWidth: '900px' }}>
          {loading ? (
             <div style={{ padding: '24px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="db-skeleton-row db-skeleton-anim" style={{ height: '100px', marginBottom: '20px', borderRadius: '16px' }} />
                ))}
              </div>
          ) : activities.length === 0 ? (
            <div className="db-empty" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '60px' }}>
              <History size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h3>No activity yet</h3>
              <p>Start working on tasks to see your timeline grow.</p>
            </div>
          ) : (
            <div className="db-card-glass" style={{ padding: '40px', borderRadius: '32px', minHeight: '500px' }}>
               <ActivityTimeline activities={activities} />
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

export default ActivityPage;
