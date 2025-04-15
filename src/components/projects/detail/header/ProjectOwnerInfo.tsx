
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectOwnerInfoProps {
  createdAt?: string;
}

export function ProjectOwnerInfo({ createdAt }: ProjectOwnerInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span>Owner</span>
      </div>
      <div className="hidden sm:block h-4 w-[1px] bg-border" />
      <div>
        Created {createdAt ? format(new Date(createdAt), "MMM d, yyyy") : ""}
      </div>
    </div>
  );
}
