
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, Settings, BarChart3 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TabType = "rooms" | "members" | "settings" | "analytics";

interface ProjectDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProjectDetailTabs({ activeTab, onTabChange }: ProjectDetailTabsProps) {
  return (
    <div className="border-b sticky top-0 bg-background z-10 pb-1 shadow-sm">
      <ScrollArea className="w-full">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabType)} className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-start p-1">
            <TabsTrigger value="rooms">
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4" />
                <span className="text-sm">Rooms</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="members">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                <span className="text-sm">Members</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Analytics</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
