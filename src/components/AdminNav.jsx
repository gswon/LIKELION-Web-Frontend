import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  const isActive = (path) => location.pathname === path;
  const isManagement = () =>
    ['/admin/users', '/admin/calendar', '/admin/projects', '/admin/photos', '/admin/landing'].includes(location.pathname);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const activeClass = 'px-[20px] py-[10px] lg:px-[28px] lg:py-[13px] rounded-full text-[16px] lg:text-[20px] bg-[#2a2a2a] text-white border border-gray-700';
  const inactiveClass = 'px-[20px] py-[10px] lg:px-[28px] lg:py-[13px] border border-gray-700 rounded-full text-[16px] lg:text-[20px] text-gray-300 hover:bg-[#2a2a2a]';

  return (
    <nav className="relative flex items-center w-full px-4 lg:px-[32px] py-[16px] bg-[#1a1a1a] border-b border-gray-800">
      {/* Logo */}
      <div
        onClick={() => navigate('/admin')}
        className="flex items-center text-[20px] lg:text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white whitespace-nowrap shrink-0"
      >
        LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
        <img src={NYULogo} alt="NYU Logo" className="h-[20px] lg:h-[32px] ml-[8px]" />
      </div>

      {/* Desktop nav items */}
      <div className="hidden lg:flex items-center gap-[16px] ml-auto">
        {/* Attendance QR */}
        <button
          onClick={() => navigate('/admin/qr')}
          className={isActive('/admin/qr') ? activeClass : inactiveClass}
        >
          Attendance QR
        </button>

        {/* Attendance Session */}
        <button
          onClick={() => navigate('/admin/attendance')}
          className={isActive('/admin/attendance') ? activeClass : inactiveClass}
        >
          Attendance Session
        </button>

        {/* Management 드롭다운 */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={`${isManagement() ? activeClass : inactiveClass} inline-flex items-center gap-2`}>
            Management
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-[6px] bg-[#1a1a1a] border border-gray-700 rounded-[12px] overflow-hidden z-50 min-w-[220px] shadow-lg">
              <button
                onClick={() => { navigate('/admin/users'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors ${
                  isActive('/admin/users')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => { navigate('/admin/calendar'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors border-t border-gray-800 ${
                  isActive('/admin/calendar')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Calendar Management
              </button>
              <button
                onClick={() => { navigate('/admin/projects'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors border-t border-gray-800 ${
                  isActive('/admin/projects')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Project Management
              </button>
              <button
                onClick={() => { navigate('/admin/photos'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors border-t border-gray-800 ${
                  isActive('/admin/photos')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Photo Management
              </button>
              <button
                onClick={() => { navigate('/admin/landing'); setDropdownOpen(false); }}
                className={`w-full text-left px-[20px] py-[14px] text-[16px] transition-colors border-t border-gray-800 ${
                  isActive('/admin/landing')
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Landing Page
              </button>
            </div>
          )}
        </div>

        {/* Go to Site */}
        <button
          onClick={() => navigate('/')}
          className={inactiveClass}
        >
          Go to Site
        </button>
      </div>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden ml-auto text-white text-[24px] leading-none p-2"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50 p-4 flex flex-col gap-2">
          <button
            onClick={() => { navigate('/admin/qr'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/qr') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Attendance QR
          </button>
          <button
            onClick={() => { navigate('/admin/attendance'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/attendance') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Attendance Session
          </button>
          <button
            onClick={() => { navigate('/admin/users'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/users') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => { navigate('/admin/calendar'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/calendar') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Calendar Management
          </button>
          <button
            onClick={() => { navigate('/admin/projects'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/projects') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Project Management
          </button>
          <button
            onClick={() => { navigate('/admin/photos'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/photos') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Photo Management
          </button>
          <button
            onClick={() => { navigate('/admin/landing'); setMobileOpen(false); }}
            className={`text-left px-[16px] py-[12px] rounded-[10px] text-[16px] ${
              isActive('/admin/landing') ? 'bg-[#2a2a2a] text-white' : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Landing Page
          </button>
          <button
            onClick={() => { navigate('/'); setMobileOpen(false); }}
            className="text-left px-[16px] py-[12px] rounded-[10px] text-[16px] text-gray-300 hover:bg-[#2a2a2a] border-t border-gray-800 mt-1 pt-[13px]"
          >
            Go to Site
          </button>
        </div>
      )}
    </nav>
  );
}
