
import { ProjectActionButtons } from "./components/ProjectActionButtons";
import { ProjectActionsDropdown } from "./components/ProjectActionsDropdown";

interface ProjectActionsProps {
  isMobile: boolean;
  onEditClick: () => void;
}

export function ProjectActions({ isMobile, onEditClick }: ProjectActionsProps) {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {isMobile ? (
        <>
          <div className="flex-1 flex gap-2">
            <ProjectActionButtons isMobile={isMobile} onEditClick={onEditClick} />
          </div>
          <ProjectActionsDropdown />
        </>
      ) : (
        <div className="flex items-center gap-2">
          <ProjectActionButtons isMobile={isMobile} onEditClick={onEditClick} />
        </div>
      )}
    </div>
  );
}
