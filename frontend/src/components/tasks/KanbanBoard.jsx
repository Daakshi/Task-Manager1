import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Calendar, 
  User, 
  MoreHorizontal,
  Pencil,
  Trash2,
  ListTodo,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { formatDate, getInitials } from '../../utils/helpers';
import Spinner from '../common/Spinner';

/* ── Status Styles ── */
const STATUS_CONFIG = {
  'Todo':        { label: 'To Do',       icon: ListTodo,    accent: '#72E1ED', dot: '#72E1ED', bg: 'rgba(114, 225, 237, 0.08)' },
  'In Progress': { label: 'In Progress',  icon: Clock,       accent: '#fbbf24', dot: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
  'Review':      { label: 'Review',       icon: Eye,         accent: '#a855f7', dot: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' },
  'Completed':   { label: 'Completed',    icon: CheckCircle2,accent: '#BEF264', dot: '#BEF264', bg: 'rgba(190, 242, 100, 0.08)' },
};

const PRIORITY_STYLES = {
  High:   { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', dot: '#ef4444' },
  Medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', dot: '#f59e0b' },
  Low:    { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', dot: '#10b981' },
};

/* ── Sortable Task Card ── */
const SortableTaskCard = ({ task, onEdit, onDelete, isDraggingOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task._id,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  if (isDragging && !isDraggingOverlay) {
    return (
      <div ref={setNodeRef} style={style} className="tc-card dnd-item-dragging" />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`tc-card ${isDraggingOverlay ? 'dnd-card-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="tc-top">
        <span className="tc-priority-badge" style={{ background: ps.bg, color: ps.color }}>
          <span className="tc-priority-dot" style={{ background: ps.dot }} />
          {task.priority}
        </span>
        <div className="tc-actions" onClick={e => e.stopPropagation()}>
          <button className="tc-action-btn" onClick={() => onEdit(task)}>
            <Pencil size={13} />
          </button>
          <button className="tc-action-btn tc-action-btn--del" onClick={() => onDelete(task._id)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3 className={`tc-title ${task.status === 'Completed' ? 'tc-title--done' : ''}`}>
        {task.title}
      </h3>

      {task.description && <p className="tc-desc">{task.description}</p>}

      <div className="tc-footer">
        <div className={`tc-date ${overdue ? 'tc-date--overdue' : ''}`}>
          <Calendar size={11} />
          <span>{formatDate(task.dueDate) || 'No date'}</span>
        </div>

        {task.assignedTo ? (
          <div className="tc-assignee">
            <div className="tc-assignee-avatar">
              {getInitials(task.assignedTo.name)}
            </div>
          </div>
        ) : (
          <div className="tc-unassigned"><User size={11} /></div>
        )}
      </div>
    </div>
  );
};

/* ── Kanban Column ── */
const KanbanColumn = ({ status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const { setNodeRef } = useSortable({
    id: status,
    data: {
      type: 'Column',
      status,
    }
  });

  return (
    <div className="pp-column" ref={setNodeRef}>
      <div className="pp-col-header" style={{ background: config.bg }}>
        <div className="pp-col-header-left">
          <span className="pp-col-dot" style={{ background: config.dot }} />
          <span className="pp-col-label" style={{ color: config.accent }}>{config.label}</span>
          <span className="pp-col-count" style={{ color: config.accent, background: 'rgba(255,255,255,0.05)' }}>
            {tasks.length}
          </span>
        </div>
        <button className="pp-col-add-btn" onClick={() => onAddTask(status)}>
          <Plus size={15} style={{ color: config.accent }} />
        </button>
      </div>

      <div className="pp-col-body">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard 
              key={task._id} 
              task={task} 
              onEdit={onEditTask} 
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="pp-col-empty" onClick={() => onAddTask(status)}>
            <Icon size={26} style={{ color: config.accent, opacity: 0.2 }} />
            <p>No tasks</p>
            <span>+ Add task</span>
          </div>
        )}
      </div>

      <button className="pp-col-footer-btn" onClick={() => onAddTask(status)}>
        <Plus size={14} /> Add Task
      </button>
    </div>
  );
};

/* ── Kanban Board Component ── */
const KanbanBoard = ({ tasks, onStatusChange, onEditTask, onDeleteTask, onAddTask }) => {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    // Dropping over a task in another column
    if (isActiveATask && isOverATask) {
      const activeTask = active.data.current.task;
      const overTask = over.data.current.task;

      if (activeTask.status !== overTask.status) {
        onStatusChange(activeTask._id, overTask.status);
      }
    }

    // Dropping over a column
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
      const activeTask = active.data.current.task;
      const overStatus = over.data.current.status;

      if (activeTask.status !== overStatus) {
        onStatusChange(activeTask._id, overStatus);
      }
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
  };

  const columns = Object.keys(STATUS_CONFIG);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="pp-board">
        {columns.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeTask ? (
          <SortableTaskCard 
            task={activeTask} 
            isDraggingOverlay 
            onEdit={() => {}} 
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
