
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, Settings, BarChart3 } from "lucide-react";

type TabType = "rooms" | "members" | "settings" | "analytics";

interface ProjectDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProjectDetailTabs({ activeTab, onTabChange }: ProjectDetailTabsProps) {
  return (
    <div className="border-b sticky top-0 bg-background z-10 pb-1">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabType)} className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Rooms</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
