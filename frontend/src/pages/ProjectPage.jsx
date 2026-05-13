import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService, taskService } from '../services';
import { getErrorMessage, getInitials } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import KanbanBoard from '../components/tasks/KanbanBoard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import AddMemberModal from '../components/projects/AddMemberModal';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  UserPlus, CheckCircle2, ArrowLeft
} from 'lucide-react';
import '../dashboard.css';

/* ── Column config ── */
const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject]           = useState(null);
  const [tasks,   setTasks]             = useState([]);
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [createModalOpen, setCreate]    = useState(false);
  const [createDefaultStatus, setDefSt] = useState('Todo');
  const [editTask, setEditTask]         = useState(null);
  const [memberModalOpen, setMember]    = useState(false);
  const [projStatus, setProjStatus]     = useState('In Progress');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes, projectsRes] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        projectService.getAll(),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated  = (t)  => setTasks(p => [t, ...p]);
  const handleTaskUpdated  = (u)  => setTasks(p => p.map(t => t._id === u._id ? u : t));
  const handleTaskDeleted  = (id) => setTasks(p => p.filter(t => t._id !== id));
  
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      const { data: updated } = await taskService.update(taskId, { status: newStatus });
      handleTaskUpdated(updated);
    } catch (err) {
      toast.error(getErrorMessage(err));
      // Fetch data again to sync state on failure
      fetchData();
    }
  };

  const openCreate = (status) => { setDefSt(status); setCreate(true); };

  if (loading) return (
    <DashboardLayout projects={[]} onProjectCreated={() => {}}>
      <div className="pp-root" style={{ opacity: 0.5 }}>
        <div className="pp-header">
          <div className="db-skeleton-row db-skeleton-anim" style={{ width: '200px', height: '20px' }} />
          <div className="db-skeleton-row db-skeleton-anim" style={{ width: '400px', height: '40px', marginTop: '12px' }} />
          <div className="db-skeleton-row db-skeleton-anim" style={{ width: '100%', height: '60px', marginTop: '24px' }} />
        </div>
        <div className="pp-board" style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="db-skeleton-card db-skeleton-anim" style={{ flex: 1, height: '500px' }} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout projects={projects} onProjectCreated={p => setProjects(prev => [p, ...prev])}>
      <div className="pp-root">

        {/* ── PROJECT HEADER ── */}
        <div className="pp-header">
          <div className="pp-breadcrumb">
            <Link to="/dashboard" className="pp-bc-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={12} /> BACK TO DASHBOARD
            </Link>
            <span className="pp-bc-sep">›</span>
            <span className="pp-bc-current">{project?.name?.toUpperCase()}</span>
          </div>

          <div className="pp-title-row">
            <div className="pp-title-block">
              <h1 className="pp-title">{project?.name}</h1>
              {project?.description && (
                <p className="pp-desc">{project.description}</p>
              )}
            </div>
            <div className="pp-header-actions">
              <button className="pp-btn-outline" onClick={() => setMember(true)}>
                <UserPlus size={15} /> Add Member
              </button>
              <button
                className="pp-btn-primary"
                onClick={() => setProjStatus(s => s === 'Completed' ? 'In Progress' : 'Completed')}
              >
                <CheckCircle2 size={15} />
                {projStatus === 'Completed' ? 'Project Completed' : 'Complete Project'}
              </button>
            </div>
          </div>

          <div className="pp-meta-row">
            <div className="pp-meta-cell">
              <span className="pp-meta-label">PRIORITY</span>
              <div className="pp-meta-val">
                <span className="pp-dot pp-dot--red" />
                <span className="pp-priority-text">High</span>
              </div>
            </div>
            <div className="pp-meta-divider" />
            <div className="pp-meta-cell">
              <span className="pp-meta-label">MEMBERS</span>
              <div className="pp-meta-val pp-assignees">
                {project?.members?.slice(0, 3).map((m, i) => (
                  <div key={m._id || i} className="pp-assignee-avatar" style={{ zIndex: 10 - i }} title={m.name || m.email || 'Member'}>
                    {getInitials(m.name || m.email || 'U')}
                  </div>
                ))}
                <span className="pp-assignee-name">
                  {project?.members?.length || 0} Contributors
                </span>
              </div>
            </div>
            <div className="pp-meta-divider" />
            <div className="pp-meta-cell">
              <span className="pp-meta-label">STATUS</span>
              <div className="pp-meta-val">
                <span className="pp-status-badge">{projStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── KANBAN BOARD ── */}
        <KanbanBoard 
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEditTask={setEditTask}
          onDeleteTask={handleTaskDeleted}
          onAddTask={openCreate}
        />


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

      {/* Modals */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreate(false)}
        projectId={id}
        members={project?.members || []}
        onCreated={handleTaskCreated}
        defaultStatus={createDefaultStatus}
      />
      <EditTaskModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        task={editTask}
        members={project?.members || []}
        onUpdated={handleTaskUpdated}
      />
      <AddMemberModal
        isOpen={memberModalOpen}
        onClose={() => setMember(false)}
        project={project}
        onUpdated={setProject}
      />
    </DashboardLayout>
  );
};

export default ProjectPage;
