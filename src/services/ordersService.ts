// ordersService.ts
import axios from 'axios';

export interface SubProduct {
  id: number;
  product: {
    id: number;
    name: string;
    // include other fields as necessary
  };
  color: string;
  size: string;
  price: number;
  old_price: number;
  image: string;
  stock: number;
  specification: string;
  discount_percentage: string;
  saled_per_month: number;
}

export interface OrderDetail {
  id: number;
  order: number;
  sub_product: SubProduct;
  quantity: number;
  price: string;
  status_enum: number;
}

export interface Order {
  id: number;
  user: number; // or a User object if available
  subtotal: string;
  tax: string;
  discount: string;
  shipping_cost: string;
  total_price: string;
  status: string;
  status_enum: number;
  created_at: string;
  order_details: OrderDetail[];
}

export interface OrderApiResponse {
  data: Order[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const API_URL = 'http://127.0.0.1:8000/api/order';

/**
 * Fetches a paginated list of orders.
 * @param page The page number (default: 1)
 * @param limit Number of orders per page (default: 5)
 */
export const getOrders = async (
  page: number = 1,
  limit: number = 5
): Promise<OrderApiResponse> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<OrderApiResponse>(API_URL, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};