import { isInstamojoAvailable } from "@/lib/instamojo";

export interface PaymentMethod {
  id: 'instamojo';
  name: string;
  description: string;
  available: boolean;
}

/**
 * Get available payment methods
 */
export const getAvailablePaymentMethods = (): PaymentMethod[] => {
  return [
    {
      id: 'instamojo',
      name: 'Digital Payments',
      description: 'UPI, Net Banking, Wallets via Instamojo',
      available: isInstamojoAvailable(),
    },
  ];
};

/**
 * Get default payment method
 */
export const getDefaultPaymentMethod = (): 'instamojo' => {
  return 'instamojo';
};

/**
 * Validate payment method availability
 */
export const validatePaymentMethod = (method: 'instamojo'): boolean => {
  return method === 'instamojo' && isInstamojoAvailable();
};

/**
 * Get payment method display info
 */
export const getPaymentMethodInfo = (method: 'instamojo') => {
  const methods = getAvailablePaymentMethods();
  return methods.find(m => m.id === method);
};
