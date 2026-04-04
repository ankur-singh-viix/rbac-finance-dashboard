import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, recRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/recent?limit=5'),
        ]);
        setSummary(sumRes.data.data);
        setRecent(recRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <span style={styles.brand}>₹ Finance Dashboard</span>
        <div style={styles.navRight}>
          <span style={styles.userBadge}>{user?.role?.toUpperCase()}</span>
          <span style={styles.userName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Dashboard Overview</h2>

        {/* Summary Cards */}
        <div style={styles.cards}>
          <div style={{ ...styles.card, borderTop: '4px solid #22c55e' }}>
            <p style={styles.cardLabel}>Total Income</p>
            <p style={{ ...styles.cardValue, color: '#22c55e' }}>₹ {summary?.totalIncome?.toLocaleString()}</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #ef4444' }}>
            <p style={styles.cardLabel}>Total Expenses</p>
            <p style={{ ...styles.cardValue, color: '#ef4444' }}>₹ {summary?.totalExpenses?.toLocaleString()}</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #4f46e5' }}>
            <p style={styles.cardLabel}>Net Balance</p>
            <p style={{ ...styles.cardValue, color: '#4f46e5' }}>₹ {summary?.netBalance?.toLocaleString()}</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #f59e0b' }}>
            <p style={styles.cardLabel}>Total Records</p>
            <p style={{ ...styles.cardValue, color: '#f59e0b' }}>{summary?.totalRecords}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.table}>
          <h3 style={styles.tableTitle}>Recent Activity</h3>
          {recent.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '1rem' }}>No records yet.</p>
          ) : (
            <table style={styles.tableEl}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Nav buttons */}
        <div style={styles.navBtns}>
          <button style={styles.navBtn} onClick={() => navigate('/records')}>View All Records</button>
          <button style={styles.navBtn} onClick={() => navigate('/records/add')}>+ Add Record</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page:      { minHeight: '100vh', background: '#f0f2f5' },
  center:    { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  navbar:    { background: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  brand:     { fontWeight: '700', fontSize: '1.2rem', color: '#4f46e5' },
  navRight:  { display: 'flex', alignItems: 'center', gap: '1rem' },
  userBadge: { background: '#ede9fe', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' },
  userName:  { fontSize: '0.9rem', color: '#374151' },
  logoutBtn: { background: 'none', border: '1px solid #d1d5db', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' },
  content:   { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  heading:   { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' },
  cards:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  card:      { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardLabel: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' },
  cardValue: { fontSize: '1.75rem', fontWeight: '700' },
  table:     { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' },
  tableTitle:{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' },
  tableEl:   { width: '100%', borderCollapse: 'collapse' },
  theadRow:  { borderBottom: '2px solid #f3f4f6' },
  th:        { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  tr:        { borderBottom: '1px solid #f3f4f6' },
  td:        { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#374151' },
  badge:     { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  navBtns:   { display: 'flex', gap: '1rem' },
  navBtn:    { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
};

export default Dashboard;