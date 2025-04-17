
import { 
  Folders, 
  MessageSquare, 
  Bot,
  LucideIcon
} from "lucide-react";

import { useProjectSidebar } from "@/hooks/useProjectSidebar";
import { NavActionButton } from "@/app/navigation/components/buttons/NavActionButton";

export const useSidebarNavItems = () => {
  const { projects, isLoading } = useProjectSidebar();
  
  return [
    {
      title: "Projects",
      icon: Folders,
      children: [
        { title: "All Projects", path: "/projects" },
        ...(isLoading 
          ? [{ title: "Loading...", path: "#" }] 
          : projects.map(project => ({
              title: project.name,
              path: `/projects/${project.id}`
            }))
        ),
      ],
    },
    {
      title: "Rooms",
      icon: MessageSquare,
      actionButton: (isMobile: boolean, projectId?: string) => (
        <NavActionButton 
          type="room" 
          isMobile={isMobile} 
          tooltipText="Create New Room"
          projectId={projectId}
        />
      ),
      children: [
        { title: "All Rooms", path: "/rooms" },
      ],
    },
    {
      title: "Agents",
      icon: Bot,
      children: [
        { title: "All Agents", path: "/agents" },
      ],
    },
  ];
};
