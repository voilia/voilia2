
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface CreateRoomFooterProps {
  currentStep: 1 | 2;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CreateRoomFooter({
  currentStep,
  onBack,
  onNext,
  onCancel,
  isLoading
}: CreateRoomFooterProps) {
  if (currentStep === 1) {
    return (
      <>
        <Button variant="outline" onClick={onCancel} className="px-6">
          Cancel
        </Button>
        <Button onClick={onNext} className="px-6">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <>
      <Button variant="outline" onClick={onBack} className="px-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button onClick={onNext} disabled={isLoading} className="px-6">
        {isLoading && <Loader size="sm" className="mr-2" />}
        Create Room
      </Button>
    </>
  );
}
