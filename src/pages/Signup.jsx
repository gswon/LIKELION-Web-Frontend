// login api - 백앤드로 보내야할것들
// member_id: int8		primary
// korean_name: varchar
// english_name: varchar
// graduate_year: int4
// school_email: varchar
// is_admin: bool
// current_university: text	현재 학교 이름
// team: varchar			프로젝트/스터디 팀
// is_undergraduate: bool	학사인지 아닌지
// is_mentor: bool		멘토 여부 (회사도 포함시켜야 하나?)
// is_graduated: bool		졸업 여부
// is_active: bool			현재 활동중인지 여부

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school_email: '',
    password: '',
    korean_name: '',
    english_name: '',
    graduate_year: '',
    current_university: '',
    team: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [showActivitiesMenu, setShowActivitiesMenu] = useState(false);
  const closeTimer = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    // 1. 공백 검사
    if (
      !formData.school_email.trim() ||
      !formData.password.trim() ||
      !formData.korean_name.trim() ||
      !formData.english_name.trim() ||
      !formData.graduate_year.trim() ||
      !formData.current_university.trim() ||
      !formData.team.trim()
    ) {
      setMessage('All fields are required.');
      setLoading(false);
      return;
    }

    // 2-1. Korean Name 검증 (한글만)
    if (!/^[가-힣]+$/.test(formData.korean_name)) {
      setMessage('Korean Name must contain only Korean characters.');
      setLoading(false);
      return;
    }

    // 2-2. Korean Name 길이 제한
    if (formData.korean_name.length > 10) {
      setMessage('Korean Name must be at most 10 characters.');
      setLoading(false);
      return;
    }

    // 3-1. English Name 검증 (영어 + 자동 uppercase formatting)
    if (!/^[A-Za-z\s]+$/.test(formData.english_name)) {
      setMessage('English name must contain only English letters.');
      setLoading(false);
      return;
    }

    // 3-2. English Name 길이 제한
    if (formData.english_name.length > 50) {
      setMessage('English Name must be at most 50 characters.');
      setLoading(false);
      return;
    }

    // 3-3. English Name 자동 Capitalization
    formData.english_name = formData.english_name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    // 4. 이메일 검증 (@ + .edu 포함)
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu$/.test(formData.school_email)
    ) {
      setMessage('School Email must be a valid email address.');
      setLoading(false);
      return;
    }

    // 5. Password 공백 금지
    if (/\s/.test(formData.password)) {
      setMessage('Password cannot contain spaces.');
      setLoading(false);
      return;
    }

    // 6-1. Graduation Year 숫자 확인 (이미 입력 단계에서 제한 걸었지만 한 번 더!)
    if (!/^\d+$/.test(formData.graduate_year)) {
      setMessage('Graduation year must contain only integers.');
      setLoading(false);
      return;
    }

    // 6-2. Graduation Year 범위 확인 (1950 ~ 2050)
    const yearNum = Number(formData.graduate_year);
    if (yearNum < 1950 || yearNum > 2050) {
      setMessage('Graduation year must be between 1950 and 2050.');
      setLoading(false);
      return;
    }

    // 에러 조건들을 모두 통과하면 여기서 백엔드 요청
    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            graduate_year: parseInt(formData.graduate_year),
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage('Sign Up was Successful!');
        console.log('서버 응답:', result);

        // 폼 초기화
        setFormData({
          school_email: '',
          password: '',
          korean_name: '',
          english_name: '',
          graduate_year: '',
          current_university: '',
          team: '',
        });

        setTimeout(() => {
          navigate('/');
        }, 1000); // 1초 후 이동 (성공 메시지를 보여주기 위함)
      } else if (response.status === 400) {
        setMessage(result.error);
      } else {
        setMessage(result.error || 'Failed to Sign Up');
      }
    } catch (error) {
      console.error('Error Occurred:', error);
      setMessage('Failed to connect to the Server');
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
          {/* Activities Dropdown Menu */}
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
        <h1 className="text-[64px] font-bold mb-[48px]">Sign Up</h1>

        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-black rounded-[50px] px-[72px] pt-[30px] pb-[43px]">
            {/* Title */}
            <h2 className="text-[48px] font-bold text-center mb-[48px]">
              LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
            </h2>

            {/* Form */}
            <div className="space-y-[16px]">
              {/* Korean Name */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  Korean Name:
                </label>
                <input
                  type="text"
                  name="korean_name"
                  value={formData.korean_name}
                  onChange={handleChange}
                  required
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  English Name:
                </label>
                <input
                  type="text"
                  name="english_name"
                  value={formData.english_name}
                  onChange={handleChange}
                  required
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* School Email */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  School Email:
                </label>
                <input
                  type="email"
                  name="school_email"
                  value={formData.school_email}
                  onChange={handleChange}
                  required
                  placeholder="example@school.edu"
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* Current University */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  Current University:
                </label>
                <select
                  name="current_university"
                  value={formData.current_university}
                  onChange={handleChange}
                  required
                  className="w-full px-[16px] py-[9px] border border-black rounded-full bg-white focus:outline-none focus:border-nyu-purple text-[16px] appearance-none"
                >
                  <option value="" disabled>
                    Select your university
                  </option>
                  <option value="New York University">
                    New York University
                  </option>
                  <option value="School of Visual Arts">
                    School of Visual Arts
                  </option>
                  <option value="New School">New School</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  Graduation Year:
                </label>
                <input
                  type="text"
                  name="graduate_year"
                  value={formData.graduate_year}
                  onChange={(e) => {
                    // 숫자만 허용 + 길이 제한 4
                    if (/^\d{0,4}$/.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  required
                  min="1950"
                  max="2050"
                  maxLength={4}
                  placeholder="2026"
                  className="w-full px-[16px] py-[9px] border border-black rounded-full focus:outline-none focus:border-nyu-purple text-[16px]"
                />
              </div>

              {/* Team */}
              <div>
                <label className="block text-[20px] font-bold mb-[12px]">
                  Team (Project/Study):
                </label>
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  required
                  className="w-full px-[16px] py-[9px] border border-black rounded-full 
                            bg-white focus:outline-none focus:border-nyu-purple text-[16px]
                            appearance-none"
                >
                  <option value="" disabled>
                    Select your team
                  </option>

                  {/* Project Teams */}
                  <option value="Project - Website">Project - Website</option>
                  <option value="Project - NXN Labs">Project - NXN Labs</option>
                  <option value="Project - Paado">Project - Paado</option>
                  <option value="Project - IGOT!N">Project - IGOT!N</option>

                  {/* Study Teams */}
                  <option value="Study - Frontend">Study - Front-end</option>
                  <option value="Study - Backend">Study - Back-end</option>
                  <option value="Study - Data">Study - Data</option>
                  <option value="Study - UX/UI">Study - UX/UI</option>

                  {/* Other */}
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-[30px]">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-[24px] py-[8px] border border-black rounded-full text-[20px] font-normal hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
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
