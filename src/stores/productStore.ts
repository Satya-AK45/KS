import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  addProduct as addProductService, // ✅ Rename to avoid shadowing
  getProducts,
  getFarmerProducts,
} from '../services/productService';

interface Product {
  id: string;
  name: string;
  price: number | string;
  quantity: number; // ✅ Added quantity
  description?: string;
  category?: string;
  unit?: string;
  image?: string;
  location?: string;
  organic?: boolean;
  farmerName?: string;
}

interface ProductState {
  products: Product[];
  farmerProducts: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchFarmerProducts: (farmerId: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  farmerProducts: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await getProducts();
      set({ products, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false,
      });
    }
  },

  fetchFarmerProducts: async (farmerId: string) => {
    set({ loading: true, error: null });
    try {
      const products = await getFarmerProducts(farmerId);
      set({ farmerProducts: products, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch farmer products',
        loading: false,
      });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const newProduct: Product = {
        ...product,
        id: uuidv4(),
      };

      console.log('New product being sent to service:', newProduct);

      await addProductService(newProduct); // ✅ Uses correct service function

      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add product',
        loading: false,
      });
    }
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
