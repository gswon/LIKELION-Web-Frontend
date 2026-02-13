import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

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

function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calendar/events`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      // Transform API data to react-big-calendar format
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
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nyu-purple to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">멋쟁이사자처럼 캘린더</h1>
              <p className="text-purple-200 mt-1">팀 일정을 한눈에 확인하세요</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-custom">
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

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
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
                      color: eventCategories[selectedEvent.category]?.color
                    }}
                  >
                    {selectedEvent.category}
                  </span>
                </div>
                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mt-6">
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

                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700">{selectedEvent.location}</p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">참석자 ({selectedEvent.attendees.length}명)</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.attendees.map((attendee, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {attendee}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={closeEventModal}
                  className="w-full py-3 bg-nyu-purple hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
