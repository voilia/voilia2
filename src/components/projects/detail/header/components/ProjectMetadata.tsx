
import { format } from "date-fns";

interface ProjectMetadataProps {
  createdAt?: string;
}

export function ProjectMetadata({ createdAt }: ProjectMetadataProps) {
  return (
    <div>
      Created {createdAt ? format(new Date(createdAt), "MMM d, yyyy") : ""}
    </div>
  );
}
