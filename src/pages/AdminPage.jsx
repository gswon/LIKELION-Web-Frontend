import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-[#1a1a1a] border-b border-gray-800">
        <div
          onClick={() => navigate('/admin')}
          className="flex items-center text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img src={NYULogo} alt="NYU Logo" className="h-[32px] ml-[8px]" />
        </div>

        <div className="flex items-center gap-[16px] ml-auto">
          <button
            onClick={() => navigate('/admin/qr')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Attendance QR
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            User Management
          </button>

          <button
            onClick={() => navigate('/admin/calendar')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Calendar Management
          </button>

          <button
            onClick={() => navigate('/admin/projects')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Projects Management
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Admin Home Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#0a0a0a]">
        <h1 className="text-[96px] font-bold text-white">NYU Admin Page</h1>
      </div>
    </div>
  );
}
