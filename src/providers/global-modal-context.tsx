import { createContext, useContext, useState } from "react";

export type ActiveGlobalModal = "tag-form" | null;

interface GlobalModalContextType {
  activeGlobalModal: ActiveGlobalModal;
  setActiveGlobalModal: (modal: ActiveGlobalModal) => void;
  closeGlobalModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export function GlobalModalProvider({ children }: { children: React.ReactNode }) {
  const [activeGlobalModal, setActiveGlobalModal] = useState<ActiveGlobalModal>(null);

  function closeGlobalModal() {
    setActiveGlobalModal(null);
  }

  return (
    <GlobalModalContext.Provider
      value={{ activeGlobalModal, setActiveGlobalModal, closeGlobalModal }}>
      {children}
    </GlobalModalContext.Provider>
  );
}

export function useGlobalModal() {
  const context = useContext(GlobalModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
