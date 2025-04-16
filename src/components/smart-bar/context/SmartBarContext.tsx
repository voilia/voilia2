
import React, { createContext, useContext, useState } from 'react';
import type { SmartBarContextType, SmartBarMode } from '../types/smart-bar-types';

const SmartBarContext = createContext<SmartBarContextType | undefined>(undefined);

export function SmartBarProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<SmartBarMode>("chat");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enterSends, setEnterSends] = useState(true);

  return (
    <SmartBarContext.Provider 
      value={{
        message,
        setMessage,
        mode,
        setMode,
        isSubmitting,
        setIsSubmitting,
        enterSends,
        setEnterSends,
      }}
    >
      {children}
    </SmartBarContext.Provider>
  );
}

export function useSmartBar() {
  const context = useContext(SmartBarContext);
  if (context === undefined) {
    throw new Error('useSmartBar must be used within a SmartBarProvider');
  }
  return context;
}
