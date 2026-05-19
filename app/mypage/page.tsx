"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus, Trash2, ExternalLink, ArrowLeft, Globe } from "lucide-react";
import { dummyLinks, LinkItemData } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default function MyPage() {
  const [links, setLinks] = useState<LinkItemData[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 하이드레이션 오류 방지를 위한 Mounted 처리 및 로컬 스토리지 데이터 로드
  useEffect(() => {
    setIsMounted(true);
    const savedLinks = localStorage.getItem("mypage-links");
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        setLinks(dummyLinks);
      }
    } else {
      setLinks(dummyLinks);
    }
  }, []);

  // 링크가 변할 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("mypage-links", JSON.stringify(links));
    }
  }, [links, isMounted]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!trimmedUrl) {
      setError("주소(URL)를 입력해주세요.");
      return;
    }

    // 간단한 URL 유효성 검사
    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setError("올바른 주소 형식을 입력해주세요. (예: example.com)");
      return;
    }

    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;

    const newLink: LinkItemData = {
      id: `link-${Date.now()}`,
      title: trimmedTitle,
      url: finalUrl,
      icon: "LinkIcon",
    };

    setLinks([...links, newLink]); // 요구사항: 하단 목록에 추가됨
    setTitle("");
    setUrl("");
    setIsDialogOpen(false);
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm("정말 이 링크를 삭제하시겠습니까?")) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5b5fc7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground font-sans pb-20 selection:bg-[#5b5fc7]/20">
      {/* Gnb / Navigation */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>메인으로</span>
        </Link>
        <span className="text-xs bg-slate-100 dark:bg-zinc-800 text-[#5b5fc7] font-semibold px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
          Edit Mode
        </span>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto px-4 mt-8 flex flex-col gap-8">
        
        {/* 1. 상단: 제목 */}
        <section className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-[#5b5fc7]/10 rounded-full flex items-center justify-center mb-1 border border-[#5b5fc7]/20">
            <Globe className="w-6 h-6 text-[#5b5fc7]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            나만의 링크 관리
          </h1>
          <p className="text-xs text-muted-foreground max-w-[280px]">
            방문자에게 보여줄 소셜 네트워크 및 외부 사이트 링크들을 자유롭게 관리해 보세요.
          </p>
        </section>

        {/* 2. 중간: 폼 (다이얼로그) */}
        <section className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="w-full max-w-sm h-12 bg-[#5b5fc7]/10 hover:bg-[#5b5fc7]/20 text-[#5b5fc7] border border-[#5b5fc7]/30 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">새로운 링크 추가하기</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold text-slate-800 dark:text-slate-100">
                  새로운 링크 정보 입력
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLink} className="flex flex-col gap-4 py-2">
                
                {/* 제목 입력 칸 (세로 배치) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    링크 제목
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="예: 나의 인스타그램, 개인 블로그 등"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setError("");
                    }}
                    className="focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7]"
                  />
                </div>

                {/* 주소 입력 칸 (세로 배치) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="url" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    주소 (URL)
                  </label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    className="focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7]"
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-destructive mt-0.5">
                    {error}
                  </p>
                )}

                {/* 추가 버튼 (보라색 #5b5fc7) */}
                <Button 
                  type="submit" 
                  className="w-full bg-[#5b5fc7] hover:bg-[#4c50ab] active:scale-[0.98] text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>링크 추가하기</span>
                </Button>

              </form>
            </DialogContent>
          </Dialog>
        </section>

        {/* 3. 하단: 목록 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-[#5b5fc7]" />
              <span>등록된 링크 목록 ({links.length})</span>
            </h2>
          </div>

          {links.length === 0 ? (
            <Card className="border border-dashed border-slate-200 dark:border-zinc-800 bg-transparent py-10 text-center flex flex-col items-center justify-center">
              <LinkIcon className="w-8 h-8 text-slate-300 dark:text-zinc-700 mb-2 stroke-[1.5]" />
              <p className="text-xs text-muted-foreground font-medium">등록된 링크가 아직 없습니다.</p>
              <p className="text-[10px] text-muted-foreground/75 mt-0.5">상단 폼에 정보를 입력해 추가해 보세요!</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {links.map((linkItem) => (
                <Card 
                  key={linkItem.id} 
                  className="group border border-slate-200/60 dark:border-zinc-850 bg-card hover:shadow-sm hover:-translate-y-0.5 hover:border-slate-300/80 dark:hover:border-zinc-750 transition-all duration-200"
                >
                  <CardContent className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/30 dark:border-zinc-700">
                        <LinkIcon className="w-4.5 h-4.5 text-[#5b5fc7]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate leading-tight">
                          {linkItem.title}
                        </h3>
                        <a 
                          href={linkItem.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-muted-foreground/90 font-mono hover:text-[#5b5fc7] hover:underline flex items-center gap-1 mt-0.5 truncate"
                        >
                          <span className="truncate">{linkItem.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLink(linkItem.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10 rounded-md shrink-0 h-8 w-8 transition-colors"
                      title="삭제하기"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
