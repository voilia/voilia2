
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, MoreHorizontal, Scale, Share, Rocket, Palette, Microscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface SmartStartTemplate {
  id: string;
  name: string;
  description: string;
  mode: string;
  color: string;
  icon: string;
}

interface SmartStartCardProps {
  template: SmartStartTemplate;
}

export function SmartStartCard({ template }: SmartStartCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getIcon = () => {
    switch (template.icon) {
      case "scale": return <Scale className="h-5 w-5" />;
      case "share": return <Share className="h-5 w-5" />;
      case "rocket": return <Rocket className="h-5 w-5" />;
      case "palette": return <Palette className="h-5 w-5" />;
      case "microscope": return <Microscope className="h-5 w-5" />;
      case "message-square": 
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };
  
  const handleUseTemplate = () => {
    toast.info("This feature is coming soon!");
  };

  return (
    <Card 
      className={cn(
        "modern-card hover:shadow-md transition-all duration-300 group relative",
        "transform hover:-translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div 
              className="rounded-full p-2 flex-shrink-0"
              style={{ 
                backgroundColor: `${template.color}20`, // 20 = 12% opacity
                color: template.color 
              }}
            >
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge 
                variant="outline" 
                className="mt-1"
                style={{ 
                  color: template.color,
                  borderColor: `${template.color}40` // 40 = 25% opacity
                }}
              >
                {template.mode}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking dropdown
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Coming soon!")}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Coming soon!")}>
                Share Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px] mt-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>3 AI agents</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button 
          size="sm" 
          onClick={handleUseTemplate}
          className={cn(
            "transition-all duration-300",
            isHovered ? "bg-primary" : "bg-primary/80"
          )}
        >
          Use Template
        </Button>
      </CardFooter>
      
      {/* Decorative colored corner indicator */}
      <div 
        className="absolute bottom-3 right-3 h-2 w-2 rounded-full"
        style={{ backgroundColor: template.color }}
      />
    </Card>
  );
}
