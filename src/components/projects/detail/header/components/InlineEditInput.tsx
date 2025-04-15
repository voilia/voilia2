
import { useState, useEffect } from "react";

interface InlineEditInputProps {
  value: string;
  onSubmit: (value: string) => void;
  className?: string;
  placeholder?: string;
  isEditing: boolean;
  onEditEnd: () => void;
}

export function InlineEditInput({
  value,
  onSubmit,
  className = "",
  placeholder = "",
  isEditing,
  onEditEnd,
}: InlineEditInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      onSubmit(inputValue);
    }
    onEditEnd();
  };

  if (!isEditing) {
    return null;
  }

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={`px-2 py-1 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      placeholder={placeholder}
      autoFocus
      onBlur={handleSubmit}
      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
    />
  );
}
