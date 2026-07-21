import { createContext, useContext, useState, ReactNode } from "react";
import type { Couple } from "@/lib/supabase";

interface CoupleContextType {
  couple: Couple | null;
  setCouple: (couple: Couple | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

interface CoupleProviderProps {
  children: ReactNode;
  initialCouple?: Couple | null;
}

export function CoupleProvider({ children, initialCouple = null }: CoupleProviderProps) {
  const [couple, setCouple] = useState<Couple | null>(initialCouple);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CoupleContext.Provider value={{ couple, setCouple, isLoading, setIsLoading }}>
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const context = useContext(CoupleContext);
  if (context === undefined) {
    throw new Error("useCouple must be used within a CoupleProvider");
  }
  return context;
}
