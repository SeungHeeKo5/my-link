"use client";

import React, { useState, useEffect } from "react";
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
import { dummyLinks } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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

const initialLinks: LinkItem[] = dummyLinks.map(link => ({
  ...link,
  clicks: Math.floor(Math.random() * 100),
  isActive: true,
}));

export default function MyLinkApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  // Determine actual view mode
  const isEditing = isAdmin && !isPreview;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground font-sans pb-20 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-100/50 via-purple-50/20 to-transparent dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-transparent -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 dark:bg-purple-600/10 blur-3xl -z-10" />

      {/* Admin Header */}
      {isAdmin ? (
        <header className="sticky top-0 z-50 p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-sm">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-500" />
            <span>MyLink <span className="text-muted-foreground text-sm font-normal">Admin</span></span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPreview ? "default" : "secondary"}
              onClick={() => setIsPreview(!isPreview)}
              className="gap-2 rounded-full shadow-sm"
              size="sm"
            >
              {isPreview ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? "편집 모드로 돌아가기" : "내 페이지 보기"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsAdmin(false)}
              className="gap-2 rounded-full shadow-sm"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </header>
      ) : (
        <header className="p-4 flex justify-end relative z-10">
          <Button
            variant="ghost"
            onClick={() => setIsAdmin(true)}
            className="gap-2 rounded-full hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm"
          >
            <LogIn className="w-4 h-4" />
            Admin Login
          </Button>
        </header>
      )}

      {/* Main Content - Centered, Vertical Layout */}
      <main className="w-full max-w-[480px] mx-auto px-4 flex flex-col gap-6 mt-4 items-center relative z-10">
        
        {/* Profile Section */}
        <section className="w-full flex flex-col items-center text-center mt-2 relative">
          <Card className="w-full overflow-hidden border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl">
            {/* Cover Banner */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full relative">
              <Badge variant="secondary" className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white border-0 font-semibold shadow-sm">
                <Code className="w-3 h-3 mr-1" />
                Developer
              </Badge>
            </div>

            <div className="px-6 pb-8 -mt-16 flex flex-col items-center">
              <div className="relative group mb-5">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-900 shadow-lg bg-background">
                  <AvatarImage src={profile.avatarUrl} alt="Avatar" />
                  <AvatarFallback className="text-3xl">SH</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                    <Pencil className="text-white w-6 h-6" />
                  </div>
                )}
              </div>

              <InlineEdit
                value={profile.name}
                isEditing={isEditing}
                onSave={(val) => setProfile({ ...profile, name: val })}
                textClass="text-2xl font-extrabold tracking-tight mb-1"
              />
              
              <InlineEdit
                value={profile.englishName}
                isEditing={isEditing}
                onSave={(val) => setProfile({ ...profile, englishName: val })}
                textClass="text-sm font-medium text-muted-foreground mb-3"
              />
              
              <InlineEdit
                value={profile.dob}
                isEditing={isEditing}
                onSave={(val) => setProfile({ ...profile, dob: val })}
                textClass="text-[11px] font-mono text-muted-foreground px-3 py-1 bg-muted/50 rounded-full mb-6 border border-border/50 shadow-sm"
              />

              {/* About Me */}
              <div className="w-full bg-muted/30 dark:bg-muted/10 rounded-2xl p-5 border border-border/50 relative overflow-hidden group">
                <Terminal className="w-24 h-24 absolute -bottom-6 -right-6 text-muted-foreground/5 rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110" />
                <InlineEdit
                  value={profile.about}
                  isEditing={isEditing}
                  onSave={(val) => setProfile({ ...profile, about: val })}
                  textClass="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap text-center relative z-10"
                  multiline
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Links Area */}
        <section className="w-full flex flex-col gap-4 mt-2 mb-10">
          {links
            .filter(link => isEditing || link.isActive)
            .map(link => (
            <LinkCard 
              key={link.id} 
              link={link} 
              isEditing={isEditing} 
              onUpdate={(updated) => setLinks(links.map(l => l.id === updated.id ? updated : l))}
              onDelete={(id) => setLinks(links.filter(l => l.id !== id))}
            />
          ))}

          {isEditing && (
            <Button 
              variant="outline"
              className="w-full h-16 border-dashed border-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center justify-center gap-2 text-base mt-2 rounded-2xl transition-all"
              onClick={() => {
                const newLink: LinkItem = {
                  id: Date.now().toString(),
                  title: "새로운 링크",
                  url: "https://",
                  icon: "LinkIcon",
                  clicks: 0,
                  isActive: true,
                };
                setLinks([...links, newLink]);
              }}
            >
              <Plus className="w-5 h-5" /> 새로운 링크 추가
            </Button>
          )}
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

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  if (!isEditing) {
    return <div className={textClass}>{value}</div>;
  }

  if (editMode) {
    return (
      <div className="flex flex-col gap-2 w-full mt-2 relative z-20">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex min-h-[100px] w-full rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y text-center shadow-inner"
            autoFocus
          />
        ) : (
          <Input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="text-center rounded-xl border-indigo-200 dark:border-indigo-800 shadow-inner bg-white dark:bg-slate-900"
            autoFocus
          />
        )}
        <div className="flex gap-2 justify-center mt-2">
          <Button variant="secondary" size="sm" className="rounded-full px-4" onClick={() => {
              setTempValue(value);
              setEditMode(false);
          }}>
            취소
          </Button>
          <Button size="sm" className="rounded-full px-4 bg-indigo-600 hover:bg-indigo-700 text-white gap-1 shadow-md" onClick={() => {
              onSave(tempValue);
              setEditMode(false);
          }}>
            <Save className="w-3.5 h-3.5" /> 저장
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative inline-flex items-center w-full justify-center">
      <div className={textClass}>{value}</div>
      <Button
        variant="secondary" 
        size="icon"
        onClick={() => setEditMode(true)}
        className="absolute -right-10 opacity-0 group-hover:opacity-100 h-7 w-7 rounded-full shadow-sm transition-all hover:scale-110"
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
      <Card className={`relative transition-all w-full border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl ${!link.isActive ? 'opacity-50 grayscale' : ''}`}>
        <CardContent className="p-5 flex flex-col gap-4">
          
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center shrink-0 border border-white/50 dark:border-white/5 shadow-sm">
              <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="flex-grow w-full">
              {editMode ? (
                <div className="flex flex-col gap-2">
                  <Input 
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    placeholder="링크 제목"
                    className="font-medium text-center rounded-xl"
                  />
                  <Input 
                    type="url" 
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://..."
                    className="text-xs font-mono text-center rounded-xl text-muted-foreground"
                  />
                  <div className="flex gap-2 justify-center mt-2">
                    <Button 
                      variant="secondary" size="sm" className="rounded-full"
                      onClick={() => setEditMode(false)}
                    >취소</Button>
                    <Button 
                      size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
                      onClick={() => {
                        onUpdate({ ...link, title: tempTitle, url: tempUrl });
                        setEditMode(false);
                      }}
                    ><Save className="w-3.5 h-3.5"/> 저장</Button>
                  </div>
                </div>
              ) : (
                <div className="group relative w-full text-center">
                  <div className="font-bold text-base tracking-tight text-foreground/90">{link.title}</div>
                  <div className="text-xs text-muted-foreground truncate font-mono mt-1 px-4">{link.url}</div>
                  <Button 
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setTempTitle(link.title);
                      setTempUrl(link.url);
                      setEditMode(true);
                    }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full shadow-sm transition-all hover:scale-110"
                  ><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
              )}
            </div>
          </div>

          {!editMode && (
            <div className="flex flex-row items-center justify-between border-t border-border/50 pt-4 mt-1">
              <div className="flex flex-col items-center px-3 bg-muted/30 rounded-lg py-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">Clicks</span>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{link.clicks}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Switch 
                  checked={link.isActive}
                  onCheckedChange={(checked) => onUpdate({ ...link, isActive: checked })}
                  title={link.isActive ? "비공개로 전환" : "공개로 전환"}
                  className="data-[state=checked]:bg-indigo-500"
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if(window.confirm("정말 삭제하시겠습니까?")) {
                      onDelete(link.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 ml-2 rounded-full"
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
      onClick={() => {
        console.log(`Link clicked: ${link.id}`);
      }}
    >
      <Card className="w-full border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-colors duration-500" />
        <CardContent className="p-5 flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shrink-0 border border-white/50 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform duration-300 group-hover:from-indigo-100 group-hover:to-purple-100 dark:group-hover:from-indigo-900/50 dark:group-hover:to-purple-900/50">
            <IconComponent className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
          </div>
          <div className="flex-grow text-center pr-4">
            <div className="font-bold text-lg text-foreground/90 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 dark:group-hover:from-indigo-400 dark:group-hover:to-purple-400 transition-all duration-300 tracking-tight">
              {link.title}
            </div>
          </div>
          <div className="text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-purple-500 transition-all duration-300 transform group-hover:translate-x-1">
            <ExternalLink className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
