import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';


export default function AttendancePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school_email: '',
    password: ''
  });
  const [searchParams] = useSearchParams();
  const meetingNumber = searchParams.get('meeting_number');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // 테스트용 - 나중에 false로 변경

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 테스트용: 팝업 자동 닫기
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2500); // 2.5초 후 자동으로 닫힘
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleAttendance = async () => {
    setLoading(true);
    setMessage('');

    try {
      // meeting_number를 포함한 데이터 준비
      const attendanceData = {
        ...formData,
        meeting_number: meetingNumber ? parseInt(meetingNumber) : 0 // URL에서 읽은 meeting_number, 없으면 기본값 0
      };

      console.log('전송할 데이터:', attendanceData); // 디버깅용

      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Attendance Successful!');
        console.log('서버 응답:', result);

        // 팝업 표시
        setShowPopup(true);

        // 폼 초기화
        setFormData({
          school_email: '',
          password: ''
        });

        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 4000); // 4초 후 팝업 닫고 이동
      } else {
        setMessage('Incorrect email or password');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setMessage('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-white">
        <div
          onClick={() => navigate('/')}
          className="flex text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
        </div>
        
        <div className="flex items-center gap-[48px] bg-white border border-black rounded-full px-[48px] py-[13px] font-normal ml-auto">
          <a href="#about" className="text-[20px] hover:text-nyu-purple">About Us</a>
          <a href="#members" className="text-[20px] hover:text-nyu-purple">Members</a>
          <a href="#mentoring" className="text-[20px] hover:text-nyu-purple">Mentoring</a>
          <a href="#activities" className="text-[20px] hover:text-nyu-purple">Activities</a>
          <button onClick={() => navigate('/attendance')} className="text-[20px] hover:text-nyu-purple bg-transparent border-none cursor-pointer">Attendance</button>
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
        <h1 className="text-[64px] font-bold mb-[48px]">Attendance</h1>

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
                  onClick={handleAttendance}
                  disabled={loading}
                  className="px-[24px] py-[8px] border border-black rounded-full text-[20px] font-normal hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`text-center py-[12px] px-[16px] rounded-full ${
                  message.includes('Success') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
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
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </footer>

      {/* Success Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <div
            className="bg-white flex flex-col items-center justify-center"
            style={{
              width: '309px',
              height: '280px',
              flexShrink: 0,
              borderRadius: '50px',
              border: '1px solid #000',
              background: '#FFF',
              fontFamily: '"Zen Kaku Gothic Antique"',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'normal',
              textAlign: 'center',
              color: '#000'
            }}
          >
            {/* Check Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="36"
              viewBox="0 0 50 36"
              fill="none"
              style={{
                width: '42.667px',
                height: '29.333px',
                flexShrink: 0,
                marginBottom: '20px'
              }}
            >
              <path
                d="M45.9999 3.33325L16.6666 32.6666L3.33325 19.3333"
                stroke="#702B9D"
                strokeWidth="6.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Text */}
            <p style={{ width: '283px', margin: 0 }}>
              Attendance Successful!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}