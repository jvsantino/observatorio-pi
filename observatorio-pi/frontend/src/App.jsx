import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={
          <PrivateRoute roles={['aluno']}>
            <StudentDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute roles={['administrador', 'coordenador']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/teacher" element={
          <PrivateRoute roles={['professor']}>
            <TeacherDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
