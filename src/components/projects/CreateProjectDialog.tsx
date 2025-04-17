
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { ColorSwatch } from "./ColorSwatch";
import { useCreateProject } from "@/hooks/useCreateProject";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface CreateProjectDialogProps {
  variant?: "icon" | "default";
  className?: string;
}

export function CreateProjectDialog({ variant = "default", className }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { form, isSubmitting, onSubmit } = useCreateProject(() => setOpen(false));
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && open && form.getValues('name')) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [form, onSubmit, open]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleOpenChange = (newOpenState: boolean) => {
    if (newOpenState && !user) {
      // Redirect to auth page if trying to open dialog while not logged in
      navigate('/auth');
      return;
    }
    setOpen(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className={className}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create Project</span>
          </Button>
        ) : (
          <Button className={className}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto dark:bg-[#342a52] transition-transform ease-in-out">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new project in your workspace. 
            Provide a name, optional description, and choose a color to help you identify it easily.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="project-name" className="text-base sm:text-sm">Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="project-name"
                      name="project-name"
                      autoComplete="off"
                      placeholder="My Awesome Project"
                      className="px-4 py-2 rounded-md text-base sm:text-sm dark:bg-muted/950 dark:border-white/10"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="project-description" className="text-base sm:text-sm">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="project-description"
                      name="project-description"
                      autoComplete="off"
                      placeholder="Describe your project..."
                      className="min-h-[100px] px-4 py-2 rounded-md resize-y text-base sm:text-sm dark:bg-muted/950 dark:border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel htmlFor="project-color-violet" className="text-base sm:text-sm">Project Color</FormLabel>
                  <FormControl>
                    <ColorSwatch 
                      id="project-color"
                      name="project-color"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full py-2.5 rounded-lg text-base sm:text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
