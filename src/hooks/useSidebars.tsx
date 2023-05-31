import React, { useContext, useState, createContext } from "react";

const SidebarsContext = createContext({
  isInfoSidebarOpen: false,
  isSidebarOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleInfoSidebar: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleSidebar: () => {},
});

function useSidebars() {
  const context = useContext(SidebarsContext);
  if (!context) {
    throw new Error("useSidebars must be used within a SidebarsProvider");
  }
  return context;
}

const SidebarsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsInfoSidebarOpen(false);
    setIsSidebarOpen((curr) => !curr);
  };
  const toggleInfoSidebar = () => {
    setIsSidebarOpen(false);
    setIsInfoSidebarOpen((curr) => !curr);
  };

  return (
    <SidebarsContext.Provider
      value={{
        isInfoSidebarOpen,
        isSidebarOpen,
        toggleInfoSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarsContext.Provider>
  );
};

export { SidebarsProvider, useSidebars };
