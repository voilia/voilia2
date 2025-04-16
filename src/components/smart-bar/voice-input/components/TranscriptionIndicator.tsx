
export function TranscriptionIndicator() {
  return (
    <div className="py-2 flex items-center justify-center space-x-2">
      <div className="animate-pulse flex items-center">
        <div className="h-2 w-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
      </div>
      <span className="text-sm font-medium">Transcribing audio...</span>
    </div>
  );
}
