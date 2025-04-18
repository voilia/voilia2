
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RoomSubmissionProps {
  selectedProjectId: string | null;
  name: string;
  description: string;
  color: string;
  selectedAgentIds: string[];
}

export function useRoomSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({
    selectedProjectId,
    name,
    description,
    color,
    selectedAgentIds,
  }: RoomSubmissionProps) => {
    try {
      if (!selectedProjectId) {
        toast.error("Please select a project");
        return false;
      }
      
      if (!name.trim()) {
        toast.error("Room name is required");
        return false;
      }
      
      setIsLoading(true);
      
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert({
          project_id: selectedProjectId,
          name: name.trim(),
          description: description.trim() || null,
          color
        })
        .select('id')
        .single();
      
      if (roomError) throw roomError;
      
      if (!roomData) {
        throw new Error("Failed to create room");
      }
      
      if (selectedAgentIds.length > 0) {
        const agentInserts = selectedAgentIds.map(agentId => ({
          room_id: roomData.id,
          agent_id: agentId,
          is_visible: true,
          execution_order: 0
        }));
        
        const { error: agentsError } = await supabase
          .from('room_agents')
          .insert(agentInserts);
        
        if (agentsError) {
          console.error("Error adding agents to room:", agentsError);
        }
      }
      
      toast.success("Room created successfully!");
      navigate(`/rooms/${roomData.id}`);
      
      return true;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
}
