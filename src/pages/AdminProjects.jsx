import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

const STATUS_OPTIONS = ['Planning', 'In Progress', 'Completed'];

const initialStudyTeams = [
  {
    id: 'ai-study-assistant',
    name: 'AI Study Assistant',
    team: 'Team Alpha',
    members: ['John Kim', 'Sarah Lee', 'Michael Park', 'Jessica Chen'],
    description: 'An intelligent study companion that helps students organize their learning materials, generate practice questions, and track study progress using AI technology.',
    techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
    status: 'In Progress',
    color: 'bg-blue-600',
    category: 'study',
  },
  {
    id: 'study-room-booking',
    name: 'Study Room Booking',
    team: 'Team Delta',
    members: ['Andrew Davis', 'Michelle Kim', 'Ryan Taylor'],
    description: 'Simplify the process of reserving study rooms across campus with an intuitive booking system and real-time availability.',
    techStack: ['Angular', 'Django', 'MySQL'],
    status: 'Completed',
    color: 'bg-yellow-600',
    category: 'study',
  },
];

const initialProjectTeams = [
  {
    id: 'campus-food-finder',
    name: 'Campus Food Finder',
    team: 'Team Beta',
    members: ['David Johnson', 'Emily Wang', 'Chris Martinez'],
    description: 'A mobile-friendly web app that helps NYU students discover the best food options around campus with real-time reviews and ratings.',
    techStack: ['React Native', 'Firebase', 'Google Maps API'],
    status: 'Planning',
    color: 'bg-green-600',
    category: 'project',
  },
  {
    id: 'event-management-system',
    name: 'Event Management System',
    team: 'Team Gamma',
    members: ['Rachel Brown', 'Kevin Liu', 'Amanda Garcia', 'Tom Wilson', 'Lisa Zhang'],
    description: 'A comprehensive platform for organizing and managing student events, including registration, ticketing, and attendance tracking.',
    techStack: ['Vue.js', 'Express', 'PostgreSQL', 'Stripe API'],
    status: 'In Progress',
    color: 'bg-purple-600',
    category: 'project',
  },
];

const STATUS_COLOR = {
  'Planning': 'bg-green-600',
  'In Progress': 'bg-blue-600',
  'Completed': 'bg-yellow-600',
};

export default function AdminProjects() {
  const navigate = useNavigate();

  const [studyTeams, setStudyTeams] = useState(initialStudyTeams);
  const [projectTeams, setProjectTeams] = useState(initialProjectTeams);

  // editingId: currently editing project id, null otherwise
  const [editingId, setEditingId] = useState(null);
  // editForm: draft state while editing
  const [editForm, setEditForm] = useState({});

  // feedback messages
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const allProjects = (category) =>
    category === 'study' ? studyTeams : projectTeams;

  const setProjects = (category, updated) =>
    category === 'study' ? setStudyTeams(updated) : setProjectTeams(updated);

  /* ── Edit ── */
  const handleEdit = (project) => {
    setEditingId(project.id);
    setEditForm({
      name: project.name,
      team: project.team,
      description: project.description,
      techStack: project.techStack.join(', '),
      members: project.members.join(', '),
      status: project.status,
    });
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ── Save → PUT /api/projects/:id ── */
  const handleSave = async (project) => {
    const updatedProject = {
      ...project,
      name: editForm.name.trim(),
      team: editForm.team.trim(),
      description: editForm.description.trim(),
      techStack: editForm.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      members: editForm.members.split(',').map((m) => m.trim()).filter(Boolean),
      status: editForm.status,
      color: STATUS_COLOR[editForm.status] || project.color,
    };

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const list = allProjects(project.category);
      setProjects(
        project.category,
        list.map((p) => (p.id === project.id ? updatedProject : p)),
      );
      setEditingId(null);
      showToast(`"${updatedProject.name}" saved successfully.`);
    } catch (err) {
      showToast(`Failed to save: ${err.message}`, 'error');
    }
  };

  /* ── Delete → DELETE /api/projects/:id ── */
  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const list = allProjects(project.category);
      setProjects(
        project.category,
        list.filter((p) => p.id !== project.id),
      );
      showToast(`"${project.name}" deleted.`);
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, 'error');
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  /* ── Render one project card ── */
  const renderCard = (project) => {
    const isEditing = editingId === project.id;

    return (
      <div
        key={project.id}
        className="bg-[#1a1a1a] border border-gray-700 rounded-[20px] p-[32px] flex flex-col gap-[16px]"
      >
        {isEditing ? (
          /* ── Edit Mode ── */
          <div className="flex flex-col gap-[14px]">
            <label className="flex flex-col gap-[4px] text-gray-400 text-[13px]">
              Project Name
              <input
                className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-[12px] py-[8px] text-white text-[16px] focus:outline-none focus:border-nyu-purple"
                value={editForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-[4px] text-gray-400 text-[13px]">
              Team
              <input
                className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-[12px] py-[8px] text-white text-[16px] focus:outline-none focus:border-nyu-purple"
                value={editForm.team}
                onChange={(e) => handleFormChange('team', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-[4px] text-gray-400 text-[13px]">
              Description
              <textarea
                rows={3}
                className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-[12px] py-[8px] text-white text-[16px] focus:outline-none focus:border-nyu-purple resize-none"
                value={editForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-[4px] text-gray-400 text-[13px]">
              Tech Stack <span className="text-gray-600">(comma-separated)</span>
              <input
                className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-[12px] py-[8px] text-white text-[16px] focus:outline-none focus:border-nyu-purple"
                value={editForm.techStack}
                onChange={(e) => handleFormChange('techStack', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-[4px] text-gray-400 text-[13px]">
              Members <span className="text-gray-600">(comma-separated)</span>
              <input
                className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-[12px] py-[8px] text-white text-[16px] focus:outline-none focus:border-nyu-purple"
                value={editForm.members}
                onChange={(e) => handleFormChange('members', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-[4px] text-gray-400 text-[13px]">
              Status
              <select
                className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-[12px] py-[8px] text-white text-[16px] focus:outline-none focus:border-nyu-purple"
                value={editForm.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            {/* Save / Cancel */}
            <div className="flex gap-[12px] mt-[4px]">
              <button
                onClick={() => handleSave(project)}
                className="flex-1 px-[20px] py-[10px] bg-nyu-purple text-white rounded-full text-[15px] font-semibold hover:opacity-80 transition-opacity"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-[20px] py-[10px] border border-gray-600 text-gray-300 rounded-full text-[15px] hover:bg-[#2a2a2a] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ── View Mode ── */
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-[12px]">
              <div>
                <h3 className="text-[24px] font-bold text-white mb-[4px]">{project.name}</h3>
                <p className="text-gray-400 text-[14px]">{project.team}</p>
              </div>
              <span className={`${project.color} text-white px-[14px] py-[5px] rounded-full text-[12px] font-semibold whitespace-nowrap`}>
                {project.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-[15px] leading-relaxed">{project.description}</p>

            {/* Tech Stack */}
            <div>
              <p className="text-gray-500 text-[12px] uppercase tracking-wider mb-[8px]">Tech Stack</p>
              <div className="flex flex-wrap gap-[8px]">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="bg-[#2a2a2a] text-gray-300 px-[10px] py-[4px] rounded-full text-[13px]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Members */}
            <div>
              <p className="text-gray-500 text-[12px] uppercase tracking-wider mb-[8px]">
                Members ({project.members.length})
              </p>
              <div className="flex flex-wrap gap-[8px]">
                {project.members.map((m, i) => (
                  <span key={i} className="bg-nyu-purple bg-opacity-20 text-purple-300 px-[10px] py-[4px] rounded-full text-[13px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-[12px] pt-[8px]">
              <button
                onClick={() => handleEdit(project)}
                className="flex-1 px-[20px] py-[10px] border border-gray-600 text-gray-300 rounded-full text-[15px] hover:bg-[#2a2a2a] hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project)}
                className="flex-1 px-[20px] py-[10px] border border-red-700 text-red-400 rounded-full text-[15px] hover:bg-red-900 hover:text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    );
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
          <img src={NYULogo} alt="NYU Logo" className="h-[32px] ml-[8px]" />
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
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
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
            onClick={() => navigate('/login')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-[32px] py-[60px]">
        <h1 className="text-[56px] font-bold text-white mb-[8px]">
          Projects <span className="text-nyu-purple">Management</span>
        </h1>
        <p className="text-gray-400 text-[18px] mb-[60px]">
          Edit or delete projects listed under Study Teams and Project Teams.
        </p>

        {/* Study Teams */}
        <section className="mb-[64px]">
          <h2 className="text-[36px] font-bold text-white mb-[32px]">
            <span className="text-nyu-purple">Study</span> Teams
          </h2>
          {studyTeams.length === 0 ? (
            <p className="text-gray-500 text-[18px]">No study teams.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
              {studyTeams.map(renderCard)}
            </div>
          )}
        </section>

        {/* Project Teams */}
        <section>
          <h2 className="text-[36px] font-bold text-white mb-[32px]">
            <span className="text-nyu-purple">Project</span> Teams
          </h2>
          {projectTeams.length === 0 ? (
            <p className="text-gray-500 text-[18px]">No project teams.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
              {projectTeams.map(renderCard)}
            </div>
          )}
        </section>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-[32px] right-[32px] px-[24px] py-[14px] rounded-[12px] text-white text-[15px] shadow-lg z-50 transition-opacity ${
            toast.type === 'error' ? 'bg-red-700' : 'bg-green-700'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
