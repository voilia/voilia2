
import { 
  Folders, 
  MessageSquare, 
  Bot
} from "lucide-react";

import { useProjectSidebar } from "@/hooks/useProjectSidebar";

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
      children: [
        { title: "All Rooms", path: "/rooms" },
        { title: "Room 1", path: "/rooms/1" },
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
