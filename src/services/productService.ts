import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price_min: number;
  price_max: number;
  category: number;
  brands: number;
  sold_per_month: number;
  discount_percentage_max: number | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ProductListLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ProductListMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ProductListResponse {
  data: Product[];
  links: ProductListLinks;
  meta: ProductListMeta;
}

// Kết cấu của response khi phân trang
export interface PaginatedResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${BASE_URL}/product/search-and`);
  return response.data.data; // nếu chỉ lấy data mặc định
};

// Bổ sung page và limit, và trả về cả data + meta
export const fetchFilteredProducts = async (
  categories: string[],
  brands: string[],
  priceRange: string,
  keyword: string,
  sort_by: string,
  page: number,
  limit: number
): Promise<PaginatedResponse> => {
  const params: any = {
    categories: categories.join(","),
    brands: brands.join(","),
    price: priceRange,
    keyword: keyword,
    type_search_keyword: "contains",
    sort_by,
    page,
    limit,
  };

  const response = await axios.get(`${BASE_URL}/product/search-and`, { params });
  return response.data as PaginatedResponse;
};

export const getProductDetail = async (productId: number) => {
  const response = await axios.get(`${BASE_URL}/product/${productId}`);
  return response.data;
};

export const updateProductById = async (id: number, formData: FormData) => {
  const token = localStorage.getItem("access_token");
  const res = await axios.patch(`${BASE_URL}/product/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchProductList = async (
  page: number = 1,
  limit: number = 8
): Promise<ProductListResponse> => {
  const response = await axios.get(`${BASE_URL}/product`, {
    params: { page, limit },
  });
  return response.data as ProductListResponse;
};