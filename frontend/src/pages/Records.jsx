import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['salary','freelance','investment','food','transport','utilities','entertainment','healthcare','other'];

const Records = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const res = await api.get('/records', { params });
      setRecords(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    setDeleting(id);
    try {
      await api.delete(`/records/${id}`);
      setRecords(records.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
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
        <div style={styles.topRow}>
          <h2 style={styles.heading}>Financial Records</h2>
          {['admin','analyst'].includes(user?.role) && (
            <button style={styles.addBtn} onClick={() => navigate('/records/add')}>+ Add Record</button>
          )}
        </div>

        {/* Filters */}
        <div style={styles.filterBox}>
          <select name="type" value={filters.type} onChange={handleFilter} style={styles.select}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select name="category" value={filters.category} onChange={handleFilter} style={styles.select}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilter} style={styles.select} />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilter} style={styles.select} />
          <button style={styles.filterBtn} onClick={fetchRecords}>Apply</button>
          <button style={styles.clearBtn} onClick={() => { setFilters({ type: '', category: '', startDate: '', endDate: '' }); setTimeout(fetchRecords, 100); }}>Clear</button>
        </div>

        {/* Table */}
        <div style={styles.tableBox}>
          {loading ? (
            <p style={styles.msg}>Loading...</p>
          ) : records.length === 0 ? (
            <p style={styles.msg}>No records found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Notes</th>
                  {user?.role === 'admin' && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} style={styles.tr}>
                    <td style={styles.td}>{r.category}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: r.type === 'income' ? '#dcfce7' : '#fee2e2', color: r.type === 'income' ? '#16a34a' : '#dc2626' }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={styles.td}>₹ {r.amount?.toLocaleString()}</td>
                    <td style={styles.td}>{new Date(r.date).toLocaleDateString()}</td>
                    <td style={styles.td}>{r.notes || '—'}</td>
                    {user?.role === 'admin' && (
                      <td style={styles.td}>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(r._id)}
                          disabled={deleting === r._id}
                        >
                          {deleting === r._id ? '...' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
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
  content:   { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  topRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading:   { fontSize: '1.5rem', fontWeight: '700', color: '#111827' },
  addBtn:    { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  filterBox: { background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  select:    { padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' },
  filterBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  clearBtn:  { background: '#fff', color: '#374151', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  tableBox:  { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem', overflowX: 'auto' },
  table:     { width: '100%', borderCollapse: 'collapse' },
  theadRow:  { borderBottom: '2px solid #f3f4f6' },
  th:        { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  tr:        { borderBottom: '1px solid #f3f4f6' },
  td:        { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#374151' },
  badge:     { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  deleteBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
  msg:       { color: '#6b7280', padding: '1rem' },
  backBtn:   { background: 'none', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
};

export default Records;