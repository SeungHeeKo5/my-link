"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { LinkIcon, BookOpen, Briefcase, ExternalLink, Loader2 } from "lucide-react";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
import { incrementClickCount } from "@/app/actions/click";

interface ProfileData {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!username) return;
        
        // 1. Find user by username
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError(true);
          setLoading(false);
          return;
        }
        
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as ProfileData;
        const userId = userDoc.id;
        
        setProfile({
          userId: userId,
          username: userData.username || username,
          displayName: userData.displayName || "",
          bio: userData.bio || "",
          avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
        
        // 2. Fetch links
        const linksRef = collection(db, "users", userId, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);
        
        const fetchedLinks = linksSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          url: doc.data().url,
          icon: doc.data().icon || "LinkIcon",
        }));
        
        setLinks(fetchedLinks);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5b5fc7] animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl">🤔</span>
        </div>
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground text-sm">요청하신 프로필(@{username})이 존재하지 않거나 삭제되었습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground font-sans pb-20 selection:bg-[#5b5fc7]/20">
      <main className="w-full max-w-md mx-auto px-4 pt-12 flex flex-col items-center gap-6">
        
        {/* Profile Section */}
        <section className="w-full flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 border-4 border-background bg-muted shadow-sm mb-4">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback className="text-xl">{profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-1">
            {profile.displayName}
          </h1>
          <p className="text-sm font-medium text-[#5b5fc7] bg-[#5b5fc7]/10 px-3 py-1 rounded-full mb-4">
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap max-w-[280px]">
              {profile.bio}
            </p>
          )}
        </section>

        {/* Links Section */}
        <section className="w-full flex flex-col gap-3 mt-4">
          {links.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">아직 등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links.map((link) => {
              const IconMap: Record<string, React.ElementType> = {
                Instagram: FaInstagram,
                Youtube: FaYoutube,
                BookOpen,
                Github: FaGithub,
                Briefcase,
              };
              const IconComponent = IconMap[link.icon] || LinkIcon;

              return (
                <a 
                  key={link.id} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    incrementClickCount(profile.userId, link.id).catch(err => {
                      console.error("클릭 카운트 저장 실패:", err);
                    });
                  }}
                  className="group block"
                >
                  <Card className="border border-slate-200/60 dark:border-zinc-850 bg-card hover:bg-slate-100/50 dark:hover:bg-zinc-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-background transition-colors duration-200">
                        <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                      </div>
                      <div className="flex-grow min-w-0 text-left flex flex-col">
                        <span className="font-semibold text-base text-card-foreground group-hover:text-[#5b5fc7] transition-colors truncate">
                          {link.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono mt-0.5 truncate flex items-center gap-1">
                          {link.url}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })
          )}
        </section>

      </main>
      
      <footer className="mt-16 text-center pb-8">
         <a href="/" className="text-xs font-semibold text-muted-foreground hover:text-[#5b5fc7] transition-colors flex items-center justify-center gap-1.5">
           <LinkIcon className="w-3 h-3" />
           Powered by MyLink
         </a>
      </footer>
    </div>
  );
}
