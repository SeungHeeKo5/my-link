"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Globe, FileUser, Mail, ArrowRight } from "lucide-react";

const links = [
  {
    title: "GitHub 저장소",
    desc: "기록하고 발전하는 소스코드의 흔적들",
    icon: <Terminal className="w-8 h-8 md:w-10 md:h-10 text-black" />,
    url: "https://github.com/SeungHeeKo5/my-link",
    colorClass: "bg-[#ff00a0]",
  },
  {
    title: "포트폴리오",
    desc: "지금까지 경험한 프로젝트의 모음집",
    icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-black" />,
    url: "#",
    colorClass: "bg-[#00d2b6]",
  },
  {
    title: "기술 블로그",
    desc: "단순히 기록하는 것을 넘어 정리하고 사유합니다",
    icon: <FileUser className="w-8 h-8 md:w-10 md:h-10 text-black" />,
    url: "#",
    colorClass: "bg-[#ff00a0]",
  },
  {
    title: "연락 채널",
    desc: "흥미로운 프로젝트에 대한 제안을 언제나 환영합니다",
    icon: <Mail className="w-8 h-8 md:w-10 md:h-10 text-black" />,
    url: "#",
    colorClass: "bg-[#00d2b6]",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full relative bg-[#0f172a] text-white font-sans selection:bg-[#ff00a0] selection:text-white p-6 md:p-12 lg:p-24 overflow-x-hidden">
      {/* Background dot pattern for more texture */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      <main className="relative z-10 w-full max-w-7xl mx-auto h-full min-h-[80vh] flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center lg:items-center">
        
        {/* Left column: Hero Title */}
        <div className="w-full space-y-8 flex flex-col justify-center h-full pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-block bg-[#00d2b6] text-black font-black uppercase px-4 py-1 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rotate-[-2deg] mb-6 tracking-wide text-sm md:text-base">
              Software Engineer
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[1.05] tracking-tighter text-white drop-shadow-[5px_5px_0px_#ff00a0] break-keep">
              SEUNGHEE<br/>
              <span className="text-[#00d2b6] drop-shadow-[5px_5px_0px_#000]">KO</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl font-bold max-w-md leading-snug border-l-[6px] border-[#ff00a0] pl-6 text-slate-200"
          >
            "경험을 디자인하고<br/>가치를 코딩합니다."<br/><br/>
            <span className="text-slate-400 text-base md:text-lg">가장 모던하고 아름다운 웹 생태계를 만들어가고 있습니다.</span>
          </motion.p>
        </div>

        {/* Right column: Links */}
        <div className="w-full flex flex-col gap-6 lg:gap-8 justify-center mt-4 lg:mt-0 pb-12 lg:pb-0">
          {links.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.url}
              initial={{ opacity: 0, lg: { x: 50 }, x: 0, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.1 * idx, type: "spring", stiffness: 100 }}
              whileHover={{ x: -4, y: -4, boxShadow: "10px 10px 0px 0px #000" }}
              whileTap={{ x: 0, y: 2, boxShadow: "2px 2px 0px 0px #000" }}
              className={`group flex items-center p-5 md:p-6 border-[4px] border-black shadow-[6px_6px_0px_0px_#000] ${link.colorClass} text-black transition-all duration-200 block w-full relative active:transition-none`}
            >
              {/* Highlight flash effect on hover */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-200 pointer-events-none" />

              {/* Icon box */}
              <div className="relative z-10 shrink-0 bg-white p-3 border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_#000] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200">
                {link.icon}
              </div>
              
              <div className="relative z-10 flex flex-col ml-5 md:ml-6 flex-grow">
                <span className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  {link.title}
                </span>
                <span className="text-sm md:text-base font-bold text-black/80 mt-1 line-clamp-1">
                  {link.desc}
                </span>
              </div>
              
              <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-200 hidden sm:block">
                <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-black border-2 border-black rounded-full p-1 bg-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </main>
    </div>
  );
}
