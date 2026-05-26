"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link as LinkIcon, Plus, Trash2, ExternalLink, Globe, Loader2, Pencil, Save, Copy, BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { LinkItemData } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, getDocs, limit, setDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
import { BookOpen, Briefcase } from "lucide-react";
import { incrementClickCount } from "@/app/actions/click";

interface ProfileData {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
}

export default function MainPage() {
  const [links, setLinks] = useState<LinkItemData[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Owner state
  const [portfolioOwnerId, setPortfolioOwnerId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Forms & Modals
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: string, title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ displayName: "", bio: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Profile Dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch the primary owner of this page
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(1));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          setPortfolioOwnerId(snap.docs[0].id);
        } else {
          setPortfolioOwnerId(null);
        }
      } catch (err) {
        console.error("Error fetching owner:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchOwner();
  }, []);

  // Determine if logged in user is owner
  useEffect(() => {
    if (!authLoading && !initialLoading) {
      if (user && portfolioOwnerId === user.uid) {
        setIsOwner(true);
      } else if (user && portfolioOwnerId === null) {
        // First user to login becomes the owner
        setPortfolioOwnerId(user.uid);
        setIsOwner(true);
        // Create base profile
        const userDocRef = doc(db, "users", user.uid);
        setDoc(userDocRef, {
          username: user.email?.split('@')[0] || "user",
          displayName: user.displayName || user.email?.split('@')[0] || "User",
          bio: "",
          avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        }, { merge: true }).catch(console.error);
      } else {
        setIsOwner(false);
      }
    }
  }, [user, portfolioOwnerId, authLoading, initialLoading]);

  // Subscribe to profile data
  useEffect(() => {
    if (!portfolioOwnerId) return;
    const userDocRef = doc(db, "users", portfolioOwnerId);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProfile({
          userId: portfolioOwnerId,
          username: data.username || "user",
          displayName: data.displayName || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolioOwnerId}`,
        });
      }
    });
    return () => unsubscribe();
  }, [portfolioOwnerId]);

  // Subscribe to links
  useEffect(() => {
    if (!portfolioOwnerId) return;
    const linksRef = collection(db, "users", portfolioOwnerId, "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItemData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        icon: doc.data().icon || "LinkIcon",
        clickCount: doc.data().clickCount || 0,
        updateAt: doc.data().updateAt ? doc.data().updateAt.toMillis() : undefined,
      }));
      setLinks(fetchedLinks);
    }, (error) => {
      console.error("Error fetching links:", error);
    });

    return () => unsubscribe();
  }, [portfolioOwnerId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleEditProfileClick = () => {
    if (!profile) return;
    setTempProfile({
      displayName: profile.displayName,
      bio: profile.bio
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: tempProfile.displayName.trim(),
        bio: tempProfile.bio.trim()
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      toast.error("프로필 저장에 실패했습니다.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) { setError("제목을 입력해주세요."); return; }
    if (!trimmedUrl) { setError("주소(URL)를 입력해주세요."); return; }

    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setError("올바른 주소 형식을 입력해주세요. (예: example.com)");
      return;
    }

    setIsSubmitting(true);
    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const linksRef = collection(db, "users", user.uid, "links");
      await addDoc(linksRef, {
        title: trimmedTitle,
        url: finalUrl,
        icon: "LinkIcon",
        clickCount: 0,
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
    if (!linkToDelete || !user) return;
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await deleteDoc(doc(db, "users", user.uid, "links", linkToDelete.id));
      setDeleteModalOpen(false);
      setLinkToDelete(null);
    } catch (err) {
      console.error(err);
      alert("링크 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLinkClick = (linkId: string) => {
    if (portfolioOwnerId) {
      incrementClickCount(portfolioOwnerId, linkId).catch(err => {
        console.error("클릭 카운트 저장 실패:", err);
      });
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5b5fc7] animate-spin" />
      </div>
    );
  }

  // --- Render Inline Edit Form ---
  const renderInlineEdit = (linkItem: LinkItemData) => {
    // We implement inline edit directly within the map for simplicity, or we can use a sub-component.
    // For cleaner code, let's just make it a sub-component below.
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground font-sans pb-20 selection:bg-[#5b5fc7]/20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Globe className="w-5 h-5 text-[#5b5fc7]" />
          <span>MyLink</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-muted p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-border"
              >
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">{user.email?.split('@')[0]} 님</span>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="p-4 border-b bg-muted/30">
                     <span className="font-bold text-base truncate block">{user.displayName || user.email?.split('@')[0]}</span>
                     <span className="text-xs text-muted-foreground truncate block">{user.email}</span>
                  </div>
                  <div className="p-3 bg-muted/10 flex flex-col gap-2">
                    <Link href="/stats" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-sm font-semibold flex items-center justify-center gap-1.5 text-slate-700 dark:text-zinc-300">
                        <BarChart3 className="w-3.5 h-3.5" /> 통계 대시보드
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full text-sm font-semibold">
                      로그아웃
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={handleLogin} className="text-xs bg-[#5b5fc7] hover:bg-[#4c50ab] text-white rounded-full px-4">
              관리자 로그인
            </Button>
          )}
        </div>
      </header>

      <main className="w-full max-w-md mx-auto px-4 pt-10 flex flex-col items-center gap-8">
        
        {/* Profile Section */}
        {profile ? (
          <section className="w-full flex flex-col items-center text-center">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-background bg-muted shadow-sm mb-4">
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback className="text-xl">{profile.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isOwner && !isEditingProfile && (
                 <button 
                   onClick={handleEditProfileClick}
                   className="absolute bottom-4 right-0 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
                 >
                   <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                 </button>
              )}
            </div>

            {isEditingProfile && isOwner ? (
               <div className="flex flex-col gap-3 w-full mt-2 animate-in fade-in zoom-in-95 duration-200">
                 <Input
                   value={tempProfile.displayName}
                   onChange={(e) => setTempProfile(prev => ({...prev, displayName: e.target.value}))}
                   placeholder="표시 이름"
                   className="text-center font-bold focus-visible:ring-[#5b5fc7]"
                 />
                 <textarea
                   value={tempProfile.bio}
                   onChange={(e) => setTempProfile(prev => ({...prev, bio: e.target.value}))}
                   placeholder="한 줄 소개"
                   className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b5fc7] disabled:opacity-50 resize-y text-center"
                 />
                 <div className="flex gap-2 justify-center mt-1">
                   <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)} disabled={isSavingProfile}>
                     취소
                   </Button>
                   <Button size="sm" onClick={handleSaveProfile} disabled={isSavingProfile} className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white">
                     {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                     저장
                   </Button>
                 </div>
               </div>
            ) : (
               <>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-1">
                  {profile.displayName || "이름 없음"}
                </h1>
                {profile.bio && (
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap max-w-[280px] mt-2">
                    {profile.bio}
                  </p>
                )}
               </>
            )}
          </section>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold mb-2">환영합니다!</h2>
            <p className="text-sm text-muted-foreground mb-6">첫 번째로 로그인하여 이 페이지의 주인이 되어보세요.</p>
            <Button onClick={handleLogin} className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white rounded-full px-6 py-5 text-base shadow-md hover:shadow-lg transition-all">
              Google로 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Add Link Form (Owner Only) */}
        {isOwner && profile && (
          <section className="w-full flex justify-center z-10 relative">
            {isDialogOpen ? (
              <Card className="w-full border bg-card shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <CardContent className="p-4 flex flex-col gap-2">
                  <form onSubmit={handleAddLink} className="flex flex-col gap-2">
                    <Input
                      type="text"
                      placeholder="링크 제목 (예: 인스타그램)"
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setError(""); }}
                      className={`font-medium text-center focus-visible:ring-[#5b5fc7] ${error && !title.trim() ? 'border-destructive' : ''}`}
                      autoFocus
                    />
                    <Input
                      type="text"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(""); }}
                      className={`text-xs font-mono text-center focus-visible:ring-[#5b5fc7] ${error && !url.trim() ? 'border-destructive' : ''}`}
                    />
                    {error && <p className="text-xs font-medium text-destructive mt-0.5 text-center">{error}</p>}
                    <div className="flex gap-2 justify-center mt-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => { setIsDialogOpen(false); setError(""); }} disabled={isSubmitting}>
                        취소
                      </Button>
                      <Button type="submit" size="sm" disabled={isSubmitting} className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white">
                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                        추가하기
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
        )}

        {/* Links List */}
        {profile && (
          <section className="w-full flex flex-col gap-3">
            {links.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center">
                <LinkIcon className="w-8 h-8 text-muted-foreground/30 mb-3 stroke-[1.5]" />
                <p className="text-sm text-muted-foreground">아직 등록된 링크가 없습니다.</p>
              </div>
            ) : (
              links.map((link) => (
                <LinkCardItem 
                  key={link.id} 
                  link={link} 
                  isOwner={isOwner}
                  onDelete={requestDelete} 
                  uid={portfolioOwnerId!}
                  onLinkClick={() => handleLinkClick(link.id)}
                />
              ))
            )}
          </section>
        )}

        {/* Statistics Section (Owner Only) */}
        {isOwner && profile && (
          <section className="flex flex-col gap-3 mt-4 w-full">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#5b5fc7]" />
                <span>클릭 통계</span>
              </h2>
            </div>
            
            <Card className="border border-slate-200/60 dark:border-zinc-850 bg-card overflow-hidden">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-[#5b5fc7]/10 to-[#5b5fc7]/5 rounded-xl border border-[#5b5fc7]/10">
                  <span className="text-xs font-semibold text-[#5b5fc7]/80 uppercase tracking-wider mb-1.5">Total Clicks</span>
                  <div className="text-4xl font-black text-[#5b5fc7] tracking-tight">
                    {links.reduce((acc, link) => acc + (link.clickCount || 0), 0).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 px-1 mb-1">인기 링크 순위</span>
                  {links.length === 0 ? (
                    <div className="text-xs text-center text-muted-foreground py-2">데이터가 없습니다.</div>
                  ) : (
                    [...links]
                      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
                      .map((link, idx) => (
                        <div key={link.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-5 text-center text-xs font-black ${idx < 3 ? 'text-[#5b5fc7]' : 'text-slate-400 dark:text-zinc-500'}`}>
                              {idx + 1}
                            </div>
                            <span className="text-sm font-semibold truncate text-slate-700 dark:text-zinc-300">{link.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
                            <span className="text-[10px] font-semibold text-muted-foreground">CLICK</span>
                            <span className="text-sm font-bold text-foreground">{link.clickCount || 0}</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-16 text-center pb-8">
         <div className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
           <Globe className="w-3 h-3" />
           Powered by MyLink
         </div>
      </footer>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">정말 삭제하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
            {linkToDelete && (
              <p className="text-sm text-foreground">
                <span className="font-bold">{linkToDelete.title}</span> 링크를 삭제 합니다.
              </p>
            )}
            <p className="text-destructive font-bold text-sm mt-1">이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <div className="flex items-center gap-3 w-full mt-2">
            <Button variant="outline" className="w-full flex-1" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" className="w-full flex-1" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              삭제하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Sub Component: Link Card ---
function LinkCardItem({ link, isOwner, onDelete, uid, onLinkClick }: { link: LinkItemData; isOwner: boolean; onDelete: (id: string, title: string) => void; uid: string; onLinkClick: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setError("");
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    if (!trimmedTitle) { setError("제목을 입력해주세요."); return; }
    if (!trimmedUrl) { setError("주소(URL)를 입력해주세요."); return; }

    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setError("올바른 주소 형식을 입력해주세요."); return;
    }

    setIsUpdating(true);
    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;

    try {
      const linkRef = doc(db, "users", uid, "links", link.id);
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
      <Card className="border border-slate-200/60 dark:border-zinc-850 bg-card shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">
          <Input 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="링크 제목"
            className="h-9 text-sm focus-visible:ring-[#5b5fc7]"
          />
          <Input 
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-9 text-sm font-mono focus-visible:ring-[#5b5fc7]"
          />
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          <div className="flex items-center gap-2 justify-end mt-1">
            <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditTitle(link.title); setEditUrl(link.url); }} disabled={isUpdating}>
              취소
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating} className="bg-[#5b5fc7] hover:bg-[#4c50ab] text-white">
              {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />} 저장
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="group relative w-full flex items-center">
      <a 
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onLinkClick}
        className="block w-full flex-grow"
      >
        <Card className={`border border-slate-200/60 dark:border-zinc-850 bg-card hover:bg-slate-100/50 dark:hover:bg-zinc-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isOwner ? 'rounded-r-none border-r-0' : ''}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-background transition-colors duration-200">
              <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
            </div>
            <div className="flex-grow min-w-0 text-left flex flex-col">
              <span className="font-semibold text-base text-card-foreground group-hover:text-[#5b5fc7] transition-colors truncate flex items-center gap-1.5">
                <span>{link.title}</span>
                <span className="text-[11px] text-muted-foreground font-normal whitespace-nowrap mt-0.5">
                  : {link.clickCount || 0} 클릭
                </span>
              </span>
              <span className="text-xs text-muted-foreground font-mono mt-0.5 truncate flex items-center gap-1">
                {link.url}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </CardContent>
        </Card>
      </a>
      
      {isOwner && (
        <div className="flex flex-col border border-slate-200/60 dark:border-zinc-850 bg-card rounded-r-xl overflow-hidden shrink-0 self-stretch">
          <button 
            onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
            className="flex-1 px-3 flex items-center justify-center text-muted-foreground hover:bg-[#5b5fc7]/10 hover:text-[#5b5fc7] transition-colors border-b border-slate-200/60 dark:border-zinc-850"
            title="수정"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onDelete(link.id, link.title); }}
            className="flex-1 px-3 flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
