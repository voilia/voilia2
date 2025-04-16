
import { UploadedFile } from "../../types/smart-bar-types";
import { FilePreviewItem } from "./FilePreviewItem";

interface FilePreviewListProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export function FilePreviewList({ files, onRemoveFile }: FilePreviewListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-1">
      {files.map((file) => (
        <FilePreviewItem 
          key={file.id} 
          file={file} 
          onRemove={onRemoveFile}
        />
      ))}
    </div>
  );
}
