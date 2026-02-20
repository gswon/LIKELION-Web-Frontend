import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/Signup';
import Login from './pages/Login';
import LikeLionNYU from './pages/LandingPage';
import AttendancePage from './pages/Attendance';
import AdminPage from './pages/AdminPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ScrollToTop from './ScrollToTop';
import AdminQR from './pages/AdminQR';
import AdminUsers from './pages/AdminUsers';
import CalendarPage from './pages/CalendarPage';
import AdminCalendarPage from './pages/AdminCalendarPage';
import EventsPage from './pages/EventsPage';
import AdminProjects from './pages/AdminProjects';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LikeLionNYU />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/admin/qr" element={<AdminQR />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/calendar" element={<AdminCalendarPage />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
      </Routes>
    </Router>
  );
}

export default App;
