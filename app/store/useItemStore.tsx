import { create } from 'zustand';
import StoreState from './item.interface';



// Create the store
const useItemStore = create<StoreState>((set, get) => ({
  items: [], // Initial state

  // Action to add an item
  addItem: (item: any) =>
    set((state) => ({
      items: [item,...state.items],
    })),

  // Action to remove an item
  removeItem: (id: any) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

export default useItemStore;
