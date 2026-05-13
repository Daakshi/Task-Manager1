const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: check if user is member of project
const isProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;
  return project.members.some((m) => m.toString() === userId.toString());
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const member = await isProjectMember(projectId, req.user._id);
    if (!member) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, status, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const member = await isProjectMember(project, req.user._id);
    if (!member) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Todo',
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
      project,
      createdBy: req.user._id,
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const member = await isProjectMember(task.project, req.user._id);
    if (!member) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, priority, dueDate, assignedTo, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (status !== undefined) task.status = status;

    await task.save();

    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.json(populated);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const member = await isProjectMember(task.project, req.user._id);
    if (!member) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// @desc    Get all tasks assigned to current user
// @route   GET /api/tasks/me
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .sort({ dueDate: 1 }); // Ascending order to show due soon first

    res.json(tasks);
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error fetching user tasks' });
  }
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask, getMyTasks };
