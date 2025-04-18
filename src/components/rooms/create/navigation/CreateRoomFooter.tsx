
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface CreateRoomFooterProps {
  currentStep: 1 | 2;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  isLoading: boolean;
  nextDisabled?: boolean;
}

export function CreateRoomFooter({
  currentStep,
  onBack,
  onNext,
  onCancel,
  isLoading,
  nextDisabled = false
}: CreateRoomFooterProps) {
  return (
    <div className="flex justify-between w-full">
      <div>
        {currentStep === 2 ? (
          <Button variant="ghost" onClick={onBack} size="lg">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={onCancel} size="lg">
            Cancel
          </Button>
        )}
      </div>
      <Button 
        onClick={onNext} 
        size="lg"
        disabled={isLoading || nextDisabled}
      >
        {isLoading && <Loader size="sm" className="mr-2" />}
        {currentStep === 1 ? 'Next' : 'Create Room'}
      </Button>
    </div>
  );
}
