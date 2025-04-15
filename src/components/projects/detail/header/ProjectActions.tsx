
import { Button } from "@/components/ui/button";
import { Edit, Share, Settings, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectActionsProps {
  isMobile: boolean;
  onEditClick: () => void;
}

export function ProjectActions({ isMobile, onEditClick }: ProjectActionsProps) {
  const actions = (
    <>
      <Button size="sm" variant="outline" className="gap-1" onClick={onEditClick}>
        <Edit className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Edit</span>
      </Button>
      <Button size="sm" variant="outline" className="gap-1">
        <Share className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Share</span>
      </Button>
      {!isMobile && (
        <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Settings coming soon")}>
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      )}
    </>
  );

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {isMobile ? (
        <>
          <div className="flex-1 flex gap-2">{actions}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Settings coming soon")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
