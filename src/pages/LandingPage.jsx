// admin 가져오는 api
// project에 대한 모든걸 가져오는 api

import { useState } from 'react';

export default function LikeLionNYU() {
  const [currentAdmin, setCurrentAdmin] = useState(0);
  const [currentCommunity, setCurrentCommunity] = useState(0);

  const admins = [
    { position: 'President', name: 'Gangwon Suh' },
    { position: 'Vice-President', name: 'Gangwon Suh' },
    { position: 'PM', name: 'Gangwon Suh' },
    { position: 'Marketing', name: 'Gangwon Suh' },
  ];

  const communities = [
    {
      team: 'FRONTEND TEAM',
      title: 'NYU Community',
      description: '뉴욕대 한인 커뮤니티',
      techStack: ['HTML', 'CSS', 'Tailwind CSS', 'Javascript'],
      features: [
        'An online community where NYU students can freely share and exchange information about courses, academics, and campus life.',
        'Offers tailored guides for freshmen and fosters strong student connections through various interactive communities.'
      ]
    }
  ];

  const nextAdmin = () => {
    setCurrentAdmin((prev) => (prev + 4 >= admins.length ? prev : prev + 4));
  };

  const prevAdmin = () => {
    setCurrentAdmin((prev) => (prev - 4 < 0 ? 0 : prev - 4));
  };

  const nextCommunity = () => {
    setCurrentCommunity((prev) => (prev + 1) % communities.length);
  };

  const prevCommunity = () => {
    setCurrentCommunity((prev) => (prev - 1 + communities.length) % communities.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="text-xl font-bold">LikeLion x NYU</div>
        
        <div className="flex items-center gap-6 bg-white border border-gray-300 rounded-full px-8 py-2">
          <a href="#about" className="text-sm hover:text-purple-600">About Us</a>
          <a href="#members" className="text-sm hover:text-purple-600">Members</a>
          <a href="#mentoring" className="text-sm hover:text-purple-600">Mentoring</a>
          <a href="#activities" className="text-sm hover:text-purple-600">Activities</a>
          <a href="#attendance" className="text-sm hover:text-purple-600">Attendance</a>
        </div>

        <button className="px-6 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
          Log In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-8">
        <h1 className="text-6xl font-bold mb-8">
          LikeLion x <span className="text-purple-600">NYU</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed mb-8">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing versions of Lorem Ipsum.
        </p>

        <button className="px-8 py-2 border-2 border-black rounded-full text-sm hover:bg-black hover:text-white transition-colors">
          Join Us
        </button>
      </section>

      {/* Admin Section */}
      <section className="bg-purple-600 py-16 px-8 text-white relative">
        <h2 className="text-3xl font-semibold text-center mb-12">Meet Our Admin</h2>
        
        <div className="max-w-6xl mx-auto relative">
          <button 
            onClick={prevAdmin}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-4xl text-white hover:scale-110 transition-transform"
          >
            ‹
          </button>

          <div className="grid grid-cols-4 gap-6">
            {admins.slice(currentAdmin, currentAdmin + 4).map((admin, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center">
                <div className="text-purple-600 text-sm font-medium mb-4">
                  {admin.position}
                </div>
                <div className="bg-gray-300 rounded-xl aspect-[3/4] mb-4"></div>
                <div className="text-black font-medium">{admin.name}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={nextAdmin}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-4xl text-white hover:scale-110 transition-transform"
          >
            ›
          </button>
        </div>

        <div className="text-center mt-12">
          <button className="bg-purple-900 px-8 py-3 rounded-full text-sm hover:bg-purple-800 transition-colors">
            Meet Our Members
          </button>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto relative">
          <button 
            onClick={prevCommunity}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-4xl hover:scale-110 transition-transform"
          >
            ‹
          </button>

          <div className="bg-black rounded-3xl p-12 text-white">
            <div className="text-center mb-6">
              <span className="inline-block bg-gray-800 px-4 py-1 rounded-full text-xs uppercase tracking-wider mb-4">
                {communities[currentCommunity].team}
              </span>
              <h2 className="text-4xl font-bold mb-2">
                {communities[currentCommunity].title}
              </h2>
              <p className="text-gray-400 text-sm">
                {communities[currentCommunity].description}
              </p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden mb-8">
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=400&fit=crop" 
                alt="NYU Community"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-yellow-400 text-xs uppercase tracking-wider mb-3">
                  TECH STACK
                </h3>
                <ul className="space-y-1 text-sm">
                  {communities[currentCommunity].techStack.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-400 text-xs uppercase tracking-wider mb-3">
                  FEATURES
                </h3>
                <ul className="space-y-2 text-sm">
                  {communities[currentCommunity].features.map((feature, i) => (
                    <li key={i} className="leading-relaxed">• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={nextCommunity}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-4xl hover:scale-110 transition-transform"
          >
            ›
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </footer>
    </div>
  );
}