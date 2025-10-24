// src/context/SidebarContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the Sidebar Context
const SidebarContext = createContext();

// Sidebar Context Provider
export const SidebarProvider = ({ children }) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarHovered, setIsSidebarHovered }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the Sidebar Context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};