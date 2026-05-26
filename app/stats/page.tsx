"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { ArrowLeft, BarChart3, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import Link from "next/link";

interface LinkStat {
  id: string;
  title: string;
  clickCount: number;
}

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [links, setLinks] = useState<LinkStat[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const linksRef = collection(db, "users", user.uid, "links");
    const q = query(linksRef, orderBy("clickCount", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkStat[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || "이름 없음",
        clickCount: doc.data().clickCount || 0,
      }));
      setLinks(fetchedLinks);
      setDataLoading(false);
    }, (error) => {
      console.error("Error fetching stats:", error);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading || (!user && !authLoading) || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5b5fc7] animate-spin" />
      </div>
    );
  }

  const totalClicks = links.reduce((acc, link) => acc + link.clickCount, 0);

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "#5b5fc7",
    },
  };

  const chartData = links.slice(0, 10).map(link => ({
    name: link.title.length > 8 ? link.title.substring(0, 8) + '...' : link.title,
    clicks: link.clickCount
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground font-sans pb-20 selection:bg-[#5b5fc7]/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로</span>
          </Link>
        </div>
        <div className="font-bold text-base tracking-tight flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-[#5b5fc7]" />
          <span>상세 통계</span>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 pt-8 flex flex-col gap-6">
        
        {/* 상단: 총 클릭 수 */}
        <section>
          <Card className="border border-slate-200/60 dark:border-zinc-850 bg-gradient-to-br from-[#5b5fc7] to-[#4c50ab] text-white shadow-md">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">모든 링크 총 클릭 수</span>
              <div className="text-5xl font-black tracking-tight">
                {totalClicks.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 중단: 차트 */}
        {links.length > 0 && (
          <section>
            <Card className="border border-slate-200/60 dark:border-zinc-850 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#5b5fc7]" />
                  클릭 수 TOP 10 차트
                </CardTitle>
                <CardDescription>가장 많이 클릭된 상위 10개 링크입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                  <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 하단: 목록 */}
        <section>
          <Card className="border border-slate-200/60 dark:border-zinc-850 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-base">링크별 클릭 통계</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {links.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  등록된 링크가 없습니다.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border/50">
                  {links.map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-[#5b5fc7]/10 text-[#5b5fc7]' : 'bg-muted text-muted-foreground'}`}>
                          {index + 1}
                        </div>
                        <span className="font-semibold text-sm truncate max-w-[200px] sm:max-w-[300px]">
                          {link.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border shadow-sm shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground">CLICK</span>
                        <span className="font-black text-sm text-[#5b5fc7]">{link.clickCount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  );
}
