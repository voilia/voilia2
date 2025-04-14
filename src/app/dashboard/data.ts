
export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  isPinned: boolean;
}

export const dashboardData = {
  projects: [
    { 
      id: "ai-assistant", 
      title: "AI Assistant", 
      description: "Natural language processing AI assistant", 
      isPinned: true 
    },
    { 
      id: "data-visualization", 
      title: "Data Visualization", 
      description: "Interactive data visualization tool", 
      isPinned: true 
    }
  ],
  rooms: [
    { 
      id: "development-team", 
      title: "Development Team", 
      description: "Discuss development tasks and issues", 
      isPinned: true 
    }
  ],
  agents: [
    { 
      id: "code-assistant", 
      title: "Code Assistant", 
      description: "Helps with code generation and reviews", 
      isPinned: true 
    },
    { 
      id: "research-agent", 
      title: "Research Agent", 
      description: "Conducts research and summarizes findings", 
      isPinned: true 
    }
  ]
};
