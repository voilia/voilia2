
import { useState } from "react";
import { SmartStartCard } from "./SmartStartCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Smart Start template data
const SMART_STARTS = [
  {
    id: "compare-room",
    name: "Compare Room",
    description: "Compare different ideas, products, or approaches with multiple AI agents.",
    mode: "Compare",
    color: "#4F46E5",
    icon: "scale"
  },
  {
    id: "social-pack",
    name: "Social Media Pack",
    description: "Generate content for multiple social media platforms at once.",
    mode: "Create",
    color: "#EC4899",
    icon: "share"
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Plan your product launch with marketing, PR, and sales strategies.",
    mode: "Flow",
    color: "#10B981",
    icon: "rocket"
  },
  {
    id: "creative-studio",
    name: "Creative Studio",
    description: "Brainstorm creative ideas with specialized AI agents for different perspectives.",
    mode: "Synergy",
    color: "#F59E0B",
    icon: "palette"
  },
  {
    id: "research-lab",
    name: "Research Lab",
    description: "Research any topic with multiple specialized research agents.",
    mode: "Research",
    color: "#6366F1",
    icon: "microscope"
  },
  {
    id: "debate-arena",
    name: "Debate Arena",
    description: "Explore different perspectives on any topic with AI agents taking different sides.",
    mode: "Debate",
    color: "#EF4444",
    icon: "message-square"
  }
];

export function SmartStartsList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTemplates = !searchQuery.trim()
    ? SMART_STARTS
    : SMART_STARTS.filter(
        template => 
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search templates..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">No templates match your search</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <SmartStartCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
