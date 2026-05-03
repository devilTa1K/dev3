import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus, LogOut } from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isLogin, setIsLogin] = useState(true);
  
  // Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tasks State
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
    } catch (err) {
      setAuthError(err.response?.data?.msg || 'Authentication failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTasks([]);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, 
        { title: newTaskTitle, description: newTaskDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${taskId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          {authError && <div style={{color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center'}}>{authError}</div>}
          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className="switch-auth" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Task Manager</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span style={{color: 'var(--text-muted)'}}>Hi, {user?.username}</span>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} style={{marginRight: '0.5rem', verticalAlign: 'middle'}}/>
            Logout
          </button>
        </div>
      </div>

      <div className="task-form">
        <form onSubmit={addTask} style={{display: 'flex', gap: '1rem'}}>
          <div style={{flex: 1}}>
            <input 
              type="text" 
              placeholder="Task Title" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '0.5rem'}}
            />
            <input 
              type="text" 
              placeholder="Description (optional)" 
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)'}}
            />
          </div>
          <button type="submit" className="btn" style={{width: 'auto', padding: '0 1.5rem', height: 'fit-content'}}>
            <Plus size={20} />
          </button>
        </form>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <div>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <span className={`task-status status-${task.status}`}>
                {task.status.replace('-', ' ')}
              </span>
            </div>
            <div className="task-actions">
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(task._id, e.target.value)}
                style={{padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)'}}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>
            No tasks yet. Create one above!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
