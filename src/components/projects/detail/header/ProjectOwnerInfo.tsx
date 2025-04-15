
import { OwnerAvatar } from "./components/OwnerAvatar";
import { ProjectMetadata } from "./components/ProjectMetadata";

interface ProjectOwnerInfoProps {
  createdAt?: string;
}

export function ProjectOwnerInfo({ createdAt }: ProjectOwnerInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <OwnerAvatar />
        <span>Owner</span>
      </div>
      <div className="hidden sm:block h-4 w-[1px] bg-border" />
      <ProjectMetadata createdAt={createdAt} />
    </div>
  );
}
