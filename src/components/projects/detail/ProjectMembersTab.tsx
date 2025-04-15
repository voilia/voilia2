import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, X, MoreHorizontal, UserPlus, Check, Crown } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Member {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  joined_at: string;
  user_name?: string;
  user_email?: string;
}

interface ProjectMembersTabProps {
  projectId: string;
}

export function ProjectMembersTab({ projectId }: ProjectMembersTabProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");

  const { data: members, isLoading, refetch } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_members")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      
      return data.map((member: any) => ({
        ...member,
        user_name: member.role === "owner" ? "Project Owner" : `Team Member ${member.id.substring(0, 4)}`,
        user_email: `user-${member.id.substring(0, 4)}@example.com`,
      })) as Member[];
    },
  });

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      toast.success(`Invitation sent to ${inviteEmail}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      refetch();
      
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("member");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to send invitation");
    }
  };

  if (!isLoading && (!members || members.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <UserPlus className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No team members yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Invite team members to collaborate on this project
        </p>
        <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>
    );
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
            <Card key={i} className="p-4 animate-pulse flex">
              <div className="h-10 w-10 rounded-full bg-muted mr-3" />
              <div className="flex-1">
                <div className="h-5 bg-muted w-1/3 rounded mb-2" />
                <div className="h-4 bg-muted w-1/2 rounded" />
              </div>
            </Card>
          ))
        ) : (
          sortedMembers.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              projectId={projectId}
              refetchMembers={refetch}
            />
          ))
        )}
      </div>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address*
              </label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {inviteRole === "admin" && "Can manage project settings and members"}
                {inviteRole === "member" && "Can create and edit content"}
                {inviteRole === "viewer" && "Can only view content"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MemberCardProps {
  member: Member;
  projectId: string;
  refetchMembers: () => void;
}

function MemberCard({ member, projectId, refetchMembers }: MemberCardProps) {
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [newRole, setNewRole] = useState(member.role);

  const handleRoleChange = async (roleValue: string) => {
    setNewRole(roleValue as "owner" | "admin" | "member" | "viewer");
    setIsChangingRole(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Role updated to ${roleValue}`);
      refetchMembers();
      setIsChangingRole(false);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
      setIsChangingRole(false);
    }
  };

  const handleRemoveMember = async () => {
    if (member.role === "owner") {
      toast.error("Cannot remove the project owner");
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Member removed from project");
      refetchMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" alt={member.user_name} />
          <AvatarFallback>
            {member.user_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{member.user_name}</p>
            {member.role === "owner" && (
              <Crown className="h-3.5 w-3.5 text-amber-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{member.user_email}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isChangingRole ? (
          <div className="flex items-center gap-1 animate-pulse">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Updating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Select 
              value={member.role} 
              onValueChange={handleRoleChange}
              disabled={member.role === "owner"}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            
            {member.role !== "owner" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleRemoveMember} className="text-destructive">
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
