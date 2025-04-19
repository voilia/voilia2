
export function generateDemoResponse(userMessage: string): string {
  const normalizedMessage = userMessage.toLowerCase();
  
  if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
    return "Hello there! I'm the Demo Agent for VOILIA. How can I assist you today?";
  }
  
  if (normalizedMessage.includes("help") || normalizedMessage.includes("how")) {
    return "I can help you explore VOILIA's capabilities! Ask me about messaging, file sharing, agent collaboration, or any other features you're curious about.";
  }
  
  if (normalizedMessage.includes("feature") || normalizedMessage.includes("what can you do")) {
    return "VOILIA offers real-time messaging, file sharing, smart AI agents, project management, and seamless integrations with tools like N8N. What specific feature would you like to know more about?";
  }
  
  if (normalizedMessage.includes("file") || normalizedMessage.includes("upload")) {
    return "You can upload files directly in the chat by clicking the paperclip icon, dragging and dropping files, or pasting content. All files are securely stored and accessible to your team.";
  }
  
  if (normalizedMessage.includes("agent") || normalizedMessage.includes("ai")) {
    return "VOILIA's AI agents can assist with various tasks based on their specializations. You can add multiple agents to a room to collaborate on complex problems or specific workflows.";
  }
  
  if (normalizedMessage.includes("project") || normalizedMessage.includes("team")) {
    return "Projects in VOILIA help organize your work. You can create rooms within projects, add team members with different roles, and customize your workspace to fit your team's needs.";
  }
  
  if (normalizedMessage.includes("webhook") || normalizedMessage.includes("n8n") || normalizedMessage.includes("integration")) {
    return "VOILIA integrates seamlessly with N8N through webhooks, allowing you to build custom workflows that connect with your other tools and automate routine tasks.";
  }
  
  if (normalizedMessage.includes("thank")) {
    return "You're welcome! Let me know if you have any other questions about VOILIA.";
  }
  
  return "That's an interesting point! VOILIA is designed to enhance team collaboration through smart messaging and AI assistance. Is there anything specific about the platform you'd like to explore?";
}
