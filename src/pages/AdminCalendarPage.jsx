import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AdminNav from '../components/AdminNav';

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

function AdminCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [calHeight, setCalHeight] = useState(() => window.innerWidth < 768 ? 450 : 700);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Ideathon',
    start_date: '',
    end_date: '',
    location: '',
    description: '',
    attendees: '',
  });

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const handleResize = () => setCalHeight(window.innerWidth < 768 ? 450 : 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      const transformedEvents = (data.events || []).map(event => ({
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
    setIsEditMode(true);
    setFormData({
      title: event.title,
      category: event.category,
      start_date: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      end_date: format(event.end, "yyyy-MM-dd'T'HH:mm"),
      location: event.location || '',
      description: event.description || '',
      attendees: Array.isArray(event.attendees) ? event.attendees.join(', ') : '',
    });
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setIsEditMode(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      category: 'Ideathon',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      attendees: '',
    });
    setShowEventModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      event_title: formData.title,
      category: formData.category,
      start_date: formData.start_date,
      end_date: formData.end_date,
      location: formData.location,
      description: formData.description,
    };

    try {
      const url = isEditMode
        ? `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent.id}`
        : `${process.env.REACT_APP_API_URL}/api/events`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error('Failed to save event');

      setSuccessMessage(isEditMode ? 'Event updated successfully!' : 'Event added successfully!');
      setShowSuccessPopup(true);
      setShowEventModal(false);
      fetchEvents(currentDate);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('An error occurred while saving the event.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete event');

      setSuccessMessage('Event deleted successfully!');
      setShowSuccessPopup(true);
      setShowEventModal(false);
      fetchEvents(currentDate);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event.');
    }
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      {/* Add Event Button */}
      <div className="flex justify-end px-4 md:px-[32px] pt-[16px] md:pt-[24px]">
        <button
          onClick={handleAddEvent}
          className="px-[28px] py-[13px] bg-nyu-purple text-white rounded-full text-[20px] hover:opacity-80 transition-opacity"
        >
          + Add Event
        </button>
      </div>

      {/* Category Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(eventCategories).map(([category, style]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: style.color }} />
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
              onNavigate={(date) => setCurrentDate(date)}
              date={currentDate}
              view={currentView}
              onView={(view) => setCurrentView(view)}
              culture="en-US"
              messages={{
                next: '>',
                previous: '<',
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

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Event' : 'Add Event'}
                </h2>
                <button onClick={closeEventModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                >
                  {Object.keys(eventCategories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time *</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="e.g. NYU Student Center 3F / Zoom link"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Notes</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="Enter event details"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Attendees</label>
                <input
                  type="text"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nyu-purple focus:border-transparent"
                  placeholder="Enter attendee names separated by commas"
                />
                <p className="text-sm text-gray-500 mt-1">Separate multiple attendees with commas.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-semibold"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 bg-nyu-purple hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold"
                >
                  {isEditMode ? 'Save Changes' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={closeEventModal}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-semibold"
                >
                  Cancel
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
    </div>
  );
}

export default AdminCalendarPage;
