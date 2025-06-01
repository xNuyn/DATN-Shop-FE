// src/services/productService.ts
import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price_min: number;
  price_max: number;
  categories: number;
  brands: number;
  sold_per_month: number;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${BASE_URL}/product/search-and`);
  return response.data;
};

export const fetchFilteredProducts = async (
  categories: string[],
  brands: string[],
  priceRange: string,
  keyword: string,
  sort_by: string,
): Promise<Product[]> => {
  const params: any = {
    categories: categories.join(","),
    brands: brands.join(","),
    price: priceRange,
    keyword: keyword,
    type_search_keyword: "contains",
    sort_by,
  };

  const response = await axios.get(`${BASE_URL}/product/search-and`, { params });
  return response.data.data;
};

export const getProductDetail = async (productId: number) => {
  const response = await axios.get(`${BASE_URL}/product/${productId}`);
  return response.data;
};
