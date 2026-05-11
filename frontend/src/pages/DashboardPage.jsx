import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import { getErrorMessage } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import { FolderOpen, Plus, Users, ChevronRight, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
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

  const handleProjectCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  return (
    <DashboardLayout projects={projects} onProjectCreated={handleProjectCreated}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 pl-2">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Good to see you, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 font-medium">
            {projects.length > 0
              ? `You have ${projects.length} active project${projects.length !== 1 ? 's' : ''}`
              : 'Create your first project to get started'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center shadow-sm">
              <LayoutGrid size={24} className="text-violet-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
              <p className="text-slate-500 font-medium text-sm">Total Projects</p>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
              <FolderOpen size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {projects.filter((p) => p.owner._id === user?._id).length}
              </p>
              <p className="text-slate-500 font-medium text-sm">Owned by You</p>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {projects.filter((p) => p.owner._id !== user?._id).length}
              </p>
              <p className="text-slate-500 font-medium text-sm">Collaborating</p>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div>
          <div className="flex items-center justify-between mb-6 pl-2">
            <h2 className="text-xl font-bold text-slate-800">Your Projects</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl">
              <div className="w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
                <FolderOpen size={30} className="text-slate-400" />
              </div>
              <h3 className="text-slate-800 font-bold text-xl mb-2">No projects yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm">
                Create your first project to start organizing tasks and collaborating with your team.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group glass-panel hover:bg-white/95 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors shadow-sm">
                      <FolderOpen size={20} className="text-indigo-600" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <ChevronRight
                        size={16}
                        className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </div>

                  <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-5 leading-relaxed">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <Users size={14} />
                      <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                    </div>
                    {project.owner._id === user?._id ? (
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                        Owner
                      </span>
                    ) : (
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                        Member
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
