
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "./useProjectMembers";

export function useMemberRoleManagement(projectId: string, onUpdate?: () => void) {
  const [isChangingRole, setIsChangingRole] = useState(false);

  const updateMemberRole = async (memberId: string, newRole: Member['role']) => {
    if (newRole === 'owner') {
      toast.error("Cannot modify owner role");
      return;
    }

    setIsChangingRole(true);
    try {
      const { error } = await supabase
        .from('project_members')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('project_id', projectId);

      if (error) throw error;

      toast.success(`Role updated to ${newRole}`);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setIsChangingRole(false);
    }
  };

  const removeMember = async (member: Member) => {
    if (member.role === "owner") {
      toast.error("Cannot remove the project owner");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', member.id)
        .eq('project_id', projectId);

      if (error) throw error;

      toast.success("Member removed from project");
      onUpdate?.();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  return {
    isChangingRole,
    updateMemberRole,
    removeMember,
  };
}

