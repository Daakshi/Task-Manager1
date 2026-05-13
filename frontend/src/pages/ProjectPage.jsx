import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService, taskService } from '../services';
import { getErrorMessage } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import AddMemberModal from '../components/projects/AddMemberModal';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  Plus, UserPlus, CheckCircle2, Clock,
  ListTodo, Share2, ChevronDown,
} from 'lucide-react';
import '../dashboard.css';

/* ── Column config ── */
const COLUMNS = [
  { status: 'Todo',        label: 'To Do',       icon: ListTodo,    accent: '#635BFF', dotColor: '#635BFF', headerBg: '#f0efff' },
  { status: 'In Progress', label: 'In Progress',  icon: Clock,       accent: '#f59e0b', dotColor: '#f59e0b', headerBg: '#fffbeb' },
  { status: 'Done',        label: 'Done',         icon: CheckCircle2,accent: '#14b8a6', dotColor: '#14b8a6', headerBg: '#f0fdfa' },
];

const STATUS_OPTS = ['Todo', 'In Progress', 'Done'];

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
  const handleStatusChange = (u)  => setTasks(p => p.map(t => t._id === u._id ? u : t));

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic UI update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      const { data: updated } = await taskService.update(taskId, { status: newStatus });
      handleTaskUpdated(updated);
      toast.success(`Moved to "${newStatus}"`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      // Revert on failure
      setTasks(prev => prev.map(t => t._id === taskId ? task : t));
    }
  };

  const openCreate = (status) => { setDefSt(status); setCreate(true); };
  const getByStatus = (s) => tasks.filter(t => t.status === s);

  if (loading) return (
    <DashboardLayout projects={[]} onProjectCreated={() => {}}>
      <div className="pp-loading"><Spinner size="lg" /></div>
    </DashboardLayout>
  );

  const doneCount  = getByStatus('Done').length;
  const totalCount = tasks.length;

  return (
    <DashboardLayout projects={projects} onProjectCreated={p => setProjects(prev => [p, ...prev])}>
      <div className="pp-root">

        {/* ════════════════════════════
            PROJECT HEADER
        ════════════════════════════ */}
        <div className="pp-header">
          {/* Breadcrumb */}
          <div className="pp-breadcrumb">
            <Link to="/dashboard" className="pp-bc-link">PROJECTS</Link>
            <span className="pp-bc-sep">›</span>
            <span className="pp-bc-current">{project?.name?.toUpperCase()}</span>
          </div>

          {/* Title row */}
          <div className="pp-title-row">
            <div className="pp-title-block">
              <h1 className="pp-title">{project?.name}</h1>
              {project?.description && (
                <p className="pp-desc">{project.description}</p>
              )}
            </div>
            <div className="pp-header-actions">
              <button className="pp-btn-outline" onClick={() => setMember(true)}>
                <Share2 size={15} /> Share
              </button>
              <button
                className="pp-btn-primary"
                onClick={() => setProjStatus(s => s === 'Done' ? 'In Progress' : 'Done')}
              >
                <CheckCircle2 size={15} />
                {projStatus === 'Done' ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="pp-meta-row">
            <div className="pp-meta-cell">
              <span className="pp-meta-label">PRIORITY</span>
              <div className="pp-meta-val">
                <span className="pp-dot pp-dot--red" />
                <span className="pp-priority-text">High</span>
                <ChevronDown size={13} className="pp-meta-caret" />
              </div>
            </div>

            <div className="pp-meta-divider" />

            <div className="pp-meta-cell">
              <span className="pp-meta-label">DUE DATE</span>
              <div className="pp-meta-val">
                <span className="pp-meta-icon">📅</span>
                <span>Oct 24, 2024</span>
              </div>
            </div>

            <div className="pp-meta-divider" />

            <div className="pp-meta-cell">
              <span className="pp-meta-label">ASSIGNEE</span>
              <div className="pp-meta-val pp-assignees">
                {project?.members?.slice(0, 3).map((m, i) => (
                  <div key={m._id} className="pp-assignee-avatar" style={{ zIndex: 10 - i }}
                    title={m.name}>
                    {(m.name || 'U')[0].toUpperCase()}
                  </div>
                ))}
                <span className="pp-assignee-name">
                  {project?.members?.[0]?.name || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="pp-meta-divider" />

            <div className="pp-meta-cell">
              <span className="pp-meta-label">STATUS</span>
              <div className="pp-meta-val">
                <span className="pp-status-badge">{projStatus}</span>
                <ChevronDown size={13} className="pp-meta-caret" />
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════
            KANBAN BOARD
        ════════════════════════════ */}
        <div className="pp-board">
          {COLUMNS.map(({ status, label, icon: Icon, accent, dotColor, headerBg }) => {
            const colTasks = getByStatus(status);
            return (
              <div key={status} className="pp-column">
                {/* Column header */}
                <div 
                  className="pp-col-header" 
                  style={{ background: headerBg }}
                >
                  <div className="pp-col-header-left">
                    <span className="pp-col-dot" style={{ background: dotColor }} />
                    <span className="pp-col-label" style={{ color: accent }}>{label}</span>
                    <span className="pp-col-count" style={{ color: accent, background: '#fff' }}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    className="pp-col-add-btn"
                    onClick={() => openCreate(status)}
                    title={`Add task to ${label}`}
                  >
                    <Plus size={15} style={{ color: accent }} />
                  </button>
                </div>

                {/* Task list */}
                <div 
                  className="pp-col-body"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {colTasks.length === 0 ? (
                    <div className="pp-col-empty" onClick={() => openCreate(status)}>
                      <Icon size={26} style={{ color: accent, opacity: 0.3 }} />
                      <p>No tasks yet</p>
                      <span>+ Add a task</span>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        members={project?.members || []}
                        onEdit={setEditTask}
                        onDelete={handleTaskDeleted}
                        onStatusChange={handleStatusChange}
                        onDragStart={(e) => e.dataTransfer.setData('taskId', task._id)}
                      />
                    ))
                  )}
                </div>

                {/* Add task button at bottom */}
                <button className="pp-col-footer-btn" onClick={() => openCreate(status)}>
                  <Plus size={14} /> Add Task
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="db-footer" style={{ margin: '0 32px' }}>
          <span className="db-footer-logo">TaskFlow</span>
          <span className="db-footer-copy">© 2024 TaskFlow Inc. All rights reserved.</span>
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
