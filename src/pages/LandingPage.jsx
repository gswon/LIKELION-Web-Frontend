// admin 가져오는 api
// project에 대한 모든걸 가져오는 api

import { useState } from 'react';
import NYULogo from '../NYU_logo.png';
import PublicNav from '../components/PublicNav';

export default function LikeLionNYU() {
  const [currentAdmin, setCurrentAdmin] = useState(0);
  const [currentCommunity, setCurrentCommunity] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);

  const admins = [
    {
      position: 'President',
      name: 'Kristie Lee',
      description:
        'Leading LikeLion NYU with passion and dedication. Focused on building a strong tech community and fostering innovation among students.',
    },
    {
      position: 'Vice-President',
      name: 'Juno Lee',
      description:
        'Supporting the team with strategic planning and operations. Committed to creating meaningful learning experiences for all members.',
    },
    {
      position: 'PM',
      name: 'Gangwon Suh',
      description:
        'Managing projects and coordinating team efforts. Dedicated to delivering high-quality solutions and mentoring developers.',
    },
    {
      position: 'Marketing',
      name: 'HyeMin Kim',
      description:
        'Promoting LikeLion NYU and building our brand. Passionate about connecting with students and sharing our vision.',
    },
    {
      position: 'Tech Lead',
      name: 'Sarah Kim',
      description:
        'Guiding technical direction and architecture. Passionate about code quality and mentoring junior developers in best practices.',
    },
    {
      position: 'Designer',
      name: 'Mike Chen',
      description:
        'Creating beautiful and intuitive user experiences. Focused on bringing creative visions to life through thoughtful design.',
    },
    {
      position: 'Developer',
      name: 'Emily Park',
      description:
        'Building robust and scalable applications. Dedicated to writing clean code and implementing innovative solutions.',
    },
    {
      position: 'Content Lead',
      name: 'Alex Johnson',
      description:
        'Crafting engaging content and community stories. Committed to amplifying student voices and sharing impactful narratives.',
    },
  ];

  const communities = [
    {
      team: 'FRONTEND TEAM',
      title: 'NYU Community',
      description: '뉴욕대 한인 커뮤니티',
      techStack: ['HTML', 'CSS', 'Tailwind CSS', 'Javascript'],
      features: [
        'An online community where NYU students can freely share and exchange information about courses, academics, and campus life.',
        'Offers tailored guides for freshmen and fosters strong student connections through various interactive communities.',
      ],
    },
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
    setCurrentCommunity(
      (prev) => (prev - 1 + communities.length) % communities.length
    );
  };

  const handleCardHover = (globalIndex, isHovering) => {
    if (isHovering) {
      setFlippedCards((prev) => [...prev, globalIndex]);
    } else {
      setFlippedCards((prev) => prev.filter((i) => i !== globalIndex));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNav />

      {/* Hero Section */}
      <section className="text-center py-[60px] md:py-[100px] px-[16px]">
        <h1 className="text-[30px] sm:text-[42px] md:text-[64px] lg:text-[96px] font-bold mb-[40px] md:mb-[60px] flex items-center justify-center leading-tight md:leading-normal whitespace-nowrap">
          LikeLion <span className="mx-[6px] sm:mx-[10px] md:mx-[16px]">x</span> <span className="text-nyu-purple">NYU</span>
          <img
            src={NYULogo}
            alt="NYU Logo"
            className="h-[30px] sm:h-[42px] md:h-[64px] lg:h-[96px] ml-[6px] sm:ml-[10px] md:ml-[16px]"
          />
        </h1>

        <p className="max-w-[800px] mx-auto text-gray-600 leading-relaxed mb-[40px] md:mb-[60px]">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing versions of Lorem Ipsum.
        </p>

        <a
          href="https://linktr.ee/nyu_likelion?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnS1LXQBhcZAq5tVKjJlspGPGFoiBDd1QY-Ij6_uvyw8y6-_SoadTm2y4tcjI_aem_gcI0U_vmyQWrZxwiatd4Ag"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-[24px] py-[8px] border border-black rounded-full text-[20px] font-normal hover:bg-gray-100 mb-[80px] md:mb-[135px] shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
        >
          Join Us
        </a>
      </section>

      {/* Admin Section */}
      <section className="bg-nyu-purple py-[45px] px-4 md:px-[41px] text-white relative">
        <h2 className="text-[28px] md:text-[36px] text-center mb-[30px] leading-normal md:leading-normal">Meet Our Admin</h2>

        <div className="max-w-6xl mx-auto relative">
          <button
            onClick={prevAdmin}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-[36px] hover:scale-110 transition-transform"
          >
            ‹
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] md:gap-[30px]">
            {admins
              .slice(currentAdmin, currentAdmin + 4)
              .map((admin, index) => {
                const globalIndex = currentAdmin + index;
                return (
                  <div key={globalIndex}>
                    <div className="text-center text-[16px] md:text-[24px] font-bold mb-[10px] md:mb-[15px] leading-normal md:leading-normal">
                      {admin.position}
                    </div>
                    <div
                      onMouseEnter={() => handleCardHover(globalIndex, true)}
                      onMouseLeave={() => handleCardHover(globalIndex, false)}
                      className="relative cursor-pointer h-[240px] md:h-[400px]"
                      style={{ perspective: '1000px' }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-1000"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: flippedCards.includes(globalIndex)
                            ? 'rotateY(180deg)'
                            : 'rotateY(0deg)',
                        }}
                      >
                      {/* Front Side */}
                      <div
                        className="absolute w-full h-full bg-white rounded-[20px] p-[10px] md:p-[15px] text-center shadow-card flex flex-col"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="bg-gray-300 rounded-[16px] md:rounded-[20px] flex-1 min-h-0 mb-[6px] md:mb-[12px]"></div>
                        <div className="text-black font-bold text-[12px] md:text-base leading-normal shrink-0 py-[2px]">
                          {admin.name}
                        </div>
                      </div>

                      {/* Back Side */}
                      <div
                        className="absolute w-full h-full bg-white rounded-[20px] p-[10px] md:p-[15px] text-center shadow-card flex flex-col justify-center items-center"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <div className="text-black font-bold text-[14px] md:text-[20px] mb-[10px] md:mb-[16px] leading-normal md:leading-normal">
                          {admin.name}
                        </div>
                        <div className="text-gray-700 text-[11px] md:text-[14px] leading-relaxed px-[6px] md:px-[12px]">
                          {admin.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
          </div>

          {/* Mobile prev/next buttons */}
          <div className="flex justify-center gap-[24px] mt-[20px] md:hidden">
            <button
              onClick={prevAdmin}
              className="text-[36px] hover:scale-110 transition-transform"
            >
              ‹
            </button>
            <button
              onClick={nextAdmin}
              className="text-[36px] hover:scale-110 transition-transform"
            >
              ›
            </button>
          </div>

          <button
            onClick={nextAdmin}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-[36px] hover:scale-110 transition-transform"
          >
            ›
          </button>
        </div>


      </section>

      {/* Community Section */}
      <section className="py-[60px] md:py-[140px] px-[16px] bg-gray-50">
        <div className="max-w-4xl mx-auto relative">
          <button
            onClick={prevCommunity}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-[36px] hover:scale-110 transition-transform"
          >
            ‹
          </button>

          <div className="bg-black rounded-[20px] md:rounded-[30px] p-[24px] md:p-[48px] text-white shadow-card">
            <div className="text-center mb-6">
              <span className="inline-block bg-gray-800 px-4 py-1 rounded-full text-xs uppercase tracking-wider mb-4">
                {communities[currentCommunity].team}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight md:leading-normal">
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
                className="w-full h-40 md:h-64 object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
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
                    <li key={i} className="leading-relaxed">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={nextCommunity}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-[36px] hover:scale-110 transition-transform"
          >
            ›
          </button>

          {/* Mobile community prev/next */}
          {communities.length > 1 && (
            <div className="flex justify-center gap-[24px] mt-[16px] md:hidden">
              <button onClick={prevCommunity} className="text-[36px] hover:scale-110 transition-transform text-gray-600">‹</button>
              <button onClick={nextCommunity} className="text-[36px] hover:scale-110 transition-transform text-gray-600">›</button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
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
