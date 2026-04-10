"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Globe, FileUser, Mail, ArrowRight } from "lucide-react";

const links = [
  {
    title: "GitHub 저장소",
    desc: "기록하고 발전하는 소스코드의 흔적들",
    icon: <Terminal className="w-6 h-6 text-zinc-100" />,
    url: "https://github.com/SeungHeeKo5/my-link",
  },
  {
    title: "포트폴리오",
    desc: "지금까지 경험한 프로젝트의 모음집",
    icon: <Globe className="w-6 h-6 text-zinc-100" />,
    url: "#",
  },
  {
    title: "기술 블로그",
    desc: "단순히 기록하는 것을 넘어 정리하고 사유합니다",
    icon: <FileUser className="w-6 h-6 text-zinc-100" />,
    url: "#",
  },
  {
    title: "연락 채널",
    desc: "흥미로운 프로젝트에 대한 제안을 언제나 환영합니다",
    icon: <Mail className="w-6 h-6 text-zinc-100" />,
    url: "#",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30">
      {/* 🔮 Background Abstract Orbs */}
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-purple-600/30 blur-[130px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-blue-600/30 blur-[130px] mix-blend-screen pointer-events-none animate-pulse duration-[10000ms]" />
      
      {/* Texture Overlay (noise) for premium feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 sm:p-12"
      >
        <div className="w-full max-w-lg mx-auto space-y-12">
          
          {/* Header Section */}
          <motion.header variants={itemVariants} className="flex flex-col items-center gap-6 text-center">
            
            {/* Avatar Magic Ring */}
            <div className="relative group p-1.5 rounded-full bg-gradient-to-tr from-purple-500 via-zinc-800 to-blue-500 shadow-2xl">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }} 
                className="w-32 h-32 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center border-[3px] border-black relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                <span className="text-5xl drop-shadow-md z-10">🚀</span>
              </motion.div>
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 -z-10" />
            </div>
            
            {/* Title & Bio */}
            <div className="space-y-3 px-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent drop-shadow-sm">
                SeungHee Ko
              </h1>
              <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-wide">
                Software Engineer & UI Creator
              </p>
              <p className="text-sm sm:text-base text-zinc-400 max-w-sm mx-auto leading-relaxed pt-2">
                "경험을 디자인하고 가치를 코딩합니다." <br/>
                가장 모던하고 아름다운 웹 생태계를 만들어가고 있습니다.
              </p>
            </div>
          </motion.header>

          {/* Links Section */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4 w-full">
            {links.map((link, idx) => (
              <motion.a 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href={link.url}
                className="group relative flex items-center gap-5 p-5 rounded-3xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-purple-500/40 backdrop-blur-md shadow-lg shadow-black/20 hover:shadow-purple-500/20 transition-colors duration-300 overflow-hidden"
              >
                {/* Background sliding hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon Circle */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-purple-500/30 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 z-10">
                  {link.icon}
                </div>
                
                {/* Text Block */}
                <div className="flex flex-col z-10">
                  <span className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors duration-300">
                    {link.title}
                  </span>
                  <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 line-clamp-1">
                    {link.desc}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="ml-auto flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900/50 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-purple-400 z-10">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.a>
            ))}
          </motion.section>

          {/* Footer Footer */}
          <motion.footer variants={itemVariants} className="text-center pt-10 pb-4 text-xs font-semibold tracking-wider text-zinc-600 uppercase">
            © {new Date().getFullYear()} SeungHee Ko &bull; Built with Next.js & Framer
          </motion.footer>
        </div>
      </motion.main>
    </div>
  );
}
