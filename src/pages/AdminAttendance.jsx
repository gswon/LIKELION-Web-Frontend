import { useEffect, useState, useMemo } from 'react';
import AdminNav from '../components/AdminNav';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMeeting, setFilterMeeting] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [changes, setChanges] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/attendance_list`,
      );
      const data = await res.json();
      const sorted = (data.attendance || []).sort(
        (a, b) => b.meeting_number - a.meeting_number,
      );
      setRecords(sorted);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleStatusChange = (record, newStatus) => {
    const key = `${record.member_id}-${record.meeting_number}`;
    setChanges((prev) => ({
      ...prev,
      [key]: { member_id: record.member_id, meeting_number: record.meeting_number, status: newStatus },
    }));
    setSaveMessage('');
  };

  const handleSave = async () => {
    const updates = Object.values(changes);
    if (updates.length === 0) return;
    setSaving(true);
    setSaveMessage('');
    try {
      await Promise.all(
        updates.map((u) =>
          fetch(`${process.env.REACT_APP_API_URL}/api/adminpage/attendance_status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(u),
          }),
        ),
      );
      setChanges({});
      setSaveMessage('Saved successfully!');
      fetchAttendance();
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const meetingNumbers = useMemo(() => {
    const nums = [...new Set(records.map((r) => r.meeting_number))].sort((a, b) => b - a);
    return nums;
  }, [records]);

  const dates = useMemo(() => {
    const ds = [...new Set(records.map((r) => r.date).filter(Boolean))].sort((a, b) =>
      b.localeCompare(a),
    );
    return ds;
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterMeeting && String(r.meeting_number) !== filterMeeting) return false;
      if (filterDate && r.date !== filterDate) return false;
      return true;
    });
  }, [records, filterMeeting, filterDate]);

  const selectClass =
    'bg-[#2a2a2a] text-gray-300 border border-gray-700 rounded-full px-[16px] py-[8px] text-[14px] focus:outline-none focus:border-gray-500 cursor-pointer';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      <div className="px-4 md:px-[32px] py-[40px]">
        <h1 className="text-[32px] md:text-[48px] font-bold text-white text-center mb-[32px]">
          Attendance Session
        </h1>

        {/* Filters + Save */}
        <div className="flex flex-wrap items-center gap-[12px] mb-[24px]">
          <select
            value={filterMeeting}
            onChange={(e) => setFilterMeeting(e.target.value)}
            className={selectClass}
          >
            <option value="">All Meetings</option>
            {meetingNumbers.map((num) => (
              <option key={num} value={String(num)}>
                Meeting #{num}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              list="date-options"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date..."
              className="bg-[#2a2a2a] text-gray-300 border border-gray-700 rounded-full px-[16px] py-[8px] text-[14px] focus:outline-none focus:border-gray-500 placeholder-gray-600 w-[180px]"
            />
            <datalist id="date-options">
              {dates.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          {(filterMeeting || filterDate) && (
            <button
              onClick={() => { setFilterMeeting(''); setFilterDate(''); }}
              className="text-[14px] text-gray-400 hover:text-white underline px-[8px]"
            >
              Clear filters
            </button>
          )}

          <div className="flex items-center gap-[12px] ml-auto">
            {saveMessage && (
              <span className={`text-[14px] ${saveMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                {saveMessage}
              </span>
            )}
            {Object.keys(changes).length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-[20px] py-[8px] bg-nyu-purple text-white rounded-full text-[14px] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {saving ? 'Saving...' : `Save (${Object.keys(changes).length})`}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-white text-center text-[24px]">
            Loading attendance...
          </p>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-gray-300">
                <thead className="bg-[#2a2a2a] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Meeting #</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Korean Name</th>
                    <th className="px-4 py-3 text-left">English Name</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((r, index) => {
                      const key = `${r.member_id}-${r.meeting_number}`;
                      const currentStatus = changes[key]?.status ?? r.status;
                      const isChanged = !!changes[key];
                      return (
                        <tr
                          key={index}
                          className={`border-t border-gray-800 transition-colors ${
                            isChanged ? 'bg-[#1e2a1e]' : 'hover:bg-[#2a2a2a]'
                          }`}
                        >
                          <td className="px-4 py-3">{r.meeting_number}</td>
                          <td className="px-4 py-3">{r.date || '—'}</td>
                          <td className="px-4 py-3">{r.korean_name}</td>
                          <td className="px-4 py-3">{r.english_name}</td>
                          <td className="px-4 py-3">
                            <div className="relative inline-block">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(r, e.target.value)}
                                className={`appearance-none rounded-full pl-[12px] pr-[32px] py-[4px] text-[14px] border-0 outline-none cursor-pointer ${
                                  currentStatus === 'Present'
                                    ? 'bg-green-900 text-green-300'
                                    : currentStatus === 'Late'
                                      ? 'bg-yellow-900 text-yellow-300'
                                      : 'bg-red-900 text-red-300'
                                }`}
                              >
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                              </select>
                              <span className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-[14px]">
                                ▾
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
