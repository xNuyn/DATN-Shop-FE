// src/services/reviewService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/review';

export interface CreateReviewPayload {
  sub_product_id: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  review: {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    status_enum: number;
    user: number;
    sub_product: number;
  };
}

/**
 * Gọi API tạo review mới.
 *
 * @param payload.sub_product_id
 * @param payload.rating
 * @param payload.comment
 * @returns Promise<ReviewResponse>
 */
export const createReview = async (
  payload: CreateReviewPayload
): Promise<ReviewResponse> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Chưa có access token. Vui lòng đăng nhập.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.post<ReviewResponse>(API_URL, payload, config);
  return response.data;
};

export interface Review {
  id: number;
  user: number;
  sub_product: number;
  rating: number;
  comment: string;
  created_at: string;
  status_enum: number;
}


export interface PaginatedReviews {
  data: Review[];
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

export const getReviews = async (
  page = 1,
  limit = 8
): Promise<PaginatedReviews> => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get<PaginatedReviews>(
    `${API_URL}`,
    {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};