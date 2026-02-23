import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';

// ── API endpoints ──────────────────────────────────────────────
const API = {
  members:  '/api/adminpage/members_list',
  allPhotos: '/api/retrieve-all-photos',
  upload:   '/api/photos/upload',
  update:   '/api/photos/update',   // PUT  { link_id, description, linked_member_id }
  delete:   '/api/photos/delete',   // DELETE { link_id, photo_id }
};
// ──────────────────────────────────────────────────────────────

function getNYDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

// ── Shared sub-components ──────────────────────────────────────
function SelectArrow() {
  return (
    <svg
      className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
// ──────────────────────────────────────────────────────────────

export default function AdminPhotos() {
  const [tab, setTab] = useState('upload');

  // ── Shared: members list ──
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // ── Upload state ──
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [upDesc, setUpDesc] = useState('');
  const [upLinkedMember, setUpLinkedMember] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploadOk, setUploadOk] = useState(false);

  // ── Gallery state ──
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [editingId, setEditingId] = useState(null); // link_id being edited
  const [editDesc, setEditDesc] = useState('');
  const [editMember, setEditMember] = useState('');
  const [saving, setSaving] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState('');
  const [galleryOk, setGalleryOk] = useState(false);
  const [deleting, setDeleting] = useState(null); // link_id being deleted

  // ── Fetch members ──
  useEffect(() => {
    const run = async () => {
      setMembersLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}${API.members}`);
        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setMembersLoading(false);
      }
    };
    run();
  }, []);

  // ── Fetch photos when gallery tab opens ──
  const fetchPhotos = async () => {
    setPhotosLoading(true);
    setGalleryMsg('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}${API.allPhotos}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error('Failed to load photos:', err);
      setGalleryOk(false);
      setGalleryMsg(`Failed to load photos (${err.message})`);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'gallery') fetchPhotos();
  }, [tab]);

  // ── Upload handlers ──
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setUploadMsg('');
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setUploadMsg('Please select a file.'); setUploadOk(false); return; }
    if (!upLinkedMember) { setUploadMsg('Please select a member.'); setUploadOk(false); return; }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.member_id) { setUploadMsg('Could not identify logged-in user.'); setUploadOk(false); return; }

    setUploading(true);
    setUploadMsg('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('date', getNYDate());
    fd.append('description', upDesc);
    fd.append('member_id', user.member_id);
    fd.append('linked_member_id', upLinkedMember);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}${API.upload}`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setUploadOk(true);
      setUploadMsg(`Uploaded! Photo ID: ${data.photo?.photo_id}`);
      setFile(null); setPreview(null); setUpDesc(''); setUpLinkedMember(''); setFileInputKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setUploadOk(false);
      setUploadMsg('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Gallery handlers ──
  const startEdit = (photo) => {
    setEditingId(photo.photo_id);
    setEditDesc(photo.description || '');
    setEditMember(photo.member_id ? String(photo.member_id) : '');
    setGalleryMsg('');
  };

  const cancelEdit = () => { setEditingId(null); setGalleryMsg(''); };

  const handleSaveEdit = async (photo) => {
    setSaving(true);
    setGalleryMsg('');
    try {
      const body = { photo_id: photo.photo_id, description: editDesc };
      if (photo.source === 'member') {
        if (photo.link_id) body.link_id = photo.link_id;
        if (editMember) body.linked_member_id = Number(editMember);
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}${API.update}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setGalleryOk(true);
      setGalleryMsg('Saved successfully!');
      setEditingId(null);
      fetchPhotos();
    } catch (err) {
      console.error(err);
      setGalleryOk(false);
      setGalleryMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (photo) => {
    setDeleting(photo.photo_id);
    setGalleryMsg('');
    try {
      const body = { photo_id: photo.photo_id };
      if (photo.source === 'member' && photo.link_id) body.link_id = photo.link_id;
      if (photo.source === 'project' && photo.project_id) body.project_id = photo.project_id;
      const res = await fetch(`${process.env.REACT_APP_API_URL}${API.delete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setGalleryOk(true);
      setGalleryMsg('Deleted.');
      fetchPhotos();
    } catch (err) {
      console.error(err);
      setGalleryOk(false);
      setGalleryMsg('Failed to delete.');
    } finally {
      setDeleting(null);
    }
  };

  const getMemberName = (id) => {
    const m = members.find((m) => m.member_id === id);
    return m ? `${m.english_name} (${m.korean_name})` : `Member #${id}`;
  };

  const visiblePhotos = sourceFilter === 'all'
    ? photos
    : photos.filter((p) => p.source === sourceFilter);

  // ── Style constants ──
  const inputClass = 'bg-[#2a2a2a] text-gray-300 border border-gray-700 rounded-lg px-[14px] py-[10px] text-[14px] w-full focus:outline-none focus:border-gray-500 placeholder-gray-600';
  const selectClass = 'appearance-none bg-[#2a2a2a] text-gray-300 border border-gray-700 rounded-lg pl-[14px] pr-[36px] py-[10px] text-[14px] w-full focus:outline-none focus:border-gray-500 cursor-pointer disabled:opacity-50';
  const labelClass = 'block text-[13px] text-gray-400 mb-[6px]';

  const tabBase = 'px-[20px] py-[9px] rounded-full text-[15px] border transition-colors';
  const tabActive = `${tabBase} bg-[#2a2a2a] text-white border-gray-700`;
  const tabInactive = `${tabBase} text-gray-400 border-gray-700 hover:bg-[#2a2a2a] hover:text-white`;

  const filterBase = 'px-[14px] py-[6px] rounded-full text-[13px] border transition-colors';
  const filterActive = `${filterBase} bg-[#2a2a2a] text-white border-gray-600`;
  const filterInactive = `${filterBase} text-gray-500 border-gray-700 hover:text-gray-300`;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      <div className="px-4 md:px-[32px] py-[32px] md:py-[40px]">
        <h1 className="text-[28px] md:text-[48px] font-bold text-white text-center mb-[24px] md:mb-[32px]">
          Photo Management
        </h1>

        {/* ── Tabs ── */}
        <div className="flex justify-center gap-[8px] mb-[32px]">
          <button onClick={() => setTab('upload')} className={tab === 'upload' ? tabActive : tabInactive}>
            Upload
          </button>
          <button onClick={() => setTab('gallery')} className={tab === 'gallery' ? tabActive : tabInactive}>
            All Photos
          </button>
        </div>

        {/* ════════ UPLOAD TAB ════════ */}
        {tab === 'upload' && (
          <form
            onSubmit={handleUpload}
            className="bg-[#1a1a1a] border border-gray-800 rounded-[16px] p-[20px] md:p-[32px] flex flex-col gap-[20px] w-full max-w-[600px] mx-auto"
          >
            {/* File picker */}
            <div>
              <label className={labelClass}>Photo File *</label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-700 rounded-[12px] cursor-pointer hover:border-gray-500 active:border-gray-400 transition-colors overflow-hidden">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full max-h-[240px] md:max-h-[300px] object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-[8px] text-gray-500 py-[36px] md:py-[48px]">
                    <svg className="w-9 h-9 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[14px]">Tap to select image</span>
                    <span className="text-[12px]">JPG, PNG, WEBP</span>
                  </div>
                )}
                <input key={fileInputKey} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {file && <p className="mt-[6px] text-[12px] text-gray-500 truncate">{file.name}</p>}
            </div>

            {/* Member in Photo */}
            <div>
              <label className={labelClass}>Member in Photo *</label>
              <div className="relative">
                <select
                  value={upLinkedMember}
                  onChange={(e) => { setUpLinkedMember(e.target.value); setUploadMsg(''); }}
                  className={selectClass}
                  disabled={membersLoading}
                >
                  <option value="">{membersLoading ? 'Loading...' : 'Select member'}</option>
                  {members.map((m) => (
                    <option key={m.member_id} value={m.member_id}>
                      {m.english_name} ({m.korean_name})
                    </option>
                  ))}
                </select>
                <SelectArrow />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={upDesc}
                onChange={(e) => setUpDesc(e.target.value)}
                placeholder="Enter photo description..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-[12px] pt-[4px]">
              <button
                type="submit"
                disabled={uploading}
                className="w-full sm:w-auto px-[28px] py-[12px] sm:py-[10px] bg-nyu-purple text-white rounded-full text-[15px] font-medium hover:opacity-80 active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              {uploadMsg && (
                <span className={`text-[14px] text-center sm:text-left ${uploadOk ? 'text-green-400' : 'text-red-400'}`}>
                  {uploadMsg}
                </span>
              )}
            </div>
          </form>
        )}

        {/* ════════ GALLERY TAB ════════ */}
        {tab === 'gallery' && (
          <div>
            {/* Filter + status bar */}
            <div className="flex flex-wrap items-center gap-[8px] mb-[20px]">
              <div className="flex gap-[6px]">
                {['all', 'member', 'project'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSourceFilter(s)}
                    className={sourceFilter === s ? filterActive : filterInactive}
                  >
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              {!photosLoading && (
                <span className="text-[13px] text-gray-600 ml-[4px]">
                  {visiblePhotos.length} photo{visiblePhotos.length !== 1 ? 's' : ''}
                </span>
              )}
              <button
                onClick={fetchPhotos}
                className="ml-auto text-[13px] text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-[4px]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Gallery message */}
            {galleryMsg && (
              <p className={`text-[14px] mb-[16px] ${galleryOk ? 'text-green-400' : 'text-red-400'}`}>
                {galleryMsg}
              </p>
            )}

            {photosLoading ? (
              <p className="text-white text-center text-[20px] mt-[60px]">Loading photos...</p>
            ) : visiblePhotos.length === 0 ? (
              <p className="text-gray-600 text-center text-[16px] mt-[60px]">No photos found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {visiblePhotos.map((photo) => {
                  const isEditing = editingId === photo.photo_id;
                  const isDeleting = deleting === photo.photo_id;

                  return (
                    <div
                      key={photo.link_id}
                      className="bg-[#1a1a1a] border border-gray-800 rounded-[12px] overflow-hidden flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full aspect-[4/3] bg-[#2a2a2a] overflow-hidden shrink-0">
                        <img
                          src={photo.photo_url}
                          alt={photo.description || 'Photo'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Source badge */}
                        <span className={`absolute top-[8px] left-[8px] px-[8px] py-[3px] rounded-full text-[11px] font-medium ${
                          photo.source === 'member'
                            ? 'bg-blue-900/80 text-blue-300'
                            : 'bg-purple-900/80 text-purple-300'
                        }`}>
                          {photo.source === 'member' ? 'Member' : 'Project'}
                        </span>
                      </div>

                      {/* Card body */}
                      <div className="p-[14px] flex flex-col gap-[10px] flex-1">
                        {isEditing ? (
                          /* ── Edit mode ── */
                          <>
                            {photo.source === 'member' && (
                              <div>
                                <label className={labelClass}>Member in Photo</label>
                                <div className="relative">
                                  <select
                                    value={editMember}
                                    onChange={(e) => setEditMember(e.target.value)}
                                    className="appearance-none bg-[#2a2a2a] text-gray-300 border border-gray-700 rounded-lg pl-[10px] pr-[28px] py-[7px] text-[13px] w-full focus:outline-none focus:border-gray-500 cursor-pointer"
                                    disabled={membersLoading}
                                  >
                                    <option value="">Select member</option>
                                    {members.map((m) => (
                                      <option key={m.member_id} value={m.member_id}>
                                        {m.english_name} ({m.korean_name})
                                      </option>
                                    ))}
                                  </select>
                                  <SelectArrow />
                                </div>
                              </div>
                            )}
                            <div>
                              <label className={labelClass}>Description</label>
                              <textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                rows={3}
                                className="bg-[#2a2a2a] text-gray-300 border border-gray-700 rounded-lg px-[10px] py-[7px] text-[13px] w-full focus:outline-none focus:border-gray-500 resize-none placeholder-gray-600"
                                placeholder="Description..."
                              />
                            </div>
                            <div className="flex gap-[8px] mt-[2px]">
                              <button
                                onClick={() => handleSaveEdit(photo)}
                                disabled={saving}
                                className="flex-1 py-[7px] bg-nyu-purple text-white rounded-full text-[13px] font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={saving}
                                className="flex-1 py-[7px] bg-[#2a2a2a] text-gray-300 rounded-full text-[13px] border border-gray-700 hover:bg-[#333] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          /* ── View mode ── */
                          <>
                            <div className="flex items-start justify-between gap-[8px]">
                              <div className="flex flex-col gap-[3px] min-w-0">
                                <span className="text-[12px] text-gray-500">{photo.date || '—'}</span>
                                {photo.source === 'member' && photo.member_id && (
                                  <span className="text-[13px] text-gray-300 truncate">
                                    {getMemberName(photo.member_id)}
                                  </span>
                                )}
                                {photo.source === 'project' && photo.project_id && (
                                  <span className="text-[13px] text-gray-300">Project #{photo.project_id}</span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-600 shrink-0">#{photo.photo_id}</span>
                            </div>

                            {photo.description && (
                              <p className="text-[13px] text-gray-400 line-clamp-2">{photo.description}</p>
                            )}

                            <div className="flex gap-[8px] mt-auto pt-[4px]">
                              <button
                                onClick={() => startEdit(photo)}
                                className="flex-1 py-[6px] text-[13px] text-gray-300 bg-[#2a2a2a] rounded-full border border-gray-700 hover:bg-[#333] transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(photo)}
                                disabled={isDeleting}
                                className="flex-1 py-[6px] text-[13px] text-red-400 bg-transparent rounded-full border border-red-900 hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                              >
                                {isDeleting ? '...' : 'Delete'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
