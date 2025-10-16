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

import { useState } from 'react';

export default function MemberRegistration() {
  // 1. 모든 입력 데이터를 하나의 state로 관리
  const [formData, setFormData] = useState({
    korean_name: '',
    english_name: '',
    graduate_year: '',
    school_email: '',
    is_admin: false,
    current_university: '',
    team: '',
    is_undergraduate: false,
    is_mentor: false,
    is_graduated: false,
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. 입력값이 변경될 때 실행되는 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 3. 제출 함수 (POST 요청)
  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch('https://your-backend-api.com/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          graduate_year: parseInt(formData.graduate_year)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ 회원 정보가 성공적으로 등록되었습니다!');
        console.log('서버 응답:', result);
        
        // 폼 초기화
        setFormData({
          korean_name: '',
          english_name: '',
          graduate_year: '',
          school_email: '',
          is_admin: false,
          current_university: '',
          team: '',
          is_undergraduate: false,
          is_mentor: false,
          is_graduated: false,
          is_active: true
        });
      } else {
        setMessage('❌ 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setMessage('❌ 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          회원 정보 등록
        </h1>

        <div className="space-y-6">
          {/* 한글 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              한글 이름 *
            </label>
            <input
              type="text"
              name="korean_name"
              value={formData.korean_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="홍길동"
            />
          </div>

          {/* 영문 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              영문 이름 *
            </label>
            <input
              type="text"
              name="english_name"
              value={formData.english_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Hong Gildong"
            />
          </div>

          {/* 졸업 연도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              졸업 연도 *
            </label>
            <input
              type="number"
              name="graduate_year"
              value={formData.graduate_year}
              onChange={handleChange}
              min="1900"
              max="2100"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2024"
            />
          </div>

          {/* 학교 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학교 이메일 *
            </label>
            <input
              type="email"
              name="school_email"
              value={formData.school_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@university.edu"
            />
          </div>

          {/* 현재 학교 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 대학교 *
            </label>
            <input
              type="text"
              name="current_university"
              value={formData.current_university}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="서울대학교"
            />
          </div>

          {/* 팀 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트/스터디 팀
            </label>
            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="개발팀"
            />
          </div>

          {/* 체크박스들 */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_undergraduate"
                checked={formData.is_undergraduate}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                학사 과정
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_graduated"
                checked={formData.is_graduated}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                졸업 여부
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_mentor"
                checked={formData.is_mentor}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                멘토
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                현재 활동중
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_admin"
                checked={formData.is_admin}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                관리자 권한
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? '등록 중...' : '회원 등록'}
          </button>

          {/* 메시지 표시 */}
          {message && (
            <div className={`p-4 rounded-md text-center font-medium ${
              message.includes('성공') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* 현재 입력된 데이터 미리보기 (개발용) */}
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">입력 데이터 미리보기:</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}