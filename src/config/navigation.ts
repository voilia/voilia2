
import { 
  Folders, 
  MessageSquare, 
  Bot,
  LucideIcon
} from "lucide-react";

import { useProjectSidebar } from "@/hooks/useProjectSidebar";
import { useLocation } from "react-router-dom";

// Define navigation item type for better type safety
interface NavItem {
  title: string;
  icon: LucideIcon;
  children: {
    title: string;
    path: string;
  }[];
  actionButton?: {
    type: "project" | "room" | "generic";
    tooltipText?: string;
  };
}

export const useSidebarNavItems = (): NavItem[] => {
  const { projects, isLoading } = useProjectSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const projectId = currentPath.startsWith('/projects/') ? currentPath.split('/')[2] : undefined;
  
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
      actionButton: {
        type: "room",
        tooltipText: "Create New Room"
      },
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
