"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight, Loader2 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && user && user.email) {
      const username = user.email.split('@')[0];
      router.push(`/${username}`);
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 text-[#5b5fc7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-10 h-10 text-[#5b5fc7]" />
        <h1 className="text-3xl font-bold tracking-tight">MyLink</h1>
      </div>
      
      <div className="text-center max-w-sm w-full bg-card border shadow-sm rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-3">환영합니다</h2>
        <p className="text-sm text-muted-foreground mb-8">
          마이링크는 개인 url을 관리하는 서비스입니다.
        </p>
        
        <Button 
          onClick={handleLogin} 
          className="w-full bg-[#5b5fc7] hover:bg-[#4c50ab] text-white rounded-full py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        >
          구글로 로그인하기 <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
