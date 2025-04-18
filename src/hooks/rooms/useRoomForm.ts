
import { useState } from "react";
import { ProjectColor } from "@/components/projects/types";

export function useRoomForm(initialProjectId?: string) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<ProjectColor>("violet");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllAgents, setShowAllAgents] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("violet");
    setSelectedAgentIds([]);
    setCurrentStep(1);
    setSearchQuery("");
    setShowAllAgents(false);
    if (!initialProjectId) {
      setSelectedProjectId(null);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    selectedProjectId,
    setSelectedProjectId,
    selectedAgentIds,
    setSelectedAgentIds,
    searchQuery,
    setSearchQuery,
    showAllAgents,
    setShowAllAgents,
    resetForm,
  };
}
