
import { UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMembersStateProps {
  onInvite: () => void;
}

export function EmptyMembersState({ onInvite }: EmptyMembersStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <UserPlus className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-medium mb-2">No team members yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Invite team members to collaborate on this project
      </p>
      <Button onClick={onInvite} className="gap-2">
        <Plus className="h-4 w-4" />
        Invite Member
      </Button>
    </div>
  );
}
