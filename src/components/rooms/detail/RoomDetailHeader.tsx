
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface RoomDetailHeaderProps {
  isLoading: boolean;
  roomName?: string;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  onBackClick: () => void;
}

export function RoomDetailHeader({
  isLoading,
  roomName,
  projectId,
  projectName,
  projectColor,
  onBackClick
}: RoomDetailHeaderProps) {
  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-10 w-full px-3 py-2 md:p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex-shrink-0"
          onClick={onBackClick}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {isLoading ? (
          <Skeleton className="h-6 w-36 md:w-48" />
        ) : (
          <>
            <h1 className="text-base md:text-lg font-semibold truncate">{roomName}</h1>
            {projectId && projectName && (
              <Link to={`/projects/${projectId}`} className="flex-shrink-0">
                <Badge 
                  variant="outline" 
                  className="text-xs hover:bg-background/80 cursor-pointer" 
                  style={{ 
                    backgroundColor: projectColor + "20", 
                    borderColor: projectColor 
                  }}
                >
                  {projectName}
                </Badge>
              </Link>
            )}
          </>
        )}
      </div>
      <Button size="icon" variant="ghost" className="flex-shrink-0">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
