// src/context/BootIntroContext.jsx
import React, { createContext, useContext, useState } from 'react';

const BootIntroContext = createContext();

export const BootIntroProvider = ({ children }) => {
  const [showBootIntro, setShowBootIntro] = useState(false);

  return (
    <BootIntroContext.Provider value={{ showBootIntro, setShowBootIntro }}>
      {children}
    </BootIntroContext.Provider>
  );
};

export const useBootIntro = () => useContext(BootIntroContext);