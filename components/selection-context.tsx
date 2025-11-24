"use client";
import React, { createContext, useContext, useState } from "react";

type SelectionContextType = {
  selectedIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedIds, setSelected] = useState<string[]>([]);

  const add = (id: string) => setSelected((s) => (s.includes(id) ? s : [...s, id]));
  const remove = (id: string) => setSelected((s) => s.filter((x) => x !== id));
  const clear = () => setSelected([]);

  return (
    <SelectionContext.Provider value={{ selectedIds, add, remove, clear }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection debe usarse dentro de SelectionProvider");
  return ctx;
};