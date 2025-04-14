
import { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className={`flex-1 transition-all duration-500 ease-in-out ${isMobile ? 'pl-0' : 'ml-[70px] lg:ml-[240px]'}`}>
        <div className="p-6 lg:p-8 transition-all duration-300 animate-in">
          {children}
        </div>
      </main>
    </div>
  );
}
