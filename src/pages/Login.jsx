import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.id) {
      newErrors.id = '아이디를 입력해주세요.';
    } else if (formData.id.length < 4) {
      newErrors.id = '아이디는 최소 4자 이상이어야 합니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 여기에 실제 백엔드 API 주소를 입력하세요
      const response = await fetch('https://your-backend-api.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          password: formData.password
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ 회원가입이 완료되었습니다!');
        console.log('서버 응답:', result);
        
        // 폼 초기화
        setFormData({
          id: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.message || '회원가입에 실패했습니다.'}`);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setMessage('❌ 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            회원가입
          </h1>
          <p className="text-gray-600 text-sm">
            새 계정을 만들어보세요
          </p>
        </div>

        <div className="space-y-5">
          {/* 아이디 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.id ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="아이디를 입력하세요"
            />
            {errors.id && (
              <p className="mt-1 text-sm text-red-500">{errors.id}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>

          {/* 메시지 표시 */}
          {message && (
            <div className={`p-4 rounded-lg text-center font-medium ${
              message.includes('완료') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* 로그인 링크 */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                로그인
              </button>
            </p>
          </div>
        </div>

        {/* 입력 데이터 미리보기 (개발용) */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">
            입력 데이터 미리보기:
          </h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify({ 
              id: formData.id, 
              password: formData.password 
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}