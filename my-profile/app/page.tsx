export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <main className="w-full max-w-md transform rounded-[2rem] bg-white p-10 text-center shadow-[0_20px_50px_rgba(8,_112,_184,_0.04)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] dark:bg-zinc-900 dark:shadow-[0_20px_50px_rgba(255,_255,_255,_0.02)]">
        
        {/* Apple Default Avatar Silhouette */}
        <div className="mx-auto mb-6 flex h-28 w-28 items-end justify-center overflow-hidden rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C]">
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="h-28 w-28 translate-y-3 text-white dark:text-[#8E8E93]"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        
        {/* Name Information */}
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          고승희
        </h1>
        <p className="mt-1 text-lg font-medium text-zinc-400 dark:text-zinc-500">
          Seunghee Ko
        </p>
        
        {/* Birth Date Tag */}
        <div className="mx-auto my-5 flex w-max items-center justify-center rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          🎂 2004. 10. 11
        </div>
        
        <p className="mb-8 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          안녕하세요! 환영합니다.
        </p>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-zinc-50 dark:text-zinc-900"
          >
            링크 1
          </a>
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-transparent px-5 py-3.5 text-sm font-semibold text-zinc-900 transition-transform hover:scale-[1.02] hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/50"
          >
            링크 2
          </a>
        </div>
      </main>
    </div>
  );
}
