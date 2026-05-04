export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E0E7FF] p-6 font-sans text-black selection:bg-black selection:text-[#FEF08A]">
      <main className="mx-auto w-full max-w-[360px] rounded-[12px] border-[3px] border-black bg-[#FEF08A] p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all duration-300 md:max-w-[768px] md:p-10 lg:max-w-[1024px] lg:p-16">
        
        {/* Profile Image (Apple Silhouette Style in Neo-Brutalism) */}
        <div className="mx-auto mb-6 flex h-[120px] w-[120px] items-end justify-center overflow-hidden rounded-full border-[3px] border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(0,0,0,1)]">
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="h-[120px] w-[120px] translate-y-3 text-zinc-800"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        
        {/* Name Information */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            고승희
          </h1>
          <p className="mt-1 text-xl font-bold md:text-2xl lg:mt-2 lg:text-3xl">
            Seunghee Ko
          </p>
        </div>
        
        {/* Birth Date Tag */}
        <div className="mx-auto my-6 flex w-max items-center justify-center rounded-[12px] border-[3px] border-black bg-white px-5 py-2 text-base font-bold shadow-[4px_4px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(0,0,0,1)] md:text-lg lg:my-8 lg:px-6 lg:py-3 lg:text-xl">
          🎂 2004. 10. 11
        </div>
        
        <p className="mb-8 text-center text-lg font-bold leading-relaxed md:mb-10 md:text-xl lg:mb-12 lg:text-2xl">
          안녕하세요! 환영합니다.
        </p>

        {/* Links */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-center lg:gap-6">
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-[12px] border-[3px] border-black bg-white px-6 py-4 text-lg font-black shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,1)] md:w-1/2 lg:text-xl"
          >
            링크 1
          </a>
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-[12px] border-[3px] border-black bg-white px-6 py-4 text-lg font-black shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,1)] md:w-1/2 lg:text-xl"
          >
            링크 2
          </a>
        </div>
      </main>
    </div>
  );
}
