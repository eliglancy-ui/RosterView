import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClassPage from './pages/ClassPage';

// Components
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

// Utils
import { isAuthenticated, getUser } from './utils/auth';

function App() {
  const [user, setUser] = useState(getUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    // Check auth status on mount
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        {authenticated && <Header user={user} onLogout={handleLogout} />}
        <main>
          <div className="container">
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/class/:classId"
                element={
                  <PrivateRoute>
                    <ClassPage />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={authenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
