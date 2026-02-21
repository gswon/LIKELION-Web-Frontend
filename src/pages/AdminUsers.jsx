import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';

export default function AdminUsers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedMembers, setEditedMembers] = useState({});
  const [deleteList, setDeleteList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/members_list`
      );
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (id, field, value) => {
    setEditedMembers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
    setSaveMessage('');
  };

  const toggleDelete = (id) => {
    setDeleteList((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
    setSaveMessage('');
  };

  const saveChanges = async () => {
    const updates = Object.entries(editedMembers)
      .filter(([id]) => !deleteList.includes(Number(id)))
      .map(([id, fields]) => ({ member_id: Number(id), ...fields }));

    const body = { updates, deletes: deleteList };
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/save_manage_members`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const result = await res.json();
      if (res.ok) {
        setSaveMessage('Saved successfully!');
        setEditedMembers({});
        setDeleteList([]);
        fetchMembers();
      } else {
        setSaveMessage(result.error || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveMessage('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.keys(editedMembers).length > 0 || deleteList.length > 0;
  const changeCount = Object.keys(editedMembers).filter(
    (id) => !deleteList.includes(Number(id))
  ).length + deleteList.length;

  const inputClass =
    'bg-transparent border-b border-transparent hover:border-gray-600 focus:border-gray-400 outline-none text-gray-300 w-full min-w-[80px]';

  const colorMap = {
    green:  { bg: 'bg-green-900',  text: 'text-green-300'  },
    red:    { bg: 'bg-red-900',    text: 'text-red-300'    },
    blue:   { bg: 'bg-blue-900',   text: 'text-blue-300'   },
    purple: { bg: 'bg-purple-900', text: 'text-purple-300' },
    yellow: { bg: 'bg-yellow-900', text: 'text-yellow-300' },
    gray:   { bg: 'bg-gray-700',   text: 'text-gray-300'   },
  };

  const BoolSelect = ({ id, field, value, isDeleted, trueLabel = 'Yes', falseLabel = 'No', trueColor = 'green', falseColor = 'red' }) => {
    const c = value ? colorMap[trueColor] : colorMap[falseColor];
    return (
      <div className="relative inline-block">
        <select
          disabled={isDeleted}
          value={String(value)}
          onChange={(e) => handleEdit(id, field, e.target.value === 'true')}
          className={`appearance-none rounded-full pl-[10px] pr-[28px] py-[3px] text-[13px] border-0 outline-none cursor-pointer disabled:cursor-not-allowed ${c.bg} ${c.text}`}
        >
          <option value="true">{trueLabel}</option>
          <option value="false">{falseLabel}</option>
        </select>
        <span className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[12px]">▾</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      <div className="px-4 md:px-[32px] py-[40px]">
        <h1 className="text-[32px] md:text-[48px] font-bold text-white text-center mb-[32px] leading-tight md:leading-normal">
          User Management
        </h1>

        {/* Save bar */}
        <div className="flex items-center justify-end gap-[12px] mb-[16px] min-h-[36px]">
          {saveMessage && (
            <span className={`text-[14px] ${saveMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {saveMessage}
            </span>
          )}
          {hasChanges && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-[20px] py-[8px] bg-nyu-purple text-white rounded-full text-[14px] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {saving ? 'Saving...' : `Save (${changeCount})`}
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-white text-center text-[20px] md:text-[24px]">
            Loading members...
          </p>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-x-auto border border-gray-800">
            <table className="w-full text-gray-300 min-w-[1400px]">
              <thead className="bg-[#2a2a2a] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Korean Name</th>
                  <th className="px-4 py-3 text-left min-w-[180px]">English Name</th>
                  <th className="px-4 py-3 text-left min-w-[220px]">Email</th>
                  <th className="px-4 py-3 text-left min-w-[180px]">University</th>
                  <th className="px-4 py-3 text-left">Team</th>
                  <th className="px-4 py-3 text-left">Grad Year</th>
                  <th className="px-4 py-3 text-left">Active</th>
                  <th className="px-4 py-3 text-left">Admin</th>
                  <th className="px-4 py-3 text-left">Undergrad</th>
                  <th className="px-4 py-3 text-left">Mentor</th>
                  <th className="px-4 py-3 text-left">Graduated</th>
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {members.length > 0 ? (
                  members.map((m, index) => {
                    const id = m.member_id;
                    const edited = editedMembers[id] || {};
                    const isDeleted = deleteList.includes(id);
                    const isEdited = !!editedMembers[id] && !isDeleted;

                    const val = (field, fallback) =>
                      edited[field] !== undefined ? edited[field] : (m[field] ?? fallback ?? '');

                    const rowClass = isDeleted
                      ? 'border-t border-gray-800 bg-red-950 opacity-60'
                      : isEdited
                        ? 'border-t border-gray-800 bg-[#1e2a1e]'
                        : 'border-t border-gray-800 hover:bg-[#2a2a2a] transition-colors';

                    return (
                      <tr key={id || index} className={rowClass}>
                        <td className="px-4 py-3 text-gray-500">{id}</td>

                        <td className="px-4 py-3">
                          <input
                            disabled={isDeleted}
                            value={val('korean_name')}
                            onChange={(e) => handleEdit(id, 'korean_name', e.target.value)}
                            className={inputClass}
                          />
                        </td>

                        <td className="px-4 py-3 min-w-[180px]">
                          <input
                            disabled={isDeleted}
                            value={val('english_name')}
                            onChange={(e) => handleEdit(id, 'english_name', e.target.value)}
                            className={`${inputClass} min-w-[150px]`}
                          />
                        </td>

                        <td className="px-4 py-3 min-w-[220px] text-gray-500">
                          {m.school_email}
                        </td>

                        <td className="px-4 py-3 min-w-[180px]">
                          <input
                            disabled={isDeleted}
                            value={val('current_university')}
                            onChange={(e) => handleEdit(id, 'current_university', e.target.value)}
                            className={`${inputClass} min-w-[150px]`}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            disabled={isDeleted}
                            value={val('team')}
                            onChange={(e) => handleEdit(id, 'team', e.target.value)}
                            className={inputClass}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            disabled={isDeleted}
                            value={val('graduate_year')}
                            onChange={(e) => handleEdit(id, 'graduate_year', Number(e.target.value))}
                            className={`${inputClass} w-[70px]`}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <BoolSelect id={id} field="is_active" value={val('is_active', m.is_active)} isDeleted={isDeleted} trueLabel="Active" falseLabel="Inactive" />
                        </td>

                        <td className="px-4 py-3">
                          <BoolSelect id={id} field="is_admin" value={val('is_admin', m.is_admin)} isDeleted={isDeleted} trueLabel="Admin" falseLabel="User" falseColor="gray" />
                        </td>

                        <td className="px-4 py-3">
                          <BoolSelect id={id} field="is_undergraduate" value={val('is_undergraduate', m.is_undergraduate)} isDeleted={isDeleted} trueLabel="Yes" falseLabel="No" trueColor="blue" falseColor="gray" />
                        </td>

                        <td className="px-4 py-3">
                          <BoolSelect id={id} field="is_mentor" value={val('is_mentor', m.is_mentor)} isDeleted={isDeleted} trueLabel="Yes" falseLabel="No" trueColor="purple" falseColor="gray" />
                        </td>

                        <td className="px-4 py-3">
                          <BoolSelect id={id} field="is_graduated" value={val('is_graduated', m.is_graduated)} isDeleted={isDeleted} trueLabel="Yes" falseLabel="No" trueColor="yellow" falseColor="gray" />
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleDelete(id)}
                            className={`px-[12px] py-[4px] rounded-full text-[13px] border transition-colors ${
                              isDeleted
                                ? 'border-red-500 text-red-400 hover:bg-red-900'
                                : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400'
                            }`}
                          >
                            {isDeleted ? 'Undo' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="13" className="px-4 py-6 text-center text-gray-500">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
