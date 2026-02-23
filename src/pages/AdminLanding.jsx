import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';

const BASE = process.env.REACT_APP_API_URL;

const EMPTY_FORM = {
  position: '',
  display_name: '',
  description: '',
  member_id: '',
  display_order: 0,
};

export default function AdminLanding() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allMembers, setAllMembers] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [creatingSaving, setCreatingSaving] = useState(false);

  const [toast, setToast] = useState(null);

  /* ── Toast ── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch cards ── */
  const fetchCards = async () => {
    try {
      const res = await fetch(`${BASE}/api/admin-cards`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setCards(data.cards ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch members for select ── */
  const fetchAllMembers = async () => {
    try {
      const res = await fetch(`${BASE}/api/adminpage/members_list`);
      if (!res.ok) return;
      const data = await res.json();
      setAllMembers((data.members ?? []).filter((m) => m.is_active));
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    fetchCards();
    fetchAllMembers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Edit ── */
  const handleEdit = (card) => {
    setEditingId(card.id);
    setEditForm({
      position: card.position ?? '',
      display_name: card.display_name ?? '',
      description: card.description ?? '',
      member_id: card.member_id ?? '',
      display_order: card.display_order ?? 0,
    });
  };

  const handleFormChange = (field, value) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleCancelEdit = () => setEditingId(null);

  /* ── Save → PUT /api/adminpage/admin-cards/:id ── */
  const handleSave = async (id) => {
    if (!editForm.position.trim() || !editForm.display_name.trim()) {
      showToast('Position and Display Name are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const body = {
        position: editForm.position.trim(),
        display_name: editForm.display_name.trim(),
        description: editForm.description.trim() || null,
        member_id: editForm.member_id ? Number(editForm.member_id) : null,
        display_order: Number(editForm.display_order),
      };
      const res = await fetch(`${BASE}/api/adminpage/admin-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setEditingId(null);
      showToast(`"${body.display_name}" saved.`);
      await fetchCards();
    } catch (err) {
      showToast(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Create → POST /api/adminpage/admin-cards ── */
  const handleCreateChange = (field, value) =>
    setCreateForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = async () => {
    if (!createForm.position.trim() || !createForm.display_name.trim()) {
      showToast('Position and Display Name are required.', 'error');
      return;
    }
    setCreatingSaving(true);
    try {
      const body = {
        position: createForm.position.trim(),
        display_name: createForm.display_name.trim(),
        description: createForm.description.trim() || null,
        member_id: createForm.member_id ? Number(createForm.member_id) : null,
        display_order: Number(createForm.display_order),
      };
      const res = await fetch(`${BASE}/api/adminpage/admin-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setCreateForm(EMPTY_FORM);
      setCreating(false);
      showToast(`"${data.card.display_name}" created.`);
      await fetchCards();
    } catch (err) {
      showToast(`Failed to create: ${err.message}`, 'error');
    } finally {
      setCreatingSaving(false);
    }
  };

  /* ── Delete → DELETE /api/adminpage/admin-cards/:id ── */
  const handleDelete = async (card) => {
    if (!window.confirm(`Delete "${card.display_name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${BASE}/api/adminpage/admin-cards/${card.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      showToast(`"${card.display_name}" deleted.`);
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, 'error');
    }
  };

  /* ── Form fields ── */
  const renderForm = (formValues, onChange, onSubmit, submitLabel) => (
    <>
      {/* Position */}
      <label className="flex flex-col gap-1 text-gray-400 text-[13px]">
        Position *
        <input
          type="text"
          placeholder="e.g. President"
          className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 text-white text-[15px] focus:outline-none focus:border-nyu-purple"
          value={formValues.position}
          onChange={(e) => onChange('position', e.target.value)}
        />
      </label>

      {/* Display Name */}
      <label className="flex flex-col gap-1 text-gray-400 text-[13px]">
        Display Name *
        <input
          type="text"
          placeholder="e.g. John Doe"
          className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 text-white text-[15px] focus:outline-none focus:border-nyu-purple"
          value={formValues.display_name}
          onChange={(e) => onChange('display_name', e.target.value)}
        />
      </label>

      {/* Description */}
      <label className="flex flex-col gap-1 text-gray-400 text-[13px]">
        Description
        <textarea
          rows={3}
          placeholder="Short bio or role description"
          className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 text-white text-[15px] focus:outline-none focus:border-nyu-purple resize-none"
          value={formValues.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </label>

      {/* Linked Member */}
      <label className="flex flex-col gap-1 text-gray-400 text-[13px]">
        Linked Member (for photo)
        <div className="relative">
          <select
            className="w-full appearance-none bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 pr-9 text-white text-[15px] focus:outline-none focus:border-nyu-purple cursor-pointer"
            value={formValues.member_id}
            onChange={(e) => onChange('member_id', e.target.value)}
          >
            <option value="">— None —</option>
            {allMembers.map((m) => (
              <option key={m.member_id} value={m.member_id}>
                {m.english_name}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </label>

      {/* Display Order */}
      <label className="flex flex-col gap-1 text-gray-400 text-[13px]">
        Display Order
        <input
          type="number"
          min={0}
          className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 text-white text-[15px] focus:outline-none focus:border-nyu-purple w-32"
          value={formValues.display_order}
          onChange={(e) => onChange('display_order', e.target.value)}
        />
      </label>

      <button
        onClick={onSubmit}
        disabled={submitLabel === 'Saving...' || submitLabel === 'Creating...'}
        className="py-[10px] bg-nyu-purple text-white rounded-full text-[15px] font-semibold hover:opacity-80 disabled:opacity-50 transition-opacity mt-1"
      >
        {submitLabel}
      </button>
    </>
  );

  /* ── Card ── */
  const renderCard = (card) => {
    const isEditing = editingId === card.id;
    const memberName = allMembers.find((m) => m.member_id === card.member_id)?.english_name;

    return (
      <div
        key={card.id}
        className="bg-[#1a1a1a] border border-gray-700 rounded-[20px] overflow-hidden flex flex-col"
      >
        <div className="p-4 md:p-8 flex flex-col gap-4 flex-1">
          {isEditing ? (
            <>
              <p className="text-nyu-purple text-[13px] font-semibold uppercase tracking-wider">
                Editing Card #{card.id}
              </p>
              {renderForm(
                editForm,
                handleFormChange,
                () => handleSave(card.id),
                saving ? 'Saving...' : 'Save',
              )}
              <button
                onClick={handleCancelEdit}
                className="py-[10px] border border-gray-600 text-gray-300 rounded-full text-[15px] hover:bg-[#2a2a2a] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-nyu-purple text-[11px] font-semibold uppercase tracking-widest mb-1">
                    Order #{card.display_order}
                  </p>
                  <h3 className="text-[20px] md:text-[26px] font-bold text-white leading-snug">
                    {card.display_name}
                  </h3>
                  <p className="text-gray-400 text-[13px] md:text-[14px]">{card.position}</p>
                </div>
              </div>

              {card.description && (
                <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed">
                  {card.description}
                </p>
              )}

              {memberName && (
                <p className="text-[12px] text-gray-500">
                  Linked member: <span className="text-gray-300">{memberName}</span>
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleEdit(card)}
                  className="flex-1 py-[10px] border border-gray-600 text-gray-300 rounded-full text-[14px] md:text-[15px] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card)}
                  className="flex-1 py-[10px] border border-red-700 text-red-400 rounded-full text-[14px] md:text-[15px] hover:bg-red-900 hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-[32px] md:text-[56px] font-bold text-white leading-tight">
            Landing <span className="text-nyu-purple">Management</span>
          </h1>
          <button
            onClick={() => { setCreating((v) => !v); setCreateForm(EMPTY_FORM); }}
            className="shrink-0 mt-1 md:mt-3 px-4 md:px-6 py-2 md:py-3 bg-nyu-purple text-white rounded-full text-[13px] md:text-[15px] font-semibold hover:opacity-80 transition-opacity"
          >
            {creating ? 'Cancel' : '+ Add Card'}
          </button>
        </div>
        <p className="text-gray-400 text-[14px] md:text-[18px] mb-8 md:mb-12">
          Manage the "Meet Our Admin" cards shown on the landing page.
        </p>

        {/* ── Create Form ── */}
        {creating && (
          <div className="bg-[#1a1a1a] border border-nyu-purple rounded-[20px] p-4 md:p-8 mb-8 md:mb-10 flex flex-col gap-4">
            <p className="text-nyu-purple text-[13px] font-semibold uppercase tracking-wider">
              New Card
            </p>
            {renderForm(
              createForm,
              handleCreateChange,
              handleCreate,
              creatingSaving ? 'Creating...' : 'Create Card',
            )}
          </div>
        )}

        {loading && (
          <p className="text-gray-400 text-[15px] text-center py-16">Loading cards...</p>
        )}
        {error && (
          <p className="text-red-400 text-[15px] text-center py-16">{error}</p>
        )}
        {!loading && !error && cards.length === 0 && (
          <p className="text-gray-500 text-[15px] text-center py-16">No cards yet. Add one above.</p>
        )}
        {!loading && !error && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
            {cards.map(renderCard)}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-4 md:right-8 left-4 md:left-auto px-5 py-3 rounded-[12px] text-white text-[14px] shadow-lg z-50 ${
            toast.type === 'error' ? 'bg-red-700' : 'bg-green-700'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
