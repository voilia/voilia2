
import { 
  Folders, 
  MessageSquare, 
  Bot
} from "lucide-react";

export const sidebarNavItems = [
  {
    title: "Projects",
    icon: Folders,
    children: [
      { title: "All Projects", path: "/projects" },
      { title: "Project 1", path: "/projects/1" },
      { title: "Project 2", path: "/projects/2" },
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
