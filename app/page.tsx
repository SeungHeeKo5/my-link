"use client";

import React, { useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Eye,
  Save,
  ExternalLink,
  LogOut,
  LogIn,
  Link as LinkIcon,
  Code,
  Terminal,
  BookOpen,
  Briefcase
} from "lucide-react";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

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
  clicks: number;
  isActive: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>([]);

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
          clicks: data.clicks || 0,
          isActive: data.isActive !== undefined ? data.isActive : true,
        };
      });
      setLinks(fetchedLinks);
    }, (error) => {
      console.error("Error fetching links:", error);
    });

    return () => unsubscribe();
  }, []);

  // --- Add Link Modal State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    const finalUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;

    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      await addDoc(linksRef, {
        title: data.title.trim(),
        url: finalUrl,
        icon: "LinkIcon",
        clicks: 0,
        isActive: true,
        createdAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      });
      reset();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error adding link: ", err);
    }
  };

  const isEditing = isAdmin && !isPreview;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 selection:bg-primary selection:text-primary-foreground">
      
      {/* Header */}
      {isAdmin ? (
        <header className="sticky top-0 z-50 p-4 flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="font-semibold text-lg tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>MyLink <span className="text-muted-foreground font-normal">Admin</span></span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPreview ? "default" : "secondary"}
              onClick={() => setIsPreview(!isPreview)}
              size="sm"
            >
              {isPreview ? <Pencil className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreview ? "편집 모드로 돌아가기" : "내 페이지 보기"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsAdmin(false)}
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </header>
      ) : (
        <header className="p-4 flex justify-between items-center w-full max-w-md mx-auto">
          <Link 
            href="/mypage" 
            className="inline-flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-[#5b5fc7] font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 transition-colors shadow-sm"
          >
            <LinkIcon className="w-3 h-3" />
            <span>링크 관리 (Mypage)</span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => setIsAdmin(true)}
            size="sm"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </header>
      )}

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 flex flex-col gap-6 mt-6 items-center">
        
        {/* Top Add Link Button */}
        {isEditing && (
          <section className="w-full flex justify-center mb-[-10px] z-10 relative">
            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger className="w-full h-12 bg-[#5b5fc7] hover:bg-[#4c50ab] text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
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
                  <Button type="submit" className="mt-2 w-full bg-[#5b5fc7] hover:bg-[#4c50ab] active:scale-[0.98] text-white font-semibold flex items-center justify-center gap-1.5 transition-all">
                    <Plus className="w-4 h-4" />
                    <span>링크 추가하기</span>
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </section>
        )}

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
                {isEditing && (
                  <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <Pencil className="w-5 h-5" />
                  </div>
                )}
              </div>

              <InlineEdit
                value={profile.name}
                isEditing={isEditing}
                onSave={(val) => setProfile({ ...profile, name: val })}
                textClass="text-2xl font-bold tracking-tight mb-1"
              />
              
              <InlineEdit
                value={profile.englishName}
                isEditing={isEditing}
                onSave={(val) => setProfile({ ...profile, englishName: val })}
                textClass="text-sm text-muted-foreground mb-3"
              />
              
              <InlineEdit
                value={profile.dob}
                isEditing={isEditing}
                onSave={(val) => setProfile({ ...profile, dob: val })}
                textClass="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md mb-6"
              />

              <div className="w-full">
                <InlineEdit
                  value={profile.about}
                  isEditing={isEditing}
                  onSave={(val) => setProfile({ ...profile, about: val })}
                  textClass="text-sm leading-relaxed text-foreground whitespace-pre-wrap text-center"
                  multiline
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Links Area */}
        <section className="w-full flex flex-col gap-3 mb-10">

          {links
            .filter(link => isEditing || link.isActive)
            .map(link => (
            <LinkCard 
              key={link.id} 
              link={link} 
              isEditing={isEditing} 
              onUpdate={async (updated) => {
                try {
                  const linkRef = doc(db, "users", "anonymous", "links", updated.id);
                  await updateDoc(linkRef, {
                    title: updated.title,
                    url: updated.url,
                    isActive: updated.isActive,
                    updateAt: serverTimestamp()
                  });
                } catch(err) { console.error(err); }
              }}
              onDelete={async (id) => {
                try {
                  await deleteDoc(doc(db, "users", "anonymous", "links", id));
                } catch(err) { console.error(err); }
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
  isEditing, 
  onSave, 
  textClass = "", 
  multiline = false 
}: { 
  value: string; 
  isEditing: boolean; 
  onSave: (val: string) => void; 
  textClass?: string;
  multiline?: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  if (!isEditing) {
    return <div className={textClass}>{value}</div>;
  }

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
  isEditing,
  onUpdate,
  onDelete
}: { 
  link: LinkItem; 
  isEditing: boolean;
  onUpdate: (link: LinkItem) => void;
  onDelete: (id: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
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

  if (isEditing) {
    return (
      <Card className={`relative shadow-sm transition-opacity w-full border bg-card ${!link.isActive ? 'opacity-60 bg-muted/30' : ''}`}>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border/50">
              <IconComponent className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-grow w-full">
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
                      onClick={() => {
                        onUpdate({ ...link, title: tempTitle, url: tempUrl });
                        setEditMode(false);
                      }}
                    ><Save className="w-3.5 h-3.5 mr-1.5"/> 저장</Button>
                  </div>
                </div>
              ) : (
                <div className="group relative w-full text-center">
                  <div className="font-semibold text-base text-card-foreground">{link.title}</div>
                  <div className="text-xs text-muted-foreground truncate font-mono mt-0.5">{link.url}</div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setTempTitle(link.title);
                      setTempUrl(link.url);
                      setEditMode(true);
                    }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-8 w-8"
                  ><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
              )}
            </div>
          </div>

          {!editMode && (
            <div className="flex flex-row items-center justify-between border-t pt-3 mt-1">
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] font-medium uppercase text-muted-foreground">Clicks</span>
                <span className="text-sm font-semibold">{link.clicks}</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={link.isActive}
                  onCheckedChange={(checked) => onUpdate({ ...link, isActive: checked })}
                  title={link.isActive ? "비공개로 전환" : "공개로 전환"}
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if(window.confirm("정말 삭제하시겠습니까?")) {
                      onDelete(link.id);
                    }
                  }}
                  className="text-destructive hover:bg-destructive/10 ml-2"
                  title="삭제"
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

  // Visitor View
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block w-full"
    >
      <Card className="w-full border bg-card shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-background transition-colors duration-200">
            <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
          </div>
          <div className="flex-grow text-center pr-4">
            <div className="font-semibold text-base">{link.title}</div>
          </div>
          <div className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
