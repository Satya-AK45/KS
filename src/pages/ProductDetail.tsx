import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, MapPin, Truck, Clock, ShieldCheck } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useCartStore } from '../stores/cartStore';
import { Product } from '../types/product';
import Button from '../components/common/Button';
import LoadingScreen from '../components/common/LoadingScreen';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, quantity);
    setAddedToCart(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/marketplace">
            <Button>
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/marketplace" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Marketplace
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="p-6">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">
                {product.location} • by {product.farmerName}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <p className="text-2xl font-bold text-primary-600 mr-3">
                ₹{product.price}/{product.unit}
              </p>
              {product.organic && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Organic
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">
              {product.description || 'Fresh, high-quality produce direct from the farm. Harvested at the peak of ripeness to ensure maximum flavor and nutritional value.'}
            </p>
            
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Availability:</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-success-600' : 'text-error-600'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <span className="text-sm text-gray-600 capitalize">{product.category}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                >
                  <span className="sr-only">Decrease</span>
                  <span className="text-gray-600">−</span>
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                  className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-0"
                />
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                >
                  <span className="sr-only">Increase</span>
                  <span className="text-gray-600">+</span>
                </button>
                
                <span className="ml-3 text-sm text-gray-500">
                  {product.stock} {product.unit}s available
                </span>
              </div>
            </div>
            
            <Button
              className="w-full mb-4"
              icon={addedToCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              variant={addedToCart ? 'success' : 'primary'}
            >
              {addedToCart ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fast Delivery</span> - Delivered straight from the farm within 24-48 hours
                </p>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Freshness Guarantee</span> - Harvested within 24 hours of delivery
                </p>
              </div>
              
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Quality Assurance</span> - 100% satisfaction or full refund
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;