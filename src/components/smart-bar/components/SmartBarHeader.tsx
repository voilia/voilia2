
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface SmartBarHeaderProps {
  isLoading: boolean;
  room?: {
    name?: string;
    project_id?: string;
    projects?: {
      name: string;
      color: string;
    };
  };
  onBackClick: () => void;
}

export function SmartBarHeader({ isLoading, room, onBackClick }: SmartBarHeaderProps) {
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
            <h1 className="text-base md:text-lg font-semibold truncate">{room?.name}</h1>
            {room?.projects && (
              <Link to={`/projects/${room.project_id}`} className="flex-shrink-0">
                <Badge variant="outline" className="text-xs hover:bg-background/80 cursor-pointer" style={{ 
                  backgroundColor: room.projects.color + "20", 
                  borderColor: room.projects.color 
                }}>
                  {room.projects.name}
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
