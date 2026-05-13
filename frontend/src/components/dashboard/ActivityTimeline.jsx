import React from 'react';
import { 
  PlusCircle, 
  ArrowRightCircle, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  User
} from 'lucide-react';

const ActivityTimeline = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'created': return <PlusCircle size={14} />;
      case 'moved':   return <ArrowRightCircle size={14} />;
      case 'updated': return <RefreshCcw size={14} />;
      case 'completed': return <CheckCircle2 size={14} />;
      case 'priority': return <AlertCircle size={14} />;
      default: return <RefreshCcw size={14} />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'created': return 'Task Created';
      case 'moved':   return 'Task Moved';
      case 'updated': return 'Task Updated';
      case 'completed': return 'Task Completed';
      case 'priority': return 'Priority Changed';
      default: return 'Activity';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="db-empty" style={{ padding: '40px 0' }}>
        <p style={{ color: '#71717a', fontSize: '14px' }}>No recent activity to show.</p>
      </div>
    );
  }

  return (
    <div className="at-root">
      {activities.map((item, idx) => (
        <div key={item.id || idx} className="at-item" style={{ animationDelay: `${idx * 100}ms` }}>
          <div className="at-dot" />
          
          <div className="at-header">
            <span className="at-type">
              {getIcon(item.type)}
              {getTypeText(item.type)}
            </span>
            <span className="at-time">{item.timestamp}</span>
          </div>

          <div className="at-content">
            <div className="at-user-avatar">
              {item.userAvatar || <User size={14} />}
            </div>
            <div className="at-text">
              <span className="at-user-name" style={{ fontWeight: 700, color: '#BEF264' }}>{item.userName}</span>
              {' '}{item.action}{' '}
              <span className="at-target">"{item.taskName}"</span>
              {item.details && <span style={{ color: '#a1a1aa', fontSize: '13px' }}> — {item.details}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
