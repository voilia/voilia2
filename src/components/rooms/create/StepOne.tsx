
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorSwatch } from "@/components/projects/ColorSwatch";
import { ProjectColor } from "@/components/projects/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Project } from "@/components/projects/types";
import { CreateProjectInline } from "@/components/projects/CreateProjectInline";

interface StepOneProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  color: ProjectColor;
  setColor: (color: ProjectColor) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  projects: Project[];
  isLoadingProjects: boolean;
  isCreatingProject: boolean;
  setIsCreatingProject: (creating: boolean) => void;
  handleProjectCreated: (newProjectId: string) => void;
}

export function StepOne({
  name,
  setName,
  description,
  setDescription,
  color,
  setColor,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  isLoadingProjects,
  isCreatingProject,
  setIsCreatingProject,
  handleProjectCreated
}: StepOneProps) {
  return (
    <div className="space-y-5 py-4">
      {/* Project Selection */}
      <div className="space-y-2">
        <Label htmlFor="project">Project*</Label>
        {isCreatingProject ? (
          <div className="space-y-4">
            <CreateProjectInline 
              onProjectCreated={handleProjectCreated}
              onCancel={() => setIsCreatingProject(false)}
            />
          </div>
        ) : (
          <Select
            value={selectedProjectId || undefined}
            onValueChange={(value) => {
              if (value === "create-new") {
                setIsCreatingProject(true);
              } else {
                setSelectedProjectId(value);
              }
            }}
            disabled={isLoadingProjects}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="create-new">
                <div className="flex items-center text-primary gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  Create New Project
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* Room Name */}
      <div className="space-y-2">
        <Label htmlFor="room-name">Room Name*</Label>
        <Input
          id="room-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter room name"
        />
      </div>
      
      {/* Room Description */}
      <div className="space-y-2">
        <Label htmlFor="room-description">Description (optional)</Label>
        <Textarea
          id="room-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose of this room"
          rows={3}
        />
      </div>
      
      {/* Room Color */}
      <div className="space-y-2">
        <Label htmlFor="room-color">Room Color</Label>
        <ColorSwatch
          id="room-color"
          value={color}
          onChange={setColor}
        />
      </div>
    </div>
  );
}
