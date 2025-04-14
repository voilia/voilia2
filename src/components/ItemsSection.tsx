
import { cn } from "@/lib/utils";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus, Square, Zap, ShieldCheck } from "lucide-react";

interface Item {
  id: string;
  title: string;
  description?: string;
  isPinned?: boolean;
}

interface ItemsSectionProps {
  title: string;
  items: Item[];
  icon: LucideIcon;
  baseUrl: string;
  onCreateNew?: () => void;
  createButtonText?: string;
  className?: string;
}

export function ItemsSection({
  title,
  items,
  icon: Icon,
  baseUrl,
  onCreateNew,
  createButtonText,
  className,
}: ItemsSectionProps) {
  return (
    <section className={cn("space-y-6 animate-in", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass-morphism p-1.5 rounded-md flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary animate-pulse-subtle" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {onCreateNew && createButtonText && (
          <Button 
            onClick={onCreateNew}
            className="gap-2 hover-effect shadow-soft glass-morphism"
          >
            <Plus className="h-4 w-4" />
            {createButtonText}
          </Button>
        )}
      </div>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="animate-scale" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ItemCard
                title={item.title}
                description={item.description}
                icon={Icon}
                path={`${baseUrl}/${item.id}`}
                isPinned={item.isPinned}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center glass-morphism rounded-xl animate-scale">
          <div className="relative mb-6">
            <Icon className="h-16 w-16 text-muted-foreground/30" />
            <ShieldCheck className="h-8 w-8 text-primary/50 absolute bottom-0 right-0 animate-pulse-subtle" />
          </div>
          <h3 className="text-lg font-medium">{`No ${title} Found`}</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Create your first {title.toLowerCase().slice(0, -1)} to get started with your workflow
          </p>
          {onCreateNew && (
            <Button 
              onClick={onCreateNew} 
              className="mt-6 gap-2 hover-effect shadow-soft glass-morphism"
            >
              <Plus className="h-4 w-4" />
              {createButtonText || `Create ${title.slice(0, -1)}`}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
