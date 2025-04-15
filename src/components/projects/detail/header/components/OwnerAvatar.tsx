
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OwnerAvatarProps {
  imageUrl?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function OwnerAvatar({ imageUrl = "/placeholder.svg", fallback = "U", size = "md" }: OwnerAvatarProps) {
  return (
    <Avatar className={sizeMap[size]}>
      <AvatarImage src={imageUrl} alt="User" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
