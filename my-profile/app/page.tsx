export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 font-sans bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          My Profile
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          안녕하세요! 곧 멋진 프로필로 채워질 공간입니다.
        </p>
      </main>
    </div>
  );
}
