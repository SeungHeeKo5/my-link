import React from "react";
import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Link as LinkIcon, BookOpen, Briefcase } from "lucide-react";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";

// 아이콘 매핑
const IconMap: Record<string, React.ElementType> = {
  Instagram: FaInstagram,
  Youtube: FaYoutube,
  BookOpen,
  Github: FaGithub,
  Briefcase,
};

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4 font-sans">
      <div className="w-full max-w-md flex flex-col gap-4">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">모든 링크 보기</h1>
          <p className="text-muted-foreground text-sm mt-1">
            원하는 링크를 클릭하시면 새 창에서 열립니다.
          </p>
        </div>

        {dummyLinks.map((link) => {
          const IconComponent = IconMap[link.icon] || LinkIcon;

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <Card className="hover:border-primary/50 hover:bg-accent/30 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* 아이콘 영역 */}
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 border">
                    <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  {/* 텍스트 영역 (중앙 정렬) */}
                  <div className="flex-grow text-center pr-4">
                    <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {link.title}
                    </div>
                  </div>
                  
                  {/* 우측 아이콘 */}
                  <div className="text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
