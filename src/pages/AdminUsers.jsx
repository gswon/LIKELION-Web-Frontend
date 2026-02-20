import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminUsers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedMembers, setEditedMembers] = useState({});
  const [deleteList, setDeleteList] = useState([]);

  /** 🔹 멤버 로드 */
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

  /** 🔹 수정 저장 */
  const handleEdit = (id, field, value) => {
    setEditedMembers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  /** 🔹 삭제 토글 */
  const toggleDelete = (id) => {
    setDeleteList((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  /** 🔹 SAVE ALL */
  const saveChanges = async () => {
    const body = {
      updates: Object.entries(editedMembers).map(([id, fields]) => ({
        member_id: Number(id),
        ...fields,
      })),
      deletes: deleteList,
      inserts: [],
    };

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
        alert('Changes saved!');
        setEditedMembers({});
        setDeleteList([]);
        fetchMembers();
      } else {
        alert(result.error || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving changes');
    }
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
          <img src={NYULogo} alt="logo" className="h-[32px] ml-[8px]" />
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
            className="px-[28px] py-[13px] rounded-full text-[20px] bg-[#2a2a2a] text-white border border-gray-700"
          >
            User Management
          </button>

          <button
            onClick={() => navigate('/admin/calendar')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
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

      {/* CONTENT */}
      <div className="px-[32px] py-[40px]">
        <h1 className="text-[48px] font-bold text-white text-center mb-[40px]">
          User Management
        </h1>

        {loading ? (
          <p className="text-white text-center text-[24px]">
            Loading members...
          </p>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <table className="w-full text-gray-300">
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
                </tr>
              </thead>

              <tbody>
                {members.length > 0 ? (
                  members.map((m, index) => (
                    <tr
                      key={m.member_id || index}
                      className="border-t border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                    >
                      <td className="px-4 py-3">{m.member_id}</td>
                      <td className="px-4 py-3">{m.korean_name}</td>
                      <td className="px-4 py-3">{m.english_name}</td>
                      <td className="px-4 py-3">{m.school_email}</td>
                      <td className="px-4 py-3">
                        {m.current_university || 'N/A'}
                      </td>
                      <td className="px-4 py-3">{m.team || 'N/A'}</td>
                      <td className="px-4 py-3">{m.graduate_year}</td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-[12px] py-[4px] rounded-full text-[14px] ${
                            m.is_active
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {m.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex justify-center mt-[40px]">
          <button
            onClick={saveChanges}
            className="px-[40px] py-[14px] bg-nyu-purple text-white rounded-full text-[22px] hover:opacity-80 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
