import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/Signup';
import Login from './pages/Login';
import LikeLionNYU from './pages/LandingPage';
import AttendancePage  from './pages/Attendance';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LikeLionNYU />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </Router>
  );
}

export default App;