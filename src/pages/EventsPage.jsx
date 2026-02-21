import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PublicNav from '../components/PublicNav';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventCategories = {
  'Ideathon': { color: '#FF6000', bgColor: '#FFF4ED' },
  'Project Meeting': { color: '#57068c', bgColor: '#F3E8FF' },
  'Study': { color: '#059669', bgColor: '#D1FAE5' },
  'GM': { color: '#DC2626', bgColor: '#FEE2E2' },
  'Team Dinner': { color: '#2563EB', bgColor: '#DBEAFE' },
  'Session': { color: '#9333EA', bgColor: '#F3E8FF' },
};

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calHeight, setCalHeight] = useState(() => window.innerWidth < 768 ? 450 : 700);
  const [currentView, setCurrentView] = useState('month');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const handleResize = () => setCalHeight(window.innerWidth < 768 ? 450 : 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNav />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-nyu-purple to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div>
            <h1 className="text-[28px] md:text-4xl font-bold leading-tight md:leading-normal">Events</h1>
            <p className="text-purple-200 mt-1 md:mt-2 text-[14px] md:text-lg">Check out LIKELION NYU's upcoming events</p>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 shadow-custom">
          <h3 className="font-semibold mb-2 md:mb-3 text-gray-700 text-[14px] md:text-base">Categories</h3>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {Object.entries(eventCategories).map(([category, style]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: style.color }} />
                <span className="text-gray-600 text-xs md:text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-3 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-nyu-purple text-xl">Loading...</div>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: calHeight }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onNavigate={handleNavigate}
              date={currentDate}
              view={currentView}
              onView={(view) => setCurrentView(view)}
              culture="en-US"
              messages={{
                next: 'Next',
                previous: 'Back',
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                agenda: 'Agenda',
                date: 'Date',
                time: 'Time',
                event: 'Event',
                noEventsInRange: 'No events in this period.',
                showMore: (total) => `+${total} more`,
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
              className="p-4 md:p-6 border-l-8 rounded-t-lg"
              style={{ borderColor: eventCategories[selectedEvent.category]?.color || '#000' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight md:leading-normal">{selectedEvent.title}</h2>
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
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-700 font-medium text-[14px] md:text-base">
                      {format(selectedEvent.start, 'MMM d, yyyy (EEE) HH:mm', { locale: enUS })}
                    </p>
                    <p className="text-gray-500 text-sm">
                      ~ {format(selectedEvent.end, 'MMM d, yyyy (EEE) HH:mm', { locale: enUS })}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700 text-[14px] md:text-base">{selectedEvent.location}</p>
                  </div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p className="text-gray-700 whitespace-pre-wrap text-[14px] md:text-base">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => { setShowDetailModal(false); setSelectedEvent(null); }}
                  className="w-full py-2 md:py-3 bg-nyu-purple hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold text-[14px] md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
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
