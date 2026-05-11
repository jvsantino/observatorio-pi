import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import { useAuth } from './hooks/useAuth';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import TrocarSenha from './pages/auth/TrocarSenha';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

const SENHA_PADRAO = 'Trocar@123';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/trocar-senha" element={
        <PrivateRoute>
          <TrocarSenha />
        </PrivateRoute>
      } />
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}