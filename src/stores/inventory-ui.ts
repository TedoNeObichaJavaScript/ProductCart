import { create } from "zustand";

import type { ProductDTO } from "@/server/products";

type InventoryUIState = {
  search: string;
  dialogOpen: boolean;
  editing: ProductDTO | null;
  setSearch: (value: string) => void;
  openCreate: () => void;
  openEdit: (product: ProductDTO) => void;
  closeDialog: () => void;
};

/** Lightweight client-only UI state for the inventory screen. */
export const useInventoryUI = create<InventoryUIState>((set) => ({
  search: "",
  dialogOpen: false,
  editing: null,
  setSearch: (value) => set({ search: value }),
  openCreate: () => set({ dialogOpen: true, editing: null }),
  openEdit: (product) => set({ dialogOpen: true, editing: product }),
  closeDialog: () => set({ dialogOpen: false, editing: null }),
}));
