
import { Globe, Brain, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/components/agents/types";

interface AgentTagsProps {
  agent: Agent;
}

export function AgentTags({ agent }: AgentTagsProps) {
  const getLanguageTag = () => {
    if (agent.supported_languages?.includes("multilingual")) {
      return (
        <Badge variant="outline" className="bg-muted text-xs">
          <Globe className="w-3 h-3 mr-1" />
          Multilingual
        </Badge>
      );
    }
    return agent.supported_languages?.map(lang => (
      <Badge key={lang} variant="outline" className="bg-muted text-xs">
        <Globe className="w-3 h-3 mr-1" />
        {lang.charAt(0).toUpperCase() + lang.slice(1)}
      </Badge>
    ));
  };

  const getAgentTypeTag = () => {
    if (!agent.type) return null;
    return (
      <Badge variant="outline" className="bg-muted text-xs">
        <Brain className="w-3 h-3 mr-1" />
        {agent.type.split("_").map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ")}
      </Badge>
    );
  };

  const getToolsTag = () => {
    if (!agent.uses_tools) return null;
    return (
      <Badge variant="outline" className="bg-muted text-xs">
        <Wrench className="w-3 h-3 mr-1" />
        Uses Tools
      </Badge>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
      {getLanguageTag()}
      {getAgentTypeTag()}
      {getToolsTag()}
    </div>
  );
}
