import axios from 'axios';

export interface InstamojoConfig {
  apiKey: string;
  authToken: string;
  salt: string;
  baseUrl: string;
}

export interface InstamojoPaymentRequest {
  purpose: string;
  amount: number;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  webhook_url?: string;
  send_email?: boolean;
  send_sms?: boolean;
  allow_repeated_payments?: boolean;
}

export interface InstamojoPaymentResponse {
  success: boolean;
  payment_request: {
    id: string;
    phone: string;
    email: string;
    buyer_name: string;
    amount: number;
    purpose: string;
    status: string;
    longurl: string;
    shorturl: string;
    redirect_url: string;
    webhook_url: string;
    created_at: string;
    modified_at: string;
    allow_repeated_payments: boolean;
  };
}

export interface InstamojoPaymentStatus {
  success: boolean;
  payment_request: {
    id: string;
    status: string;
    payments: Array<{
      payment_id: string;
      status: string;
      amount: number;
      buyer_name: string;
      buyer_email: string;
      buyer_phone: string;
      created_at: string;
      updated_at: string;
    }>;
  };
}

class InstamojoClient {
  private config: InstamojoConfig;

  constructor(config: InstamojoConfig) {
    this.config = config;
  }

  /**
   * Create a payment request
   */
  async createPaymentRequest(data: InstamojoPaymentRequest): Promise<InstamojoPaymentResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment-requests/`,
        {
          ...data,
          api_key: this.config.apiKey,
          auth_token: this.config.authToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Instamojo payment request creation failed:', error);
      throw new Error('Failed to create payment request');
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentRequestId: string): Promise<InstamojoPaymentStatus> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/payment-requests/${paymentRequestId}/`,
        {
          params: {
            api_key: this.config.apiKey,
            auth_token: this.config.authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Instamojo payment status check failed:', error);
      throw new Error('Failed to get payment status');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(data: string, signature: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha1', this.config.salt)
      .update(data)
      .digest('hex');
    
    return expectedSignature === signature;
  }
}

// Create and export Instamojo instance
export const createInstamojoClient = (): InstamojoClient | null => {
  const apiKey = process.env.INSTAMOJO_API_KEY;
  const authToken = process.env.INSTAMOJO_AUTH_TOKEN;
  const salt = process.env.INSTAMOJO_SALT;
  const baseUrl = process.env.INSTAMOJO_BASE_URL || 'https://test.instamojo.com/api/1.1';

  if (!apiKey || !authToken || !salt) {
    console.warn('⚠️  Instamojo credentials not configured');
    return null;
  }

  return new InstamojoClient({
    apiKey,
    authToken,
    salt,
    baseUrl,
  });
};

export const instamojo = createInstamojoClient();

// Helper function to check if Instamojo is available
export const isInstamojoAvailable = () => !!instamojo;

// Safe Instamojo operations
export const safeInstamojoOperation = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> => {
  if (!instamojo) {
    console.warn('⚠️  Instamojo not configured, skipping operation');
    return fallback || null;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Instamojo operation failed:', error);
    return fallback || null;
  }
};
