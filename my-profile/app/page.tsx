export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#E0E7FF] p-6 font-sans text-black selection:bg-black selection:text-[#FEF08A] md:p-12 lg:p-20">
      
      {/* Landing Page Container */}
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1400px] flex-col gap-12 md:min-h-[calc(100vh-6rem)] lg:flex-row lg:items-start lg:gap-24">
        
        {/* Left Column (Hero & Identity) */}
        <section className="flex flex-1 flex-col justify-center space-y-8 lg:sticky lg:top-20 lg:space-y-12 lg:pt-10">
          
          {/* Avatar */}
          <div className="flex h-32 w-32 items-end justify-center overflow-hidden rounded-full border-[4px] border-black bg-[#FEF08A] shadow-[8px_8px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0_rgba(0,0,0,1)] md:h-48 md:w-48 lg:h-56 lg:w-56">
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-full w-full translate-y-4 text-zinc-800 md:translate-y-6 lg:translate-y-8"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Names */}
          <div className="space-y-4">
            <h1 className="break-keep text-6xl font-black uppercase tracking-tighter md:text-[100px] lg:text-[120px] xl:text-[140px] lg:leading-[0.9]">
              고승희
            </h1>
            <p className="text-3xl font-bold md:text-5xl lg:text-6xl">
              Seunghee Ko
            </p>
          </div>

          {/* Birth Date Tag */}
          <div className="inline-flex w-max items-center justify-center rounded-full border-[4px] border-black bg-[#A7F3D0] px-6 py-3 text-lg font-black shadow-[6px_6px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] md:px-8 md:py-4 md:text-2xl lg:text-3xl">
            🎂 2004. 10. 11
          </div>

          {/* Links (Moved to left side to balance scrolling content on the right) */}
          <div className="flex w-full flex-col gap-6 md:flex-row lg:flex-col xl:flex-row">
            <a
              href="#"
              className="flex-1 rounded-[20px] border-[4px] border-black bg-[#F9A8D4] px-8 py-5 text-center text-xl font-black uppercase shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none md:text-2xl lg:text-3xl"
            >
              PORTFOLIO
            </a>
            <a
              href="#"
              className="flex-1 rounded-[20px] border-[4px] border-black bg-[#67E8F9] px-8 py-5 text-center text-xl font-black uppercase shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none md:text-2xl lg:text-3xl"
            >
              CONTACT
            </a>
          </div>
        </section>

        {/* Right Column (Content & Skills) */}
        <section className="flex flex-1 flex-col justify-start gap-10 lg:gap-14 lg:pt-10">
          
          {/* About Box */}
          <div className="rounded-[24px] border-[4px] border-black bg-white p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] md:p-12 lg:p-16">
            <h3 className="mb-8 text-3xl font-black uppercase md:text-5xl lg:mb-10 lg:text-6xl">
              About Me
            </h3>
            <div className="space-y-6 break-keep text-lg font-bold leading-relaxed md:text-xl lg:text-2xl lg:leading-[1.8]">
              <p>
                <span className="bg-[#FEF08A] px-2">인간과 기계의 상호작용을 혁신하는 개발자,</span> 고승희입니다.
              </p>
              <p>
                현재 <strong className="border-b-[4px] border-black pb-1">제스처 기반 반응형 AI 드론 제어 시스템</strong>이라는 도전적인 플랫폼을 주도적으로 연구 및 개발하고 있습니다. 사용자의 직관적인 움직임을 실시간으로 분석해 드론의 비행을 정밀하게 제어하는 인공지능 알고리즘과 통신 아키텍처를 설계하며, 미래 모빌리티와 AI의 융합을 이끌어내고 있습니다.
              </p>
              <p>
                단순한 백엔드 시스템 구축을 넘어, 완성도 높은 웹 애플리케이션을 직접 설계하고 구현할 수 있는 풀스택(Full-Stack) 역량을 갖추고 있습니다. 복잡한 시스템의 동작 상태를 직관적인 웹 인터페이스로 풀어내어 사용자 경험(UX)을 극대화하는 데 깊은 통찰을 가지고 있으며, 끊임없는 기술 탐구를 통해 불가능을 가능으로 만들어가는 엔지니어입니다.
              </p>
            </div>
          </div>

          {/* Tech Stack Box */}
          <div className="rounded-[24px] border-[4px] border-black bg-white p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] md:p-12 lg:p-16">
            <h3 className="mb-8 text-3xl font-black uppercase md:text-5xl lg:mb-10 lg:text-6xl">
              Tech Stack
            </h3>
            
            <div className="space-y-10">
              <div>
                <h4 className="mb-4 text-xl font-black uppercase md:text-2xl lg:text-3xl">Backend & System</h4>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {['Java', 'Spring Framework', 'Node-RED', 'REST API'].map((skill) => (
                    <span key={skill} className="rounded-xl border-[3px] border-black bg-[#A7F3D0] px-4 py-2 text-lg font-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 md:text-xl lg:text-2xl">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-xl font-black uppercase md:text-2xl lg:text-3xl">Frontend</h4>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {['JavaScript', 'HTML5', 'CSS3', 'AJAX', 'JSON'].map((skill) => (
                    <span key={skill} className="rounded-xl border-[3px] border-black bg-[#FEF08A] px-4 py-2 text-lg font-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 md:text-xl lg:text-2xl">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-xl font-black uppercase md:text-2xl lg:text-3xl">Tools & Basics</h4>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {['Git', 'GitHub', 'Linux', 'SQL'].map((skill) => (
                    <span key={skill} className="rounded-xl border-[3px] border-black bg-[#E0E7FF] px-4 py-2 text-lg font-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 md:text-xl lg:text-2xl">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

        </section>
      </main>
    </div>
  );
}
