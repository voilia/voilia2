
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
  projectId?: string;
}

export function InviteMemberDialog({ isOpen, onClose, onInvite, projectId }: InviteMemberDialogProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would look up the user by email
      // For now, we're using a mock user ID derived from the email
      const mockUserId = `mock-${inviteEmail.replace(/[^a-z0-9]/gi, "")}`;
      
      // Use upsert method with onConflict option
      const { error } = await supabase
        .from("project_members")
        .upsert({
          project_id: projectId,
          user_id: mockUserId,
          role: inviteRole as any
        }, {
          onConflict: 'project_id,user_id',
          ignoreDuplicates: false // Update the row if it exists
        });

      if (error) {
        throw error;
      }
      
      toast.success(`Invitation sent to ${inviteEmail}`);
      onInvite();
      setInviteEmail("");
      setInviteRole("member");
      onClose();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleInviteMember} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
