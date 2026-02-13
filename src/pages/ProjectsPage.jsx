import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const closeTimer = useRef(null);
  const [showActivitiesMenu, setShowActivitiesMenu] = useState(false);

  const studyTeams = [
    {
      id: 'ai-study-assistant',
      name: 'AI Study Assistant',
      team: 'Team Alpha',
      members: ['John Kim', 'Sarah Lee', 'Michael Park', 'Jessica Chen'],
      description: 'An intelligent study companion that helps students organize their learning materials, generate practice questions, and track study progress using AI technology.',
      techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
      status: 'In Progress',
      color: 'bg-blue-600',
      category: 'study'
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
      category: 'study'
    }
  ];

  const projectTeams = [
    {
      id: 'campus-food-finder',
      name: 'Campus Food Finder',
      team: 'Team Beta',
      members: ['David Johnson', 'Emily Wang', 'Chris Martinez'],
      description: 'A mobile-friendly web app that helps NYU students discover the best food options around campus with real-time reviews and ratings.',
      techStack: ['React Native', 'Firebase', 'Google Maps API'],
      status: 'Planning',
      color: 'bg-green-600',
      category: 'project'
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
      category: 'project'
    }
  ];

  const renderProjectCard = (project, index) => (
    <div
      key={index}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white border-2 border-gray-200 rounded-[20px] p-[32px] hover:border-nyu-purple hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-[20px]">
        <div>
          <h3 className="text-[28px] font-bold mb-[8px]">{project.name}</h3>
          <p className="text-gray-600 text-[14px]">{project.team}</p>
        </div>
        <span className={`${project.color} text-white px-[16px] py-[6px] rounded-full text-[12px] font-semibold`}>
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-[24px]">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="mb-[20px]">
        <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-[12px]">
          Tech Stack
        </h4>
        <div className="flex flex-wrap gap-[8px]">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 px-[12px] py-[6px] rounded-full text-[14px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-[12px]">
          Team Members ({project.members.length})
        </h4>
        <div className="flex flex-wrap gap-[8px]">
          {project.members.map((member, i) => (
            <span
              key={i}
              className="bg-nyu-purple bg-opacity-10 text-nyu-purple px-[12px] py-[6px] rounded-full text-[14px] font-medium"
            >
              {member}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-white">
        <div
          onClick={() => navigate('/')}
          className="flex items-center text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img
            src={NYULogo}
            alt="NYU Logo"
            className="h-[32px] ml-[8px]"
          />
        </div>

        <div className="flex items-center gap-[48px] bg-white border border-black rounded-full px-[48px] py-[13px] font-normal ml-auto shadow-button">
          <a href="/#about" className="text-[20px] hover:text-nyu-purple">
            About Us
          </a>
          {/* hovering 했을때 events/project가 보이는 부분*/}
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setShowActivitiesMenu(true);
            }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(
                () => setShowActivitiesMenu(false),
                400
              );
            }}
          >
            <a
              href="#activities"
              className="text-[20px] hover:text-nyu-purple cursor-pointer"
            >
              Activities
            </a>

            {showActivitiesMenu && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-black rounded-lg shadow-lg py-2 min-w-[120px] z-50"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setShowActivitiesMenu(true);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(
                    () => setShowActivitiesMenu(false),
                    100
                  );
                }}
              >
                <button
                  onClick={() => navigate('/events')}
                  className="block w-full text-left px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-nyu-purple transition-colors bg-transparent border-none cursor-pointer"
                >
                  Events
                </button>
                <button
                  onClick={() => navigate('/projects')}
                  className="block w-full text-left px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-nyu-purple transition-colors bg-transparent border-none cursor-pointer"
                >
                  Projects
                </button>
              </div>
            )}
          </div>

        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-[28px] py-[13px] border border-black rounded-full text-[20px] hover:bg-gray-50 text-[20px] font-normal ml-[21px] shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
        >
          Log In
        </button>
      </nav>

      {/* Header Section */}
      <section className="py-[60px] px-[16px] bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-[64px] font-bold mb-[24px]">
            Our <span className="text-nyu-purple">Teams</span>
          </h1>
          <p className="text-gray-600 text-[20px] mb-[40px] max-w-2xl mx-auto">
            Explore the innovative projects our talented teams are working on. From AI-powered solutions to campus management tools, we're building the future together.
          </p>
        </div>
      </section>

      {/* Study Teams Section */}
      <section className="py-[60px] px-[16px] bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[48px] font-bold mb-[48px]">
            <span className="text-nyu-purple">Study</span> Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
            {studyTeams.map((project, index) => renderProjectCard(project, index))}
          </div>
        </div>
      </section>

      {/* Project Teams Section */}
      <section className="py-[60px] px-[16px] bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[48px] font-bold mb-[48px]">
            <span className="text-nyu-purple">Project</span> Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
            {projectTeams.map((project, index) => renderProjectCard(project, index))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-200">
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
