
import { Button } from "@/components/ui/button";
import { Edit, Share, Settings } from "lucide-react";
import { toast } from "sonner";

interface ProjectActionButtonsProps {
  isMobile: boolean;
  onEditClick: () => void;
}

export function ProjectActionButtons({ isMobile, onEditClick }: ProjectActionButtonsProps) {
  return (
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
}
