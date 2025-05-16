import axios from 'axios';

// RazorPay integration service
// In a real application, you would need to have a server-side component
// to securely handle payment processing

interface OrderOptions {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

// Create a new order for payment
export const createOrder = async (options: OrderOptions): Promise<PaymentResponse> => {
  // In a real app, this would call your backend API
  // For this demo, we'll return mock data
  const mockOrderId = `order_${Date.now()}`;
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: mockOrderId,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created'
      });
    }, 500);
  });
};

// Verify a payment
export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  // In a real app, this would verify with your backend
  // For this demo, we'll simulate success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// Load the RazorPay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize the RazorPay checkout
export const initializeRazorpayCheckout = (
  orderId: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  onSuccess: (paymentId: string, orderId: string, signature: string) => void,
  onFailure: (error: any) => void
) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere',
    amount: amount * 100, // Amount in smallest currency unit (e.g., paise for INR)
    currency: 'INR',
    name: 'KisanSetu',
    description: 'Purchase of agricultural products',
    order_id: orderId,
    handler: function (response: any) {
      onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone
    },
    theme: {
      color: '#388E3C'
    },
    modal: {
      ondismiss: function () {
        onFailure('Payment cancelled by user');
      }
    }
  };

  // @ts-ignore - RazorPay is loaded via external script
  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};