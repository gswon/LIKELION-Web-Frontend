import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

const locales = {
  'ko': ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventCategories = {
  '아이디어톤': { color: '#FF6000', bgColor: '#FFF4ED' },
  '프로젝트 미팅': { color: '#57068c', bgColor: '#F3E8FF' },
  '스터디': { color: '#059669', bgColor: '#D1FAE5' },
  'GM': { color: '#DC2626', bgColor: '#FEE2E2' },
  '회식': { color: '#2563EB', bgColor: '#DBEAFE' },
  '세션': { color: '#9333EA', bgColor: '#F3E8FF' }
};

function AdminCalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '아이디어톤',
    start_date: '',
    end_date: '',
    location: '',
    description: '',
    attendees: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calendar/events`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      const transformedEvents = data.map(event => ({
        id: event.event_id,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        category: event.category,
        location: event.location,
        description: event.description,
        attendees: event.attendees || []
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    const categoryStyle = eventCategories[event.category] || { color: '#000', bgColor: '#FFF' };

    return {
      style: {
        backgroundColor: categoryStyle.bgColor,
        color: categoryStyle.color,
        borderLeft: `4px solid ${categoryStyle.color}`,
        borderRadius: '4px',
        padding: '2px 5px',
        fontSize: '0.875rem',
        fontWeight: '500'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setFormData({
      title: event.title,
      category: event.category,
      start_date: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      end_date: format(event.end, "yyyy-MM-dd'T'HH:mm"),
      location: event.location || '',
      description: event.description || '',
      attendees: Array.isArray(event.attendees) ? event.attendees.join(', ') : ''
    });
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setIsEditMode(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      category: '아이디어톤',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      attendees: ''
    });
    setShowEventModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title: formData.title,
      category: formData.category,
      start_date: formData.start_date,
      end_date: formData.end_date,
      location: formData.location,
      description: formData.description,
      attendees: formData.attendees.split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      const url = isEditMode
        ? `${process.env.REACT_APP_API_URL}/api/calendar/events/${selectedEvent.id}`
        : `${process.env.REACT_APP_API_URL}/api/calendar/events`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setSuccessMessage(isEditMode ? '일정이 수정되었습니다!' : '일정이 추가되었습니다!');
      setShowSuccessPopup(true);
      setShowEventModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('일정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/calendar/events/${selectedEvent.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setSuccessMessage('일정이 삭제되었습니다!');
      setShowSuccessPopup(true);
      setShowEventModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('일정 삭제 중 오류가 발생했습니다.');
    }
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setIsEditMode(false);
  };

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
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Attendance QR
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            User Management
          </button>

          <button
            onClick={() => navigate('/admin/calendar')}
            className="px-[28px] py-[13px] rounded-full text-[20px] bg-[#2a2a2a] text-white border border-gray-700"
          >
            Calendar Management
          </button>

          <button
            onClick={() => navigate('/admin/projects')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Projects Management
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Add Event Button */}
      <div className="flex justify-end px-[32px] pt-[24px]">
        <button
          onClick={handleAddEvent}
          className="px-[28px] py-[13px] bg-nyu-purple text-white rounded-full text-[20px] hover:opacity-80 transition-opacity"
        >
          + 일정 추가
        </button>
      </div>

      {/* Category Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">카테고리</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(eventCategories).map(([category, style]) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: style.color }}
                />
                <span className="text-white text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-nyu-purple text-xl">로딩 중...</div>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              culture="ko"
              messages={{
                next: "다음",
                previous: "이전",
                today: "오늘",
                month: "월",
                week: "주",
                day: "일",
                agenda: "일정",
                date: "날짜",
                time: "시간",
                event: "이벤트",
                noEventsInRange: "해당 기간에 일정이 없습니다.",
                showMore: (total) => `+${total} 더보기`
              }}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? '일정 수정' : '일정 추가'}
                </h2>
                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="일정 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                >
                  {Object.keys(eventCategories).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    시작 일시 *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    종료 일시 *
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  장소
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="예: NYU 학생회관 3층 / Zoom 링크"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  설명 / 메모
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="일정에 대한 상세 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  참석자
                </label>
                <input
                  type="text"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="참석자 이름을 쉼표로 구분하여 입력 (예: 홍길동, 김철수, 이영희)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  쉼표(,)로 구분하여 여러 명의 참석자를 입력할 수 있습니다.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-semibold"
                  >
                    삭제
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 bg-nyu-purple hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold"
                >
                  {isEditMode ? '수정 완료' : '일정 추가'}
                </button>
                <button
                  type="button"
                  onClick={closeEventModal}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-semibold"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCalendarPage;
