import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { getUserData } from '../../services/authService';
import { createOrder, loadRazorpayScript, initializeRazorpayCheckout } from '../../services/paymentService';
import Button from '../../components/common/Button';

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutForm>();
  
  const subtotal = getTotal();
  const shipping = 40;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0 && !orderComplete) {
      navigate('/customer/cart');
    }
    
    // Fill form with user data if available
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            setValue('fullName', userData.fullName || '');
            setValue('email', user.email || '');
            setValue('phone', userData.phone || '');
            
            // If user has saved address
            if (userData.address) {
              setValue('address', userData.address.line1 || '');
              setValue('city', userData.address.city || '');
              setValue('state', userData.address.state || '');
              setValue('pincode', userData.address.pincode || '');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchUserData();
  }, [user, items, navigate, setValue, orderComplete]);

  const onSubmitAddress = (data: CheckoutForm) => {
    // Save address data and move to payment step
    setStep(2);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }
      
      // Create an order
      const orderData = await createOrder({
        amount: Math.round(total * 100) / 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });
      
      setOrderId(orderData.id);
      
      // Initialize Razorpay checkout
      initializeRazorpayCheckout(
        orderData.id,
        total,
        'Customer Name', // This would come from form
        'customer@example.com', // This would come from form
        '9876543210', // This would come from form
        handlePaymentSuccess,
        handlePaymentFailure
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string, _orderId: string, signature: string) => {
    // In a real app, you'd verify this payment server-side
    console.log('Payment successful!', { paymentId, _orderId, signature });
    setPaymentLoading(false);
    setOrderComplete(true);
    clearCart();
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
    setPaymentLoading(false);
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-success-100 flex items-center justify-center rounded-full mx-auto mb-6">
              <Check className="h-8 w-8 text-success-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Completed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Order ID: {orderId || `ORD${Math.floor(Math.random() * 1000000)}`}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/customer/dashboard')}
              >
                View My Orders
              </Button>
              <Button onClick={() => navigate('/marketplace')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <MapPin className="h-4 w-4" />
          </div>
          <div className={`h-1 flex-1 mx-2 ${
            step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm font-medium text-gray-700">Shipping</span>
          <span className="text-sm font-medium text-gray-700">Payment</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Form Steps */}
        <div className="lg:w-2/3">
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit(onSubmitAddress)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={`block w-full rounded-md border ${
                        errors.fullName ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('fullName', { required: 'Full name is required' })}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-error-600">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`block w-full rounded-md border ${
                        errors.email ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`block w-full rounded-md border ${
                        errors.phone ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('phone', { required: 'Phone number is required' })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className={`block w-full rounded-md border ${
                        errors.address ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('address', { required: 'Address is required' })}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className={`block w-full rounded-md border ${
                        errors.city ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-error-600">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      className={`block w-full rounded-md border ${
                        errors.state ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('state', { required: 'State is required' })}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-error-600">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      className={`block w-full rounded-md border ${
                        errors.pincode ? 'border-error-300' : 'border-gray-300'
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                      {...register('pincode', { required: 'PIN code is required' })}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-error-600">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Payment Method</h2>
              
              <div className="border border-gray-300 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <input
                    id="razorpay"
                    name="payment-method"
                    type="radio"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                    RazorPay (Credit Card, Debit Card, UPI, etc.)
                  </label>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <p>You will be redirected to RazorPay's secure payment gateway to complete your purchase.</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700"
                  onClick={() => setStep(1)}
                >
                  Back to Shipping
                </button>
                <Button
                  onClick={handlePayment}
                  isLoading={paymentLoading}
                >
                  Complete Order
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0 w-16 h-16 mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="text-gray-900 font-medium">₹{shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900 font-medium">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-base font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;