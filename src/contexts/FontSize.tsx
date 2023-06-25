import React, { createContext, useState, useContext, useEffect } from 'react';

// Context
const FontSizeContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>] | undefined>(undefined);


// Provider
export const FontSizeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16); // Initial font size

  return (
    <FontSizeContext.Provider value={[fontSize, setFontSize]}>
      {children}
    </FontSizeContext.Provider>
  );
};

// Hook
export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
