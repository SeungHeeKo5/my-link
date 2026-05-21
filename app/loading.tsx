import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-[#5b5fc7] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
