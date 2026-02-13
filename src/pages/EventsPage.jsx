import React, { useState, useEffect, useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

const locales = { 'ko': ko };

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
  '세션': { color: '#9333EA', bgColor: '#F3E8FF' },
};

function EventsPage() {
  const navigate = useNavigate();
  const closeTimer = useRef(null);
  const [showActivitiesMenu, setShowActivitiesMenu] = useState(false);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    event_title: '',
    category: '아이디어톤',
    start_date: '',
    end_date: '',
    location: '',
    description: '',
    is_public: true,
  });

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => setShowSuccessPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const fetchEvents = async (date) => {
    try {
      setLoading(true);
      const monthStart = format(startOfMonth(subMonths(date, 1)), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(addMonths(date, 1)), 'yyyy-MM-dd');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/events?start=${monthStart}&end=${monthEnd}`
      );

      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      const transformedEvents = (data.events || []).map((event) => ({
        id: event.event_id,
        title: event.event_title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        category: event.category,
        location: event.location,
        description: event.description,
        is_public: event.is_public,
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
        fontWeight: '500',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Form handlers
  const openAddForm = () => {
    setFormData({
      event_title: '',
      category: '아이디어톤',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      is_public: true,
    });
    setShowFormModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      event_title: formData.event_title,
      category: formData.category,
      start_date: formData.start_date,
      end_date: formData.end_date,
      location: formData.location,
      description: formData.description,
      is_public: formData.is_public,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error('Failed to create event');

      setSuccessMessage('일정이 추가되었습니다!');
      setShowSuccessPopup(true);
      setShowFormModal(false);
      fetchEvents(currentDate);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('일정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    if (!window.confirm('정말로 이 일정을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete event');

      setSuccessMessage('일정이 삭제되었습니다!');
      setShowSuccessPopup(true);
      setShowDetailModal(false);
      setSelectedEvent(null);
      fetchEvents(currentDate);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('일정 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-white">
        <div
          onClick={() => navigate('/')}
          className="flex items-center text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img src={NYULogo} alt="NYU Logo" className="h-[32px] ml-[8px]" />
        </div>

        <div className="flex items-center gap-[48px] bg-white border border-black rounded-full px-[48px] py-[13px] font-normal ml-auto shadow-button">
          <a href="/#about" className="text-[20px] hover:text-nyu-purple">
            About Us
          </a>
          <a href="/#mentoring" className="text-[20px] hover:text-nyu-purple">
            Mentoring
          </a>

          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setShowActivitiesMenu(true);
            }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => setShowActivitiesMenu(false), 400);
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
                  setShowActivitiesMenu(true);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setShowActivitiesMenu(false), 100);
                }}
              >
                <button
                  onClick={() => navigate('/events')}
                  className="block w-full text-left px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-nyu-purple transition-colors bg-transparent border-none cursor-pointer"
                >
                  Events
                </button>
                <button
                  onClick={() => navigate('/projects')}
                  className="block w-full text-left px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-nyu-purple transition-colors bg-transparent border-none cursor-pointer"
                >
                  Projects
                </button>
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
          className="px-[28px] py-[13px] border border-black rounded-full text-[20px] hover:bg-gray-50 font-normal ml-[21px] shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
        >
          Log In
        </button>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-nyu-purple to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Events</h1>
              <p className="text-purple-200 mt-2 text-lg">멋쟁이사자처럼 NYU 일정을 확인하세요</p>
            </div>
            <button
              onClick={openAddForm}
              className="px-6 py-3 bg-ll-orange hover:bg-orange-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-button hover:shadow-hover hover:-translate-y-1"
            >
              + 일정 추가
            </button>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-custom">
          <h3 className="font-semibold mb-3 text-gray-700">카테고리</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(eventCategories).map(([category, style]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: style.color }} />
                <span className="text-gray-600 text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
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
              onNavigate={handleNavigate}
              date={currentDate}
              culture="ko"
              messages={{
                next: '다음',
                previous: '이전',
                today: '오늘',
                month: '월',
                week: '주',
                day: '일',
                agenda: '일정',
                date: '날짜',
                time: '시간',
                event: '이벤트',
                noEventsInRange: '해당 기간에 일정이 없습니다.',
                showMore: (total) => `+${total} 더보기`,
              }}
            />
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div
              className="p-6 border-l-8 rounded-t-lg"
              style={{ borderColor: eventCategories[selectedEvent.category]?.color || '#000' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: eventCategories[selectedEvent.category]?.bgColor,
                      color: eventCategories[selectedEvent.category]?.color,
                    }}
                  >
                    {selectedEvent.category}
                  </span>
                </div>
                <button
                  onClick={() => { setShowDetailModal(false); setSelectedEvent(null); }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mt-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-700 font-medium">
                      {format(selectedEvent.start, 'yyyy년 M월 d일 (EEE) HH:mm', { locale: ko })}
                    </p>
                    <p className="text-gray-500 text-sm">
                      ~ {format(selectedEvent.end, 'yyyy년 M월 d일 (EEE) HH:mm', { locale: ko })}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700">{selectedEvent.location}</p>
                  </div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t flex gap-3">
                <button
                  onClick={handleDeleteEvent}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-semibold"
                >
                  삭제
                </button>
                <button
                  onClick={() => { setShowDetailModal(false); setSelectedEvent(null); }}
                  className="flex-1 py-3 bg-nyu-purple hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">일정 추가</h2>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">제목 *</label>
                <input
                  type="text"
                  name="event_title"
                  value={formData.event_title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="일정 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리 *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                >
                  {Object.keys(eventCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">시작 일시 *</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">종료 일시 *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">장소</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">설명 / 메모</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="일정에 대한 상세 설명을 입력하세요"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-nyu-purple focus:ring-nyu-purple border-gray-300 rounded"
                />
                <label className="text-sm font-semibold text-gray-700">공개 일정</label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-nyu-purple hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold"
                >
                  일정 추가
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
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
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 text-center">
        <a
          href="https://instagram.com/nyu_likelion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 hover:text-opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default EventsPage;
