
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Users, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Room } from "@/hooks/useRooms";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Room</DropdownMenuItem>
              <DropdownMenuItem>Edit Room</DropdownMenuItem>
              <DropdownMenuItem>Archive Room</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {room.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>3 members</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Updated {formatDistanceToNow(new Date(room.updated_at), { addSuffix: true })}</span>
        </div>
        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
        </div>
      </CardFooter>
    </Card>
  );
}
