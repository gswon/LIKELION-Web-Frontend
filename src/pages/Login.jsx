import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school_email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [showActivitiesMenu, setShowActivitiesMenu] = useState(false);
  const closeTimer = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage('Login Successful!');
        console.log('서버 응답:', result);

        // 로그인 성공 후 LandingPage로 이동
        setTimeout(() => {
          navigate('/');
        }, 1000); // 1초 후 이동 (성공 메시지를 보여주기 위함)
      } else {
        console.log();
        setMessage('Missing Email or Password.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setMessage('Failed to Connect to the Server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-white">
        <div
          onClick={() => navigate('/')}
          className="flex text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
        </div>

        <div className="flex items-center gap-[48px] bg-white border border-black rounded-full px-[48px] py-[13px] font-normal ml-auto">
          <a href="#about" className="text-[20px] hover:text-nyu-purple">
            About Us
          </a>
          <a href="#members" className="text-[20px] hover:text-nyu-purple">
            Members
          </a>
          <a href="#mentoring" className="text-[20px] hover:text-nyu-purple">
            Mentoring
          </a>
          {/* Activities Hover Menu — LandingPage와 동일하게 적용 */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setShowActivitiesMenu(true);
            }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(
                () => setShowActivitiesMenu(false),
                100
              );
            }}
          >
            <span className="text-[20px] hover:text-nyu-purple cursor-pointer">
              Activities
            </span>

            {showActivitiesMenu && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-black rounded-lg shadow-lg py-2 min-w-[120px] z-50"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(
                    () => setShowActivitiesMenu(false),
                    400
                  );
                }}
              >
                <a
                  href="#events"
                  className="block px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-nyu-purple transition-colors"
                >
                  Events
                </a>
                <a
                  href="#projects"
                  className="block px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-nyu-purple transition-colors"
                >
                  Projects
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/attendance')}
            className="text-[20px] hover:text-nyu-purple bg-transparent border-none cursor-pointer"
          >
            Attendance
          </button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-[28px] py-[13px] border border-black rounded-full text-[20px] hover:bg-gray-50 text-[20px] font-normal ml-[21px]"
        >
          Log In
        </button>
      </nav>

      {/* Main Content */}
      <div className="px-[32px] py-[48px]">
        <h1 className="text-[64px] font-bold mb-[48px]">Log In</h1>

        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-black rounded-[50px] px-[72px] pt-[30px] pb-[43px]">
            {/* Title */}
            <h2 className="text-[48px] font-bold text-center mb-[48px]">
              LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
            </h2>

            {/* Form */}
            <div className="space-y-[16px]">
              {/* Email */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  Email:
                </label>
                <input
                  type="email"
                  name="school_email"
                  value={formData.school_email}
                  onChange={handleChange}
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-lg font-semibold mb-[12px]">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* Login Button */}
              <div className="flex justify-center pt-[30px]">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-[24px] py-[8px] border border-black rounded-full text-[20px] font-normal hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-[25px]">
                <p className="text-[14px]">
                  Don't have an account?{' '}
                  <span
                    onClick={() => navigate('/signup')}
                    className="text-ll-orange font-bold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </span>
                </p>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`text-center py-[12px] px-[16px] rounded-full ${
                    message.includes('Success')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 text-center">
        <a
          href="https://instagram.com/nyu_likelion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
