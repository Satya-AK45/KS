export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  stock: number;
  farmerId: string;
  farmerName: string;
  location: string;
  createdAt: Date;
  organic: boolean;
  featured?: boolean;
}