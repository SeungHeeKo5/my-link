"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Link as LinkIcon,
  Code,
  Terminal,
  BookOpen,
  Briefcase,
  Loader2
} from "lucide-react";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

const linkFormSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수 입력입니다." }),
  url: z.string().min(1, { message: "주소는 필수 입력입니다." }).url({ message: "유효한 URL 형식이 아닙니다. (예: https://example.com)" }),
});

// --- Types ---
interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface ProfileData {
  name: string;
  englishName: string;
  dob: string;
  about: string;
  avatarUrl: string;
}

// --- Mock Data ---
const initialProfile: ProfileData = {
  name: "고승희",
  englishName: "Ko Seung Hee",
  dob: "2004.10.11",
  about: "안녕하세요! 프론트엔드 개발자 고승희입니다.\n새로운 기술을 배우고 적용하는 것을 좋아합니다.\n세상을 바꾸는 코드를 작성하는 것이 목표입니다.",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
};

export default function MyLinkApp() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const linksRef = collection(db, "users", "anonymous", "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItem[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          url: data.url,
          icon: data.icon || "LinkIcon",
        };
      });
      setLinks(fetchedLinks);
    }, (error) => {
      console.error("Error fetching links:", error);
    });
    
    setIsMounted(true);

    return () => unsubscribe();
  }, []);

  // --- Add Link Modal State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof linkFormSchema>>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: { title: "", url: "" }
  });

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  const onSubmitForm = async (data: z.infer<typeof linkFormSchema>) => {
    setIsSubmitting(true);
    const finalUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;

    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      await addDoc(linksRef, {
        title: data.title.trim(),
        url: finalUrl,
        icon: "LinkIcon",
        createdAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      });
      reset();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error adding link: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-[#5b5fc7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 selection:bg-primary selection:text-primary-foreground">
      
      {/* Header */}
      <header className="sticky top-0 z-50 p-4 flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="font-semibold text-lg tracking-tight flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>MyLink</span>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/mypage" 
            className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-[#5b5fc7] font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 transition-colors shadow-sm"
          >
            <LinkIcon className="w-3 h-3" />
            <span>대시보드</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 flex flex-col gap-6 mt-6 items-center">
        
        {/* Profile Section */}
        <section className="w-full flex flex-col items-center text-center mt-2">
          <Card className="w-full overflow-hidden border shadow-sm bg-card">
            <div className="h-28 bg-muted w-full relative flex items-start p-4">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                <Code className="w-3 h-3 mr-1" />
                Developer
              </Badge>
            </div>

            <div className="px-6 pb-8 -mt-12 flex flex-col items-center">
              <div className="relative group mb-4">
                <Avatar className="w-24 h-24 border-4 border-background bg-muted">
                  <AvatarImage src={profile.avatarUrl} alt="Avatar" />
                  <AvatarFallback className="text-xl">SH</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Pencil className="w-5 h-5" />
                </div>
              </div>

              <InlineEdit
                value={profile.name}
                onSave={(val) => setProfile({ ...profile, name: val })}
                textClass="text-2xl font-bold tracking-tight mb-1"
              />
              
              <InlineEdit
                value={profile.englishName}
                onSave={(val) => setProfile({ ...profile, englishName: val })}
                textClass="text-sm text-muted-foreground mb-3"
              />
              
              <InlineEdit
                value={profile.dob}
                onSave={(val) => setProfile({ ...profile, dob: val })}
                textClass="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md mb-6"
              />

              <div className="w-full">
                <InlineEdit
                  value={profile.about}
                  onSave={(val) => setProfile({ ...profile, about: val })}
                  textClass="text-sm leading-relaxed text-foreground whitespace-pre-wrap text-center"
                  multiline
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Top Add Link Button (Moved Below Profile) */}
        <section className="w-full flex justify-center z-10 relative">
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full h-12 bg-[#5b5fc7]/10 hover:bg-[#5b5fc7]/20 text-[#5b5fc7] border border-[#5b5fc7]/30 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">새로운 링크 추가하기</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold text-slate-800 dark:text-slate-100">
                  새로운 링크 정보 입력
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">링크 제목</label>
                  <Input
                    id="title"
                    placeholder="예: 나의 인스타그램, 개인 블로그 등"
                    {...register("title")}
                    className={`focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7] ${errors.title ? 'border-destructive' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive font-medium mt-0.5">{errors.title.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="url" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">주소(URL)</label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    {...register("url")}
                    className={`focus-visible:ring-[#5b5fc7] focus-visible:border-[#5b5fc7] ${errors.url ? 'border-destructive' : ''}`}
                  />
                  {errors.url && (
                    <p className="text-xs text-destructive font-medium mt-0.5">{errors.url.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting} className="mt-2 w-full bg-[#5b5fc7] hover:bg-[#4c50ab] active:scale-[0.98] text-white font-semibold flex items-center justify-center gap-1.5 transition-all">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>{isSubmitting ? "추가 중..." : "링크 추가하기"}</span>
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        {/* Links Area */}
        <section className="w-full flex flex-col gap-3 mb-10">
          {links.map(link => (
            <LinkCard 
              key={link.id} 
              link={link} 
              onUpdate={async (updated) => {
                try {
                  const linkRef = doc(db, "users", "anonymous", "links", updated.id);
                  await updateDoc(linkRef, {
                    title: updated.title,
                    url: updated.url,
                    updateAt: serverTimestamp()
                  });
                } catch(err) { console.error(err); }
              }}
              onDelete={async (id) => {
                if(window.confirm("정말 삭제하시겠습니까?")) {
                  try {
                    await deleteDoc(doc(db, "users", "anonymous", "links", id));
                  } catch(err) { console.error(err); }
                }
              }}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

// --- Sub Components ---

function InlineEdit({ 
  value, 
  onSave, 
  textClass = "", 
  multiline = false 
}: { 
  value: string; 
  onSave: (val: string) => void; 
  textClass?: string;
  multiline?: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  if (editMode) {
    return (
      <div className="flex flex-col gap-2 w-full mt-1 relative z-20">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y text-center"
            autoFocus
          />
        ) : (
          <Input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="text-center"
            autoFocus
          />
        )}
        <div className="flex gap-2 justify-center mt-1">
          <Button variant="outline" size="sm" onClick={() => {
              setTempValue(value);
              setEditMode(false);
          }}>
            취소
          </Button>
          <Button size="sm" onClick={() => {
              onSave(tempValue);
              setEditMode(false);
          }}>
            <Save className="w-3.5 h-3.5 mr-1.5" /> 저장
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative inline-flex items-center w-full justify-center">
      <div className={textClass}>{value}</div>
      <Button
        variant="ghost" 
        size="icon"
        onClick={() => {
          setTempValue(value);
          setEditMode(true);
        }}
        className="absolute -right-10 opacity-0 group-hover:opacity-100 h-8 w-8"
        title="수정하기"
      >
        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}

function LinkCard({ 
  link, 
  onUpdate,
  onDelete
}: { 
  link: LinkItem; 
  onUpdate: (link: LinkItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempTitle, setTempTitle] = useState(link.title);
  const [tempUrl, setTempUrl] = useState(link.url);

  const IconMap: Record<string, React.ElementType> = {
    Instagram: FaInstagram,
    Youtube: FaYoutube,
    BookOpen,
    Github: FaGithub,
    Briefcase,
  };
  const IconComponent = IconMap[link.icon] || LinkIcon;

  return (
    <Card className="group relative shadow-sm transition-opacity w-full border bg-card hover:border-slate-300 dark:hover:border-zinc-700">
      <CardContent className="p-4 flex flex-col gap-4">
        {editMode ? (
          <div className="flex flex-col gap-2">
            <Input 
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              placeholder="링크 제목"
              className="font-medium text-center"
            />
            <Input 
              type="url" 
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://..."
              className="text-xs font-mono text-center"
            />
            <div className="flex gap-2 justify-center mt-1">
              <Button 
                variant="outline" size="sm"
                onClick={() => setEditMode(false)}
              >취소</Button>
              <Button 
                size="sm"
                disabled={isUpdating}
                onClick={async () => {
                  setIsUpdating(true);
                  await onUpdate({ ...link, title: tempTitle, url: tempUrl });
                  setIsUpdating(false);
                  setEditMode(false);
                }}
                className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5"/>}
                {isUpdating ? "저장 중" : "저장"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 w-full">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-grow min-w-0">
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-background transition-colors duration-200">
                <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
              </div>
              <div className="flex-grow min-w-0 text-left">
                <div className="font-semibold text-base text-card-foreground group-hover:text-[#5b5fc7] transition-colors truncate">{link.title}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{link.url}</div>
              </div>
            </a>
            
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTempTitle(link.title);
                  setTempUrl(link.url);
                  setEditMode(true);
                }}
                className="h-8 w-8 text-muted-foreground hover:text-[#5b5fc7] hover:bg-[#5b5fc7]/10"
                title="수정하기"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                onClick={async () => {
                  if(window.confirm("정말 삭제하시겠습니까?")) {
                    setIsDeleting(true);
                    await onDelete(link.id);
                    setIsDeleting(false);
                  }
                }}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="삭제하기"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
