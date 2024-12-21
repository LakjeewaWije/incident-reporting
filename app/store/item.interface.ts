export default interface StoreState {
    items: Array<any>;
    addItem: (item: any) => void;
    removeItem: (id: any) => void;
  }