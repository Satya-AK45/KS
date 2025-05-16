import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import Button from '../../components/common/Button';
import { useProductStore } from '../../stores/productStore';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct } = useProductStore(); // Assumes `addProduct` exists in productStore

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    category: 'vegetables',
    price: 0,
    unit: 'kg',
    organic: false,
    image: '',
    farmerName: '',
    location: '',
    quantity: 0, // Added quantity field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure price is a number and quantity is a number
      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };
      console.log('Submitting product data:', productData); // Log data to verify structure
      await addProduct(productData); // Add the product to the store/database
      navigate('/marketplace'); // Navigate after success
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-input mt-1 block w-full"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            className="form-textarea mt-1 block w-full"
            required
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            className="form-select mt-1 block w-full"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="spices">Spices</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              className="form-input mt-1 block w-full"
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Unit</label>
            <input
              type="text"
              name="unit"
              className="form-input mt-1 block w-full"
              required
              value={formData.unit}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="organic"
              checked={formData.organic}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="text-sm">Organic Product</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            className="form-input mt-1 block w-full"
            required
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        {/* Image Preview Section */}
        {formData.image && (
          <div className="mt-4">
            <img src={formData.image} alt="Product Image" className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Farmer Name</label>
            <input
              type="text"
              name="farmerName"
              className="form-input mt-1 block w-full"
              required
              value={formData.farmerName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              className="form-input mt-1 block w-full"
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-input mt-1 block w-full"
            required
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
