import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../App.css';

function App() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Check if the user is already authenticated when the app loads
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
      navigate('/dashboard'); // Redirect to dashboard if user is authenticated
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', { email, username, password });
      alert('Signup successful!');
      setEmail('');
      setUsername('');
      setPassword('');
    } catch (error) {
      alert('Error signing up');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      
      // If login is successful
      if (response.status === 200) {
        alert('Login successful!');
        setEmail('');
        setPassword('');
        
        // Set authentication status
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify({ email }));

        // Navigate to Dashboard after successful login
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Error logging in: ' + error.response?.data || 'Unknown error');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="App">
       
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{isLogin ? 'Login' : 'Signup'}</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
</button>

      </header>
    </div>
  );
}

export default App;
