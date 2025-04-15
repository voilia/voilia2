
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { EmptyMembersState } from "./members/EmptyMembersState";
import { MemberCard } from "./members/MemberCard";
import { InviteMemberDialog } from "./members/InviteMemberDialog";

interface ProjectMembersTabProps {
  projectId: string;
}

export function ProjectMembersTab({ projectId }: ProjectMembersTabProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { members, isLoading, refetch } = useProjectMembers(projectId);

  if (!isLoading && (!members || members.length === 0)) {
    return <EmptyMembersState onInvite={() => setIsInviteDialogOpen(true)} />;
  }

  const sortedMembers = [...(members || [])].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, member: 2, viewer: 3 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          Project Members {members?.length ? `(${members.length})` : ""}
        </h2>
        <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-[76px] bg-muted rounded-lg" />
            </div>
          ))
        ) : (
          sortedMembers.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              projectId={projectId}
              onUpdate={refetch}
            />
          ))
        )}
      </div>

      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onInvite={refetch}
      />
    </div>
  );
}
