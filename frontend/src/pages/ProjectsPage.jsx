import { useState, useEffect } from 'react';
import '../dashboard.css';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import { getErrorMessage } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import { MoreHorizontal, Calendar, FolderOpen, Plus } from 'lucide-react';

/* ── helpers ── */
const CATEGORY_COLORS = {
  Development: { bg: '#ede9fe', text: '#7c3aed', border: '#7c3aed' },
  Marketing:   { bg: '#fce7f3', text: '#be185d', border: '#ec4899' },
  Research:    { bg: '#d1fae5', text: '#065f46', border: '#14b8a6' },
  Design:      { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  default:     { bg: '#e0e7ff', text: '#3730a3', border: '#635BFF' },
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

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchProjects(); }, []);

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

  const handleProjectCreated = (p) => setProjects(prev => [p, ...prev]);

  return (
    <DashboardLayout projects={projects} onProjectCreated={handleProjectCreated}>
      <div className="db-page">
        <section className="db-section">
          <div className="db-section-header">
            <h2 className="db-section-title">All Projects</h2>
          </div>

          {loading ? (
            <div className="db-loading"><Spinner size="lg" /></div>
          ) : projects.length === 0 ? (
            <EmptyProjects />
          ) : (
            <div className="db-projects-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p._id} project={p} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
