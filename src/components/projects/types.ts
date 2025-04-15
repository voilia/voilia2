
import { z } from "zod";

export const projectColors = {
  violet: "#9b87f5",
  indigo: "#6366f1",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  pink: "#ec4899",
} as const;

export type ProjectColor = keyof typeof projectColors;

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(50, "Project name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  color: z.enum(Object.keys(projectColors) as [ProjectColor, ...ProjectColor[]]),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string | null; // Made nullable to match database structure
  owner_id: string;
  created_at: string;
  updated_at: string;
  is_personal: boolean;
  is_deleted: boolean;
};

export type ViewMode = "grid" | "list";
export type SortOption = "updated_at" | "name" | "created_at";
