import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Plus,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ListTodo,
  Users,
} from 'lucide-react';

const COLUMNS = [
  {
    status: 'Todo',
    label: 'To Do',
    icon: ListTodo,
    color: 'text-indigo-600',
    border: 'border-white/60',
    bg: 'bg-white/40',
    dot: 'bg-indigo-500',
    headerBg: 'bg-indigo-50/50',
    iconBg: 'bg-indigo-100',
  },
  {
    status: 'In Progress',
    label: 'In Progress',
    icon: Clock,
    color: 'text-amber-600',
    border: 'border-white/60',
    bg: 'bg-white/40',
    dot: 'bg-amber-500',
    headerBg: 'bg-amber-50/50',
    iconBg: 'bg-amber-100',
  },
  {
    status: 'Done',
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    border: 'border-white/60',
    bg: 'bg-white/40',
    dot: 'bg-emerald-500',
    headerBg: 'bg-emerald-50/50',
    iconBg: 'bg-emerald-100',
  },
];

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState('Todo');
  const [editTask, setEditTask] = useState(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectRes, tasksRes, projectsRes] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        projectService.getAll(),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskUpdated = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleStatusChange = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleProjectUpdated = (updated) => {
    setProject(updated);
  };

  const openCreateForColumn = (status) => {
    setCreateDefaultStatus(status);
    setCreateModalOpen(true);
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <DashboardLayout projects={[]} onProjectCreated={() => {}}>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout projects={projects} onProjectCreated={(p) => setProjects((prev) => [p, ...prev])}>
      <div className="flex flex-col h-full">
        {/* Project header */}
        <div className="px-8 py-6 mb-4 glass border border-white/60 rounded-3xl mx-4 flex-shrink-0 shadow-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium mb-4 transition-colors bg-white/50 px-3 py-1.5 rounded-full inline-flex w-max"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{project?.name}</h1>
              {project?.description && (
                <p className="text-slate-500 text-base mt-2 font-medium max-w-2xl">{project.description}</p>
              )}
              <div className="flex items-center gap-3 mt-4 text-slate-600 text-sm font-medium">
                <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-white/80 shadow-sm">
                  <Users size={16} />
                  <span>
                    {project?.members?.length} member{project?.members?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {project?.members?.slice(0, 4).map((m) => (
                    <div
                      key={m._id}
                      className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
                      title={m.name}
                    >
                      {m.name[0].toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setMemberModalOpen(true)}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Add Member</span>
              </button>
              <button
                onClick={() => { setCreateDefaultStatus('Todo'); setCreateModalOpen(true); }}
                className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
              >
                <Plus size={16} />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto p-4 pb-8">
          <div className="flex gap-6 min-w-max h-full px-2">
            {COLUMNS.map(({ status, label, icon: Icon, color, border, bg, dot, headerBg, iconBg }) => {
              const colTasks = getTasksByStatus(status);
              return (
                <div key={status} className={`w-80 flex flex-col gap-4 glass-panel rounded-[2rem] p-4 ${border}`}>
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-4 py-3.5 rounded-2xl ${headerBg} border border-white/60 shadow-sm`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                        <Icon size={16} className={color} />
                      </div>
                      <span className={`text-base font-bold ${color}`}>{label}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white shadow-sm ${color}`}>
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => openCreateForColumn(status)}
                      className={`w-8 h-8 rounded-xl bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center transition-all hover:scale-105`}
                      title={`Add task to ${label}`}
                    >
                      <Plus size={16} className={color} />
                    </button>
                  </div>

                  {/* Tasks */}
                  <div className="flex-1 space-y-3 kanban-col overflow-y-auto pr-2 pb-2">
                    {colTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-white/30">
                        <Icon size={32} className="text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm font-medium">No tasks here</p>
                        <button
                          onClick={() => openCreateForColumn(status)}
                          className="mt-2 text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          + Add a task
                        </button>
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          members={project?.members || []}
                          onEdit={setEditTask}
                          onDelete={handleTaskDeleted}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
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
        onClose={() => setMemberModalOpen(false)}
        project={project}
        onUpdated={handleProjectUpdated}
      />
    </DashboardLayout>
  );
};

export default ProjectPage;
