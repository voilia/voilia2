
export type SmartBarMode = "chat" | "visual" | "assist" | "vault";

export interface SmartBarContextType {
  message: string;
  setMessage: (message: string) => void;
  mode: SmartBarMode;
  setMode: (mode: SmartBarMode) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  enterSends: boolean;
  setEnterSends: (enterSends: boolean) => void;
}
