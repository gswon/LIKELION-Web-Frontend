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
            <table className="w-full text-gray-300 min-w-[900px]">
              <thead className="bg-[#2a2a2a] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Korean Name</th>
                  <th className="px-4 py-3 text-left">English Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">University</th>
                  <th className="px-4 py-3 text-left">Team</th>
                  <th className="px-4 py-3 text-left">Grad Year</th>
                  <th className="px-4 py-3 text-left">Status</th>
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

                        <td className="px-4 py-3">
                          <input
                            disabled={isDeleted}
                            value={val('english_name')}
                            onChange={(e) => handleEdit(id, 'english_name', e.target.value)}
                            className={inputClass}
                          />
                        </td>

                        <td className="px-4 py-3 text-gray-500">
                          {m.school_email}
                        </td>

                        <td className="px-4 py-3">
                          <input
                            disabled={isDeleted}
                            value={val('current_university')}
                            onChange={(e) => handleEdit(id, 'current_university', e.target.value)}
                            className={inputClass}
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
                          <div className="relative inline-block">
                            <select
                              disabled={isDeleted}
                              value={val('is_active', m.is_active)}
                              onChange={(e) => handleEdit(id, 'is_active', e.target.value === 'true')}
                              className={`appearance-none rounded-full pl-[12px] pr-[32px] py-[4px] text-[14px] border-0 outline-none cursor-pointer disabled:cursor-not-allowed ${
                                val('is_active', m.is_active)
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-red-900 text-red-300'
                              }`}
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                            <span className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-[14px]">
                              ▾
                            </span>
                          </div>
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
                    <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
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
