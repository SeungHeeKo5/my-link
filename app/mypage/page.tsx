"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus, Trash2, ExternalLink, ArrowLeft, Globe, Loader2, Pencil } from "lucide-react";
import { LinkItemData } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

function LinkCardItem({ linkItem, onDelete }: { linkItem: LinkItemData; onDelete: (id: string, title: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(linkItem.title);
  const [editUrl, setEditUrl] = useState(linkItem.url);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setError("");
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    if (!trimmedTitle) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!trimmedUrl) {
      setError("주소(URL)를 입력해주세요.");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setError("올바른 주소 형식을 입력해주세요. (예: example.com)");
      return;
    }

    setIsUpdating(true);
    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;

    try {
      const linkRef = doc(db, "users", "anonymous", "links", linkItem.id);
      await updateDoc(linkRef, {
        title: trimmedTitle,
        url: finalUrl,
        updateAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating link:", err);
      setError("수정에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(linkItem.title);
    setEditUrl(linkItem.url);
    setIsEditing(false);
    setError("");
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && !isUpdating && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleSave();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, isUpdating, editTitle, editUrl]);

  return (
    <Card className="group border border-slate-200/60 dark:border-zinc-850 bg-card hover:shadow-sm hover:-translate-y-0.5 hover:border-slate-300/80 dark:hover:border-zinc-750 transition-all duration-200">
      <CardContent className="p-3.5 flex flex-col gap-2">
        {isEditing ? (
          <div ref={containerRef} className="flex flex-col gap-3 w-full py-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">링크 제목</label>
              <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder="예: 나의 인스타그램"
                className="h-9 text-sm focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">주소 (URL)</label>
              <Input 
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder="https://example.com"
                className="h-9 text-sm font-mono focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7]"
              />
            </div>
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            <div className="flex items-center gap-2 mt-1 justify-end">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={isUpdating}>
                취소
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isUpdating} className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white">
                {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                저장
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/30 dark:border-zinc-700">
                <LinkIcon className="w-4.5 h-4.5 text-[#5b5fc7]" />
              </div>
              <div className="min-w-0 flex-1">
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
            
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-[#5b5fc7] hover:bg-[#5b5fc7]/10 rounded-md shrink-0 h-8 w-8 transition-colors"
                title="수정하기"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(linkItem.id, linkItem.title)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 h-8 w-8 transition-colors"
                title="삭제하기"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MyPage() {
  const [links, setLinks] = useState<LinkItemData[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: string, title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Firestore realtime listener
  useEffect(() => {
    setIsMounted(true);
    
    const linksRef = collection(db, "users", "anonymous", "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItemData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        icon: doc.data().icon || "LinkIcon",
      }));
      setLinks(fetchedLinks);
    }, (error) => {
      console.error("Error fetching links:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
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

    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setError("올바른 주소 형식을 입력해주세요. (예: example.com)");
      return;
    }

    setIsSubmitting(true);
    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const linksRef = collection(db, "users", "anonymous", "links");
      await addDoc(linksRef, {
        title: trimmedTitle,
        url: finalUrl,
        icon: "LinkIcon",
        createdAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      });

      setTitle("");
      setUrl("");
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error adding link: ", err);
      setError("링크를 추가하는 데 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDelete = (id: string, title: string) => {
    setLinkToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await deleteDoc(doc(db, "users", "anonymous", "links", linkToDelete.id));
      setDeleteModalOpen(false);
      setLinkToDelete(null);
    } catch (err) {
      console.error(err);
      alert("링크 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
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
        <section className="flex justify-center z-10 relative">
          {isDialogOpen ? (
            <Card className="w-full border bg-card shadow-sm">
              <CardContent className="p-4 flex flex-col gap-2">
                <form onSubmit={handleAddLink} className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="예: 나의 인스타그램, 개인 블로그 등"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setError("");
                    }}
                    className={`font-medium text-center focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7] ${error && !title.trim() ? 'border-destructive' : ''}`}
                    autoFocus
                  />
                  <Input
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    className={`text-xs font-mono text-center focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7] ${error && !url.trim() ? 'border-destructive' : ''}`}
                  />
                  {error && (
                    <p className="text-xs font-medium text-destructive mt-0.5 text-center">
                      {error}
                    </p>
                  )}
                  <div className="flex gap-2 justify-center mt-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setIsDialogOpen(false); setError(""); }} disabled={isSubmitting}>
                      취소
                    </Button>
                    <Button type="submit" size="sm" disabled={isSubmitting} className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white">
                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                      {isSubmitting ? "추가 중" : "추가하기"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <button 
              onClick={() => { setIsDialogOpen(true); setTitle(""); setUrl(""); setError(""); }}
              className="w-full h-12 bg-[#5b5fc7]/10 hover:bg-[#5b5fc7]/20 text-[#5b5fc7] border border-[#5b5fc7]/30 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">새로운 링크 추가하기</span>
            </button>
          )}
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
                <LinkCardItem 
                  key={linkItem.id} 
                  linkItem={linkItem} 
                  onDelete={requestDelete} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              정말 삭제하시겠습니까?
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
            {linkToDelete && (
              <p className="text-sm text-foreground">
                <span className="font-bold">{linkToDelete.title}</span> 링크를 삭제 합니다.
              </p>
            )}
            <p className="text-destructive font-bold text-sm mt-1">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full mt-2">
            <Button 
              variant="outline" 
              className="w-full flex-1" 
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              className="w-full flex-1"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              삭제하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
