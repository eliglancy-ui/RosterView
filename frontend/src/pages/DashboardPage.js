import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classesService } from '../services/api';
import { getUser } from '../utils/auth';

function DashboardPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await classesService.getAll();
      setClasses(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>Welcome, {user?.firstName}!</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
        {user?.role === 'teacher' && "Here are your classes. Click on any class to view and manage student status."}
        {user?.role === 'admin' && "Admin view: Monitoring all classes across the school."}
        {user?.role === 'parent' && "Parent view: linking parents to their students is coming soon."}
      </p>

      {error && <div className="error">{error}</div>}

      {classes.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No classes found</p>
        </div>
      ) : (
        <div className="grid">
          {classes.map((cls) => (
            <Link key={cls.id} to={`/class/${cls.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s', height: '100%' }}>
                <h2 style={{ color: '#2980b9', marginBottom: '0.5rem' }}>{cls.name}</h2>
                <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                  Grade {cls.grade_level} • Period {cls.period}
                </p>
                {cls.description && <p style={{ marginBottom: '1rem' }}>{cls.description}</p>}

                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                  <div className="stat-card">
                    <h3>At School</h3>
                    <div className="value" style={{ color: '#27ae60' }}>
                      {cls.stats?.at_school || 0}
                    </div>
                  </div>
                  <div className="stat-card">
                    <h3>At Home</h3>
                    <div className="value" style={{ color: '#f39c12' }}>
                      {cls.stats?.at_home || 0}
                    </div>
                  </div>
                  <div className="stat-card">
                    <h3>ISS</h3>
                    <div className="value" style={{ color: '#e74c3c' }}>
                      {cls.stats?.in_iss || 0}
                    </div>
                  </div>
                  <div className="stat-card">
                    <h3>Total</h3>
                    <div className="value" style={{ color: '#3498db' }}>
                      {cls.stats?.total_students || 0}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
