import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import StoreState from './item.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the store with persistence
const useItemStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [], // Initial state

      // Action to add an item
      addItem: (item: any) =>
        set((state) => ({
          items: [item, ...state.items],
        })),

      // Action to remove an item
      removeItem: (id: any) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'items-storage', // unique name for localStorage key
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useItemStore;