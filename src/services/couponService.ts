import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getDiscountByCode = async (code: string) => {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_BASE_URL}/discount`, {
      params: { code },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data[0];
  } catch (error: any) {
    console.error("Failed to fetch discount:", error);
    throw error;
  }
};

export interface Discount {
  id: number;
  code: string;
  discount_percentage: string;
  quantity: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  status_enum: number;
}

export interface PaginatedDiscounts {
  data: Discount[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Lấy danh sách coupons (discounts), có phân trang.
 * @param page
 * @param limit
 */
export const getDiscounts = async (
  page = 1,
  limit = 8
): Promise<PaginatedDiscounts> => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_BASE_URL}/discount`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export interface DiscountCreatePayload {
  code: string;
  discount_percentage: string;
  quantity: number;
  valid_from: string; 
  valid_until: string;
  status_enum: number;
}

export const createDiscount = async (
  payload: DiscountCreatePayload
): Promise<Discount> => {
  const token = localStorage.getItem("access_token");
  const res = await axios.post<Discount>(
    `${API_BASE_URL}/discount`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteDiscount = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  await axios.delete(
    `${API_BASE_URL}/discount/${id}/soft-delete`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export interface Coupon {
  id: number;
  code: string;
  discount_percentage: string;
  quantity: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export const getCouponById = async (id: number): Promise<Coupon> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<Coupon>(`${API_BASE_URL}/discount/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateCoupon = async (id: number, payload: Partial<Coupon>): Promise<Coupon> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.patch<Coupon>(`${API_BASE_URL}/discount/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};