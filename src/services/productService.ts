import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Product } from '../types/product';

// Helper: Convert Firestore document to Product
const convertDocToProduct = (docSnap: any): Product => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp).toDate(),
    price: Number(data.price)
  } as Product;
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(convertDocToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get products by farmer ID
export const getFarmerProducts = async (farmerId: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), where('farmerId', '==', farmerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertDocToProduct);
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) return null;
    return convertDocToProduct(productDoc);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (
  product: Omit<Product, 'id' | 'createdAt'>,
  options?: { imageFile?: File; imageUrl?: string }
): Promise<string> => {
  try {
    let imageUrl = '';

    if (options?.imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${options.imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, options.imageFile);
      imageUrl = await getDownloadURL(uploadResult.ref);
    } else if (options?.imageUrl) {
      imageUrl = options.imageUrl;
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      image: imageUrl,
      createdAt: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  productId: string,
  updates: Partial<Product>,
  options?: { imageFile?: File; imageUrl?: string }
): Promise<void> => {
  try {
    let updateData = { ...updates };

    if (options?.imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${options.imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, options.imageFile);
      updateData.image = await getDownloadURL(uploadResult.ref);
    } else if (options?.imageUrl) {
      updateData.image = options.imageUrl;
    }

    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertDocToProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};
