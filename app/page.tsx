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
  Link as LinkIcon
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
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Admin Header */}
      {isAdmin ? (
        <header className="sticky top-0 z-50 p-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b">
          <div className="font-bold text-xl tracking-tight">MyLink Admin</div>
          <div className="flex gap-2">
            <Button
              variant={isPreview ? "default" : "secondary"}
              onClick={() => setIsPreview(!isPreview)}
              className="gap-2"
            >
              {isPreview ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? "편집 모드로 돌아가기" : "내 페이지 보기"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsAdmin(false)}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </header>
      ) : (
        <header className="p-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsAdmin(true)}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Admin Login
          </Button>
        </header>
      )}

      {/* Main Content - Centered, Vertical Layout */}
      <main className="w-full max-w-md mx-auto px-4 flex flex-col gap-6 mt-8 items-center">
        
        {/* Profile Section */}
        <section className="w-full flex flex-col items-center text-center relative mt-6">
          <Badge variant="secondary" className="absolute -top-6">
            Hello, I'm
          </Badge>
          
          <div className="relative group mb-4">
            <Avatar className="w-28 h-28 border-2 border-muted shadow-sm">
              <AvatarImage src={profile.avatarUrl} alt="Avatar" />
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Pencil className="text-white w-6 h-6" />
              </div>
            )}
          </div>

          <InlineEdit
            value={profile.name}
            isEditing={isEditing}
            onSave={(val) => setProfile({ ...profile, name: val })}
            textClass="text-2xl font-bold mb-1"
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
            textClass="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full mb-6"
          />

          {/* About Me */}
          <div className="w-full bg-accent/20 rounded-lg p-4">
            <InlineEdit
              value={profile.about}
              isEditing={isEditing}
              onSave={(val) => setProfile({ ...profile, about: val })}
              textClass="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap text-center"
              multiline
            />
          </div>
        </section>

        {/* Links Area */}
        <section className="w-full flex flex-col gap-4 mt-2">
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
              className="w-full h-16 border-dashed border-2 hover:bg-accent text-muted-foreground hover:text-accent-foreground flex items-center justify-center gap-2 text-base mt-2"
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
      <div className="flex flex-col gap-2 w-full mt-2">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y text-center"
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
          }} className="gap-1">
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
        variant="ghost" 
        size="icon"
        onClick={() => setEditMode(true)}
        className="absolute -right-8 opacity-0 group-hover:opacity-100 h-6 w-6"
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
      <Card className={`relative shadow-sm transition-all w-full ${!link.isActive ? 'opacity-60 bg-muted/50' : ''}`}>
        <CardContent className="p-4 flex flex-col gap-4">
          
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
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
                      className="gap-1"
                    ><Save className="w-3.5 h-3.5"/> 저장</Button>
                  </div>
                </div>
              ) : (
                <div className="group relative w-full text-center">
                  <div className="font-semibold text-base">{link.title}</div>
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
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Clicks</span>
                <span className="text-sm font-bold">{link.clicks}</span>
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
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
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
      <Card className="hover:border-primary/50 hover:bg-accent/30 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 border">
            <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-grow text-center pr-4">
            <div className="font-semibold text-lg group-hover:text-primary transition-colors">{link.title}</div>
          </div>
          <div className="text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all">
            <ExternalLink className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
