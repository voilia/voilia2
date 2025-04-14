
interface AuthToggleModeProps {
  isPasswordMode: boolean;
  onToggle: () => void;
}

export const AuthToggleMode = ({ isPasswordMode, onToggle }: AuthToggleModeProps) => {
  return (
    <div className="text-sm text-center">
      <button 
        type="button" 
        onClick={onToggle}
        className="text-primary hover:underline focus:outline-none transition-colors"
      >
        {isPasswordMode ? "Use magic link instead" : "Prefer using a password?"}
      </button>
    </div>
  );
};
