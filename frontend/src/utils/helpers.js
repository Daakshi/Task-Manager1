export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'Medium':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'Low':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Todo':
      return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    case 'In Progress':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    case 'Done':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'
  );
};
