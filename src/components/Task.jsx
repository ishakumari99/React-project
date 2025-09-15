import React, { useState, useEffect, useMemo, useCallback} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('all');
    const [storedTasks, setStoredTasks] = useLocalStorage('task', []);
    useEffect(()=>{
        if(storedTasks.length>0){
            setTasks(storedTasks);
        }
    });
    useEffect(()=>{
        if(tasks.length> 0 || storedTasks.length > 0){
            setStoredTasks(tasks);
        }
    }, [tasks, setStoredTasks]);
    const filteredTasks = useMemo(()=>{
        switch (filter){
            case 'active':
                return tasks.filter(task=> !task.completed);
            case 'completed':
                return task.filter(task => task.completed);
            default:
                return task;
        }
    }, [tasks, filter]);
    const taskStats = useMemo(()=> {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const active = total - completed;
        return { total, completed, active };
    },[tasks]);
    const addTask = useCallback((e) => {
        e.preventDefault();
        if (newTask.trim()){
            const task = {
                id: Date.now(),
                title: newTask.trim(),
                completed: false,
                createdAt: new Date().toISOString()
            };
            setTasks(prev=> [task, ...prev]);
            setNewTask('');
        }
    }, [newTask]);
    const toggleTask = useCallback((id)=>{
        setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task));
    },[]);
      const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const updateTask = useCallback((id, updates) => {
    if (updates.title && updates.title.trim()) {
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      ));
    }
  }, []);
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
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="task-checkbox"
              />
              <span className="task-title">{task.title}</span>
              <div className="task-actions">
                <button
                  onClick={() => {
                    const newTitle = prompt('Edit task:', task.title);
                    if (newTitle && newTitle.trim()) {
                      updateTask(task.id, { title: newTitle.trim() });
                    }
                  }}
                  className="edit-btn"
                >
                 editTask
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
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
