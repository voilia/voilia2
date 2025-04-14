
import { z } from "zod";

export const projectColors = {
  violet: "#9b87f5",
  blue: "#0EA5E9",
  emerald: "#F2FCE2",
  amber: "#FEC6A1", 
  rose: "#FFDEE2"
} as const;

export type ProjectColor = keyof typeof projectColors;

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  color: z.enum(Object.keys(projectColors) as [ProjectColor, ...ProjectColor[]]).default("violet")
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
