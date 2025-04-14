
import { cn } from "@/lib/utils";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";

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
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {onCreateNew && createButtonText && (
          <Button 
            onClick={onCreateNew}
            className="gap-2 hover-effect min-w-[140px] justify-center"
          >
            <Plus className="h-4 w-4" />
            {createButtonText}
          </Button>
        )}
      </div>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={Icon}
              path={`${baseUrl}/${item.id}`}
              isPinned={item.isPinned}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No {title} Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first {title.toLowerCase().slice(0, -1)} to get started
          </p>
          {onCreateNew && (
            <Button 
              onClick={onCreateNew} 
              className="mt-4 gap-2 hover-effect min-w-[140px] justify-center"
            >
              <Plus className="h-4 w-4" />
              {createButtonText}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
