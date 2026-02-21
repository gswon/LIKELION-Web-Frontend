import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function PublicNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = !!user.is_admin;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="relative flex items-center w-full px-4 md:px-6 lg:px-[32px] py-[14px] lg:py-[16px] bg-white">
      {/* Logo - scales gradually across all breakpoints */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center text-[18px] sm:text-[20px] md:text-[22px] lg:text-[28px] xl:text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
      >
        LikeLion x{' '}
        <span className="text-nyu-purple ml-[5px] md:ml-[6px] lg:ml-[8px]">NYU</span>
        <img
          src={NYULogo}
          alt="NYU Logo"
          className="h-[18px] sm:h-[20px] md:h-[22px] lg:h-[28px] xl:h-[32px] ml-[5px] md:ml-[6px] lg:ml-[8px]"
        />
      </div>

      {/* Pill nav - visible from md (768px) up, scales between breakpoints */}
      <div className="hidden md:flex items-center gap-[12px] lg:gap-[28px] xl:gap-[48px] bg-white border border-black rounded-full px-[16px] lg:px-[32px] xl:px-[48px] py-[7px] lg:py-[10px] xl:py-[13px] font-normal ml-auto shadow-button">
        <a href="/#about" className="text-[12px] lg:text-[15px] xl:text-[20px] hover:text-nyu-purple whitespace-nowrap">
          About Us
        </a>
        <button
          onClick={() => navigate('/events')}
          className="text-[12px] lg:text-[15px] xl:text-[20px] hover:text-nyu-purple bg-transparent border-none cursor-pointer whitespace-nowrap"
        >
          Events
        </button>
        <button
          onClick={() => navigate('/projects')}
          className="text-[12px] lg:text-[15px] xl:text-[20px] hover:text-nyu-purple bg-transparent border-none cursor-pointer whitespace-nowrap"
        >
          Projects
        </button>
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="text-[12px] lg:text-[15px] xl:text-[20px] hover:text-nyu-purple bg-transparent border-none cursor-pointer whitespace-nowrap"
          >
            Admin
          </button>
        )}
      </div>

      {/* Login/Logout button - visible from md up, scales between breakpoints */}
      <button
        onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
        className="hidden md:block px-[12px] lg:px-[20px] xl:px-[28px] py-[7px] lg:py-[10px] xl:py-[13px] border border-black rounded-full text-[12px] lg:text-[15px] xl:text-[20px] hover:bg-gray-50 font-normal ml-[8px] lg:ml-[14px] xl:ml-[21px] shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover whitespace-nowrap shrink-0"
      >
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </button>

      {/* Mobile hamburger - EXPLICITLY shown below md using flex md:hidden */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex md:hidden ml-auto items-center justify-center w-[40px] h-[40px] text-black"
        aria-label="Open menu"
      >
        <span className="text-[28px] leading-none select-none">
          {mobileOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 z-50 p-4 flex flex-col gap-1 shadow-lg">
          <a
            href="/#about"
            onClick={() => setMobileOpen(false)}
            className="text-left px-[16px] py-[12px] rounded-[10px] text-[16px] text-gray-800 hover:bg-gray-100"
          >
            About Us
          </a>
          <button
            onClick={() => { navigate('/events'); setMobileOpen(false); }}
            className="text-left px-[16px] py-[12px] rounded-[10px] text-[16px] text-gray-800 hover:bg-gray-100"
          >
            Events
          </button>
          <button
            onClick={() => { navigate('/projects'); setMobileOpen(false); }}
            className="text-left px-[16px] py-[12px] rounded-[10px] text-[16px] text-gray-800 hover:bg-gray-100"
          >
            Projects
          </button>
          {isAdmin && (
            <button
              onClick={() => { navigate('/admin'); setMobileOpen(false); }}
              className="text-left px-[16px] py-[12px] rounded-[10px] text-[16px] text-gray-800 hover:bg-gray-100"
            >
              Admin
            </button>
          )}
          <button
            onClick={isLoggedIn ? handleLogout : () => { navigate('/login'); setMobileOpen(false); }}
            className="text-left px-[16px] py-[12px] rounded-[10px] text-[16px] text-gray-800 hover:bg-gray-100 border-t border-gray-100 mt-1 pt-[13px]"
          >
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>
      )}
    </nav>
  );
}
