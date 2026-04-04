import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import AddRecord from './pages/AddRecord';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
    <Route path="/records/add" element={<ProtectedRoute><AddRecord /></ProtectedRoute>} />
  </Routes>
);

export default App;