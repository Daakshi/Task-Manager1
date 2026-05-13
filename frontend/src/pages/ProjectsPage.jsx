import { useState, useEffect } from 'react';
import '../dashboard.css';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import { getErrorMessage, formatDate } from '../utils/helpers';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import { MoreHorizontal, Calendar, FolderOpen, Plus } from 'lucide-react';

/* ── helpers ── */
const CATEGORY_COLORS = {
  Development: { bg: 'rgba(190, 242, 100, 0.15)', text: '#BEF264', border: '#BEF264' },
  Marketing:   { bg: 'rgba(114, 225, 237, 0.15)', text: '#72E1ED', border: '#72E1ED' },
  Research:    { bg: 'rgba(20, 184, 166, 0.2)', text: '#5eead4', border: '#14b8a6' },
  Design:      { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: '#f59e0b' },
  default:     { bg: 'rgba(190, 242, 100, 0.15)', text: '#BEF264', border: '#BEF264' },
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
