import axios, { AxiosResponse } from 'axios';

const ORDER_URL = 'http://127.0.0.1:8000/api/order';
const ORDER_DETAIL_URL = 'http://127.0.0.1:8000/api/order-detail';

export interface OrderRequest {
  subtotal: number;
  tax: number;
  discount: number;
  shipping_cost: number;
  total_price: number;
}

export interface OrderDetailRequest {
  order_id: number;
  sub_product_id: number;
  quantity: number;
  price: number;
}

export const createOrder = async (orderData: OrderRequest) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.post(ORDER_URL, orderData, {
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

export const createOrderDetail = async (detailData: OrderDetailRequest) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.post(ORDER_DETAIL_URL, detailData, {
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

export const getMyOrders = async (page = 1, limit = 10) => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.get(`${ORDER_URL}/my-orders?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getOrderById = async (orderId: number) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${ORDER_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface OrderDetail {
  id: number;
  order: number;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  subtotal: string;
  tax: string;
  discount: string;
  shipping_cost: string;
  total_price: string;
  status: string;
  created_at: string;
  order_details?: OrderDetail[];
}

export interface PaginatedOrders {
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    // ...links nếu bạn muốn dùng
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export const getOrdersByUser = async (
  userId: number,
  page = 1,
  limit = 5
): Promise<PaginatedOrders> => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${ORDER_URL}`, {
    params: { user: userId, page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export interface OrderResponse {
  id: number;
  subtotal: string;
  total_price: string;
  tax: string;
  discount: string;
  shipping_cost: string;
  status: string;
  created_at: string;
  status_enum: number;
  user: number;
}

export const updateOrderStatus = async (
  orderId: number,
  newStatus: string
): Promise<OrderResponse> => {
  const token = localStorage.getItem('access_token');
  const res: AxiosResponse<OrderResponse> = await axios.patch(
    `${ORDER_URL}/${orderId}`,
    { status: newStatus },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};