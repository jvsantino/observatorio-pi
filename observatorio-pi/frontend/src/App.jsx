import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import { useAuth } from './hooks/useAuth';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import TrocarSenha from './pages/auth/TrocarSenha';
import RegisterEmpresa from './pages/auth/RegisterEmpresa';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro-empresa" element={<RegisterEmpresa />} />
      <Route path="/trocar-senha" element={
        <PrivateRoute><TrocarSenha /></PrivateRoute>
      } />
      <Route path="/student" element={
        <PrivateRoute roles={['aluno']}><StudentDashboard /></PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute roles={['administrador', 'coordenador']}><AdminDashboard /></PrivateRoute>
      } />
      <Route path="/teacher" element={
        <PrivateRoute roles={['professor']}><TeacherDashboard /></PrivateRoute>
      } />
      <Route path="/empresa" element={
        <PrivateRoute roles={['empresa']}><CompanyDashboard /></PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Coluna de altura total: navbar (auto) + conteúdo (ocupa o resto) */}
      <div className="h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}