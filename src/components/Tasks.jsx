import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const API_BASE = 'http://localhost:4000';

  // Load tasks from backend when user changes
  useEffect(() => {
    if (!user?.token) {
      setTasks([]);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tasks`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!res.ok) throw new Error('Failed to load tasks');
        const data = await res.json();
        if (isMounted) setTasks(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { isMounted = false; };
  }, [user]);

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Memoized task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [tasks]);

  // Memoized handlers
  const addTask = useCallback(async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user?.token) return;
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ title: newTask.trim() })
    });
    if (!res.ok) return;
    const created = await res.json();
    setTasks(prev => [created, ...prev]);
    setNewTask('');
  }, [newTask, user]);

  const toggleTask = useCallback(async (id) => {
    const current = tasks.find(t => t._id === id);
    if (!current || !user?.token) return;
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ completed: !current.completed })
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTasks(prev => prev.map(t => t._id === id ? updated : t));
  }, [tasks, user]);

  const deleteTask = useCallback(async (id) => {
    if (!user?.token) return;
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    if (!res.ok) return;
    setTasks(prev => prev.filter(task => task._id !== id));
  }, [user]);

  const updateTask = useCallback(async (id, updates) => {
    if (!(updates.title && updates.title.trim()) || !user?.token) return;
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ title: updates.title.trim() })
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTasks(prev => prev.map(task => task._id === id ? updated : task));
  }, [user]);

  return (
    <div className="tasks">
      <h2>Task Manager</h2>
      
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{taskStats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{taskStats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{taskStats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <button type="submit" className="add-task-btn">Add Task</button>
      </form>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id)}
                className="task-checkbox"
              />
              <span className="task-title">{task.title}</span>
              <div className="task-actions">
                <button
                  onClick={() => {
                    const newTitle = prompt('Edit task:', task.title);
                    if (newTitle && newTitle.trim()) {
                      updateTask(task._id, { title: newTitle.trim() });
                    }
                  }}
                  className="edit-btn"
                >
                 editTask
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="delete-btn"
                >
                  deleteTask
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
