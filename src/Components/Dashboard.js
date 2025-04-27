
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true); // User is logged in
    }
    // Fetch tasks from MongoDB on component load
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const handleAddTask = () => {
    if (taskTitle.trim() !== '' && taskDescription.trim() !== '' && assignedTo.trim() !== '') {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        assignedTo,
        status: 'toDo',
      };
      axios.post('http://localhost:5000/tasks', newTask)
        .then(response => {
          setTasks([...tasks, response.data]);
          setTaskTitle('');
          setTaskDescription('');
          setAssignedTo('');
        })
        .catch(err => console.error('Error adding task:', err));
    }
  };

  const moveTask = (taskId, fromStatus, toStatus) => {
    const taskToMove = tasks.find(task => task.id === taskId);
    if (!taskToMove) return;

    const updatedTask = { ...taskToMove, status: toStatus };
    axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask)
      .then(response => {
        setTasks(tasks.map(task => (task.id === taskId ? response.data : task)));
      })
      .catch(err => console.error('Error updating task:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Please login to access the dashboard</h1>
          <button onClick={() => navigate('/')}>Go to Login</button>
        </header>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="task-input-section">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
        />
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Assigned To"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="task-columns">
        {/* Render tasks based on their status */}
        {['toDo', 'inProgress', 'done'].map(status => (
          <div key={status} className="task-column">
            <h3>{status}</h3>
            {tasks.filter(task => task.status === status).map(task => (
              <div key={task.id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <small>Assigned to: {task.assignedTo}</small>
                <div className="task-actions">
                  {status !== 'done' && (
                    <button onClick={() => moveTask(task.id, task.status, 'inProgress')}>In Progress</button>
                  )}
                  {status !== 'done' && (
                    <button onClick={() => moveTask(task.id, task.status, 'done')}>Done</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
