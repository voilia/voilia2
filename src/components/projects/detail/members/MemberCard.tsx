
import { Crown, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Member } from "@/hooks/useProjectMembers";
import { useMemberRoleManagement } from "@/hooks/useMemberRoleManagement";

interface MemberCardProps {
  member: Member;
  projectId: string;
  onUpdate: () => void;
}

export function MemberCard({ member, projectId, onUpdate }: MemberCardProps) {
  const { isChangingRole, updateMemberRole, removeMember } = useMemberRoleManagement(projectId, onUpdate);

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
            <span className="text-sm">Updating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Select 
              value={member.role} 
              onValueChange={(value) => updateMemberRole(member.id, value as Member['role'])}
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
                  <DropdownMenuItem onClick={() => removeMember(member)} className="text-destructive">
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

