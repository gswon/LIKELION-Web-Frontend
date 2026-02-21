import { useNavigate, useParams } from 'react-router-dom';
import PublicNav from '../components/PublicNav';

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  // 프로젝트 데이터 (실제로는 API에서 가져올 수 있음)
  const projectsData = {
    'ai-study-assistant': {
      name: 'AI Study Assistant',
      team: 'Team Alpha',
      leader: {
        name: 'John Kim',
        role: 'Team Leader & Backend Developer',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
      },
      members: [
        {
          name: 'Sarah Lee',
          role: 'Frontend Developer',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
        },
        {
          name: 'Michael Park',
          role: 'AI/ML Engineer',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop'
        },
        {
          name: 'Jessica Chen',
          role: 'UI/UX Designer',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'
        }
      ],
      description: 'An intelligent study companion that helps students organize their learning materials, generate practice questions, and track study progress using AI technology.',
      techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
      status: 'In Progress',
      color: 'bg-blue-600',
      bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop'
    },
    'campus-food-finder': {
      name: 'Campus Food Finder',
      team: 'Team Beta',
      leader: {
        name: 'David Johnson',
        role: 'Team Leader & Full Stack Developer',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
      },
      members: [
        {
          name: 'Emily Wang',
          role: 'Mobile Developer',
          photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop'
        },
        {
          name: 'Chris Martinez',
          role: 'Backend Developer',
          photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop'
        }
      ],
      description: 'A mobile-friendly web app that helps NYU students discover the best food options around campus with real-time reviews and ratings.',
      techStack: ['React Native', 'Firebase', 'Google Maps API'],
      status: 'Planning',
      color: 'bg-green-600',
      bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop'
    },
    'event-management-system': {
      name: 'Event Management System',
      team: 'Team Gamma',
      leader: {
        name: 'Rachel Brown',
        role: 'Team Leader & Project Manager',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop'
      },
      members: [
        {
          name: 'Kevin Liu',
          role: 'Backend Developer',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop'
        },
        {
          name: 'Amanda Garcia',
          role: 'Frontend Developer',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
        },
        {
          name: 'Tom Wilson',
          role: 'DevOps Engineer',
          photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop'
        },
        {
          name: 'Lisa Zhang',
          role: 'UI/UX Designer',
          photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop'
        }
      ],
      description: 'A comprehensive platform for organizing and managing student events, including registration, ticketing, and attendance tracking.',
      techStack: ['Vue.js', 'Express', 'PostgreSQL', 'Stripe API'],
      status: 'In Progress',
      color: 'bg-purple-600',
      bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=400&fit=crop'
    },
    'study-room-booking': {
      name: 'Study Room Booking',
      team: 'Team Delta',
      leader: {
        name: 'Andrew Davis',
        role: 'Team Leader & Full Stack Developer',
        photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop'
      },
      members: [
        {
          name: 'Michelle Kim',
          role: 'Frontend Developer',
          photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop'
        },
        {
          name: 'Ryan Taylor',
          role: 'Backend Developer',
          photo: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=300&fit=crop'
        }
      ],
      description: 'Simplify the process of reserving study rooms across campus with an intuitive booking system and real-time availability.',
      techStack: ['Angular', 'Django', 'MySQL'],
      status: 'Completed',
      color: 'bg-yellow-600',
      bannerImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop'
    }
  };

  const project = projectsData[projectId];

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-[36px] md:text-[48px] font-bold mb-[24px] leading-tight md:leading-normal">Project Not Found</h1>
          <button
            onClick={() => navigate('/projects')}
            className="px-[28px] py-[13px] border border-black rounded-full text-[20px] hover:bg-gray-50 font-normal shadow-button transition-all duration-200"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNav />

      {/* Banner Image */}
      <div className="w-full h-[200px] md:h-[400px] overflow-hidden">
        <img
          src={project.bannerImage}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Project Header */}
      <section className="py-[40px] md:py-[60px] px-[16px] bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:justify-between gap-4 mb-[20px] md:mb-[24px]">
            <div>
              <h1 className="text-[32px] md:text-[56px] font-bold mb-[10px] md:mb-[16px] leading-tight md:leading-normal">{project.name}</h1>
              <p className="text-[18px] md:text-[24px] text-gray-600">{project.team}</p>
            </div>
            <span className={`${project.color} text-white px-[18px] md:px-[24px] py-[8px] md:py-[12px] rounded-full text-[14px] md:text-[16px] font-semibold self-start`}>
              {project.status}
            </span>
          </div>

          <p className="text-[16px] md:text-[20px] text-gray-700 leading-relaxed mb-[24px] md:mb-[32px]">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-[24px] md:mb-[32px]">
            <h3 className="text-[14px] md:text-[16px] font-semibold text-gray-500 uppercase tracking-wider mb-[12px] md:mb-[16px]">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-[8px] md:gap-[12px]">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="bg-white text-gray-700 px-[14px] md:px-[20px] py-[7px] md:py-[10px] rounded-full text-[14px] md:text-[16px] border border-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-[40px] md:py-[80px] px-[16px] bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[48px] font-bold text-center mb-[40px] md:mb-[60px] leading-tight md:leading-normal">
            Meet the <span className="text-nyu-purple">Team</span>
          </h2>

          {/* Team Leader */}
          <div className="mb-[48px] md:mb-[80px]">
            <h3 className="text-[24px] md:text-[32px] font-bold mb-[24px] md:mb-[32px] text-center text-nyu-purple leading-tight md:leading-normal">
              Team Leader
            </h3>
            <div className="max-w-md mx-auto bg-gradient-to-br from-nyu-purple to-purple-700 rounded-[20px] md:rounded-[24px] p-6 md:p-[40px] text-white shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-[140px] h-[140px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden mb-[16px] md:mb-[24px] border-4 border-white shadow-xl">
                  <img
                    src={project.leader.photo}
                    alt={project.leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-[24px] md:text-[32px] font-bold mb-[6px] md:mb-[8px] leading-tight md:leading-normal">{project.leader.name}</h4>
                <p className="text-[15px] md:text-[18px] text-purple-200 text-center">{project.leader.role}</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-[24px] md:text-[32px] font-bold mb-[24px] md:mb-[32px] text-center leading-tight md:leading-normal">
              Team Members
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[32px]">
              {project.members.map((member, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-[20px] p-6 md:p-[32px] hover:border-nyu-purple hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden mb-[16px] md:mb-[20px] border-2 border-gray-300">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-[20px] md:text-[24px] font-bold mb-[6px] md:mb-[8px] text-center leading-tight md:leading-normal">{member.name}</h4>
                    <p className="text-[14px] md:text-[16px] text-gray-600 text-center">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
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
