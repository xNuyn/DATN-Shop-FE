import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  status_enum: number;
}

export interface PaymentRequest {
  order_id: number;
  payment_method_id: number;
}

export const createPayment = async (paymentData: PaymentRequest) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.post(`${BASE_URL}/payment`, paymentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/paymentMethod`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
