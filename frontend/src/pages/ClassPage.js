import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classesService, studentsService } from '../services/api';
import { getUser } from '../utils/auth';

function ClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStatus, setNewStatus] = useState('school');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const user = getUser();

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await classesService.getById(classId);
      setClassData(response.data);
      setStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, status) => {
    setUpdating(true);
    try {
      await studentsService.updateStatus(studentId, classId, status, notes);

      // Update local state
      setStudents(students.map(s =>
        s.id === studentId
          ? { ...s, status }
          : s
      ));

      // Refresh to get latest stats
      await fetchClassData();
      setSelectedStudent(null);
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading class...</p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="error">
        <p>Class not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1 style={{ marginTop: '1rem' }}>{classData.name}</h1>
          <p style={{ color: '#7f8c8d' }}>
            Grade {classData.grade_level} • Period {classData.period} • {classData.description}
          </p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3>At School</h3>
          <div className="value" style={{ color: '#27ae60' }}>{classData.stats?.at_school || 0}</div>
        </div>
        <div className="stat-card">
          <h3>At Home</h3>
          <div className="value" style={{ color: '#f39c12' }}>{classData.stats?.at_home || 0}</div>
        </div>
        <div className="stat-card">
          <h3>ISS</h3>
          <div className="value" style={{ color: '#e74c3c' }}>{classData.stats?.in_iss || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="value" style={{ color: '#3498db' }}>{classData.stats?.total_students || 0}</div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Students</h2>
        {students.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No students enrolled</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <strong>{student.first_name} {student.last_name}</strong>
                    {student.email && <div style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>{student.email}</div>}
                  </td>
                  <td>
                    <span className={`badge at-${student.status || 'school'}`}>
                      {student.status === 'school' && 'At School'}
                      {student.status === 'home' && 'At Home'}
                      {student.status === 'iss' && 'ISS'}
                      {!student.status && 'Not Marked'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
                    {student.notes || '-'}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => setSelectedStudent(student)}
                      disabled={updating}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>
              Update Status: {selectedStudent.first_name} {selectedStudent.last_name}
            </h2>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updating}
              >
                <option value="school">At School</option>
                <option value="home">At Home</option>
                <option value="iss">ISS (In-School Suspension)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
                rows="3"
                disabled={updating}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleStatusChange(selectedStudent.id, newStatus)}
                disabled={updating}
                style={{ flex: 1 }}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedStudent(null);
                  setNotes('');
                  setNewStatus('school');
                }}
                disabled={updating}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassPage;
