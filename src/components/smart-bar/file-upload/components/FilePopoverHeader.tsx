
interface FilePopoverHeaderProps {
  fileCount: number;
  onClearAll: () => void;
}

export function FilePopoverHeader({ fileCount, onClearAll }: FilePopoverHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-foreground">
        {fileCount} {fileCount === 1 ? 'file' : 'files'} attached
      </h3>
      <button 
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
