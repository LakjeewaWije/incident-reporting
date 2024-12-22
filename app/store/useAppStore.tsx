import { create } from 'zustand';
import AppStoreState from './app.interface';



// Create the store
const useAppStore = create<AppStoreState>((set, get) => ({
  location: null, // Initial state

   // Action to add a location
   addLocation: (newLocation) =>
    set({
      location: newLocation,
    }),
}));

export default useAppStore;
