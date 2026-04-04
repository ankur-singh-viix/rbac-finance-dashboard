import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['salary','freelance','investment','food','transport','utilities','entertainment','healthcare','other'];

const AddRecord = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: '', type: 'income', category: 'salary', date: '', notes: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors([]);
    try {
      await api.post('/records', form);
      navigate('/records');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setError(data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <span style={styles.brand} onClick={() => navigate('/dashboard')}>₹ Finance Dashboard</span>
        <div style={styles.navRight}>
          <span style={styles.userBadge}>{user?.role?.toUpperCase()}</span>
          <span style={styles.userName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Add New Record</h2>

        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}
          {errors.length > 0 && (
            <div style={styles.error}>
              <ul style={{ paddingLeft: '1rem' }}>
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>Amount *</label>
                <input
                  style={styles.input}
                  type="number"
                  name="amount"
                  placeholder="e.g. 5000"
                  value={form.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Type *</label>
                <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Notes</label>
              <textarea
                style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                name="notes"
                placeholder="Optional notes..."
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <div style={styles.btnRow}>
              <button type="button" style={styles.cancelBtn} onClick={() => navigate('/records')}>Cancel</button>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page:      { minHeight: '100vh', background: '#f0f2f5' },
  navbar:    { background: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  brand:     { fontWeight: '700', fontSize: '1.2rem', color: '#4f46e5', cursor: 'pointer' },
  navRight:  { display: 'flex', alignItems: 'center', gap: '1rem' },
  userBadge: { background: '#ede9fe', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' },
  userName:  { fontSize: '0.9rem', color: '#374151' },
  logoutBtn: { background: 'none', border: '1px solid #d1d5db', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  content:   { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  heading:   { fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' },
  card:      { background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  error:     { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.875rem' },
  row:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  group:     { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' },
  label:     { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
  input:     { padding: '0.65rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', width: '100%' },
  btnRow:    { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn: { background: '#fff', color: '#374151', border: '1px solid #d1d5db', padding: '0.65rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  submitBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
};

export default AddRecord;