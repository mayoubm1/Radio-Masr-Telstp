import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  currentLanguage: 'en',
  setCurrentLanguage: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentLanguage,
        setCurrentLanguage,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
