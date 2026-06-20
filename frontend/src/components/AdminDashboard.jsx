import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';
const ADMIN_PASSCODE = 'voidadmin';

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    status: { pending: 0, in_progress: 0, completed: 0 },
    projectTypes: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check session storage for saved auth
    const savedAuth = sessionStorage.getItem('void_admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [contactsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/contacts`),
        fetch(`${API_BASE}/stats`)
      ]);
      
      if (contactsRes.ok && statsRes.ok) {
        const contactsData = await contactsRes.json();
        const statsData = await statsRes.json();
        setInquiries(contactsData);
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    setAuthMessage('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('void_admin_authenticated', 'true');
      } else {
        const data = await res.json();
        setPasscodeError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setPasscodeError('Failed to connect to server.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    setAuthMessage('');
    try {
      const res = await fetch(`${API_BASE}/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthMessage(data.message);
        setAuthView('reset');
      } else {
        const data = await res.json();
        setPasscodeError(data.error || 'Request failed.');
      }
    } catch (err) {
      setPasscodeError('Failed to connect to server.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    setAuthMessage('');
    try {
      const res = await fetch(`${API_BASE}/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthMessage(data.message + ' You can now log in.');
        setAuthView('login');
        setOtp('');
        setNewPassword('');
        setPassword('');
      } else {
        const data = await res.json();
        setPasscodeError(data.error || 'Reset failed.');
      }
    } catch (err) {
      setPasscodeError('Failed to connect to server.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh local data
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('void_admin_authenticated');
    setPassword('');
    setOtp('');
    setNewPassword('');
    setAuthView('login');
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <section className="admin-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="reveal visible" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Security</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            {authView === 'login' ? 'Admin Access' : authView === 'forgot' ? 'Recover Account' : 'Reset Password'}
          </h2>
          
          {authMessage && <p style={{ color: 'var(--green)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'var(--mono)' }}>{authMessage}</p>}
          
          {authView === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="nexlayerinfotech@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {passcodeError && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.4rem', fontFamily: 'var(--mono)' }}>{passcodeError}</p>}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="submit-btn" style={{ flex: 1, padding: '0.85rem' }}>Unlock</button>
                <button type="button" onClick={onClose} className="price-btn" style={{ width: 'auto', padding: '0.85rem 1.5rem' }}>Back</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setAuthView('forgot'); setPasscodeError(''); setAuthMessage(''); }} style={{ color: 'var(--accent2)', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'var(--mono)' }}>Forgot Password?</a>
              </div>
            </form>
          )}

          {authView === 'forgot' && (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {passcodeError && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.4rem', fontFamily: 'var(--mono)' }}>{passcodeError}</p>}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="submit-btn" style={{ flex: 1, padding: '0.85rem' }}>Send OTP</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a href="#login" onClick={(e) => { e.preventDefault(); setAuthView('login'); setPasscodeError(''); setAuthMessage(''); }} style={{ color: 'var(--muted)', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'var(--mono)' }}>Back to Login</a>
              </div>
            </form>
          )}

          {authView === 'reset' && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  readOnly
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">OTP Code</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {passcodeError && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: '0.4rem', fontFamily: 'var(--mono)' }}>{passcodeError}</p>}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="submit-btn" style={{ flex: 1, padding: '0.85rem' }}>Reset Password</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a href="#login" onClick={(e) => { e.preventDefault(); setAuthView('login'); setPasscodeError(''); setAuthMessage(''); }} style={{ color: 'var(--muted)', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'var(--mono)' }}>Back to Login</a>
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="admin-section">
      <div className="admin-container reveal visible">
        <div className="admin-header">
          <div>
            <div className="section-label">Management Panel</div>
            <h1 className="admin-title">Nexlayer Infotech <span>Dashboard</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchDashboardData} className="nav-cta" style={{ background: 'transparent' }}>
              Refresh
            </button>
            <button onClick={handleLogout} className="price-btn" style={{ width: 'auto', padding: '0.55rem 1.5rem', borderRadius: '100px' }}>
              Lock
            </button>
            <button onClick={onClose} className="nav-cta" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}>
              Exit Dashboard
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-glow"></div>
            <div className="stat-card-title">Total Requests</div>
            <div className="stat-card-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-glow"></div>
            <div className="stat-card-title">Pending Review</div>
            <div className="stat-card-value" style={{ color: 'var(--orange)' }}>{stats.status.pending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-glow"></div>
            <div className="stat-card-title">In Progress</div>
            <div className="stat-card-value" style={{ color: 'var(--accent2)' }}>{stats.status.in_progress}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-glow"></div>
            <div className="stat-card-title">Completed</div>
            <div className="stat-card-value" style={{ color: 'var(--green)' }}>{stats.status.completed}</div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-layout">
          {/* Inquiries Panel */}
          <div className="dashboard-panel">
            <h2 className="panel-title">
              Incoming Inquiries
              {loading && <span className="spinner" style={{ width: '14px', height: '14px' }}></span>}
            </h2>
            
            {inquiries.length === 0 ? (
              <div className="empty-state">No inquiries received yet.</div>
            ) : (
              <div className="inquiries-list">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="inquiry-item">
                    <div className="inquiry-header">
                      <div>
                        <h3 className="inquiry-client">{inq.name}</h3>
                        <div className="inquiry-email">{inq.email}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {inq.projectType && <span className="inquiry-tag">{inq.projectType}</span>}
                        <span className={`status-badge ${inq.status}`}>
                          {inq.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {inq.message && <p className="inquiry-message">{inq.message}</p>}
                    
                    <div className="inquiry-footer">
                      <span className="inquiry-date">Received {formatDate(inq.created_at)}</span>
                      <div className="inquiry-actions">
                        <select
                          className="status-select"
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        >
                          <option value="pending">Mark Pending</option>
                          <option value="in_progress">Mark In Progress</option>
                          <option value="completed">Mark Completed</option>
                        </select>
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Project Distribution */}
            <div className="dashboard-panel">
              <h2 className="panel-title">Project Interest</h2>
              {stats.projectTypes.length === 0 ? (
                <div className="empty-state">No projects submitted.</div>
              ) : (
                <div className="distribution-list">
                  {stats.projectTypes.map((type) => {
                    const percent = stats.total > 0 ? (type.count / stats.total) * 100 : 0;
                    return (
                      <div key={type.projectType || 'other'} className="dist-item">
                        <div className="dist-label-row">
                          <span className="dist-name">{type.projectType || 'Other'}</span>
                          <span className="dist-count">{type.count} ({Math.round(percent)}%)</span>
                        </div>
                        <div className="dist-bar-bg">
                          <div className="dist-bar" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions / Info */}
            <div className="dashboard-panel" style={{ background: 'linear-gradient(135deg, rgba(124,109,250,0.05), transparent)' }}>
              <h2 className="panel-title">System Information</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                <li>• DB Host: <strong>SQLite (Local File)</strong></li>
                <li>• Server Port: <strong>5000</strong></li>
                <li>• Admin Session: <strong>Active</strong></li>
                <li>• Client Access: <strong>Allow All Origins (CORS)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
