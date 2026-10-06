import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { setAuthToken, setUser } from '../utils/auth';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;

      // Store auth data
      setAuthToken(token);
      setUser(user);

      // Update parent state and navigate
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { email: 'teacher1@wcpss.edu', role: 'Teacher' },
    { email: 'teacher2@wcpss.edu', role: 'Teacher' },
    { email: 'admin@wcpss.edu', role: 'Admin' },
    { email: 'parent@example.com', role: 'Parent' },
  ];

  const setDemoCredential = (email) => {
    setEmail(email);
    setPassword('password'); // Demo password
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-circles" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <div className="logo-circle green"></div>
            <div className="logo-circle blue"></div>
            <div className="logo-circle orange"></div>
          </div>
          <h1>RosterView</h1>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>Know where your class is</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ecf0f1' }}>
          <h3 style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Demo Credentials (Password: password)</h3>
          <div className="grid">
            {demoCredentials.map((cred) => (
              <button
                key={cred.email}
                className="btn btn-secondary btn-small"
                onClick={() => setDemoCredential(cred.email)}
                style={{ textAlign: 'left' }}
              >
                <strong>{cred.role}</strong>
                <br />
                <span style={{ fontSize: '0.75rem' }}>{cred.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
