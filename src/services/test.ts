import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/product/search-and';

export interface Product {
  id: number;
  name: string;
  description: string;
  detail_description: string;
  category: number;
  brand: number;
  material: number;
  image_url: string;
  min_price: number;
  max_price: number;
  sold_per_month: number;
}

interface PaginatedProductResponse {
  data: Product[];
  links: {
    next: string | null;
  };
}

export const getAllProducts = async (): Promise<Product[]> => {
  let allProducts: Product[] = [];
  let nextUrl: string | null = ${BASE_URL}?limit=10; // or use limit=100 if supported

  try {
    while (nextUrl) {
      const response: any = await axios.get<PaginatedProductResponse>(nextUrl);
      allProducts = allProducts.concat(response.data.data);
      nextUrl = response.data.links.next;
    }
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    throw error;
  }

  return allProducts;
};


interface SearchParams {
  brands?: number[];
  type_search_brand?: string;
  categories?: number[];
  type_search_category?: string;
  materials?: number[];
  type_search_material?: string;
  sort_by?: string;
  limit?: number;
}


export const searchProducts = async (params: SearchParams): Promise<Product[]> => {
  let allProducts: Product[] = [];
  const limit = params.limit || 10;

  const query = new URLSearchParams();

  // Append multiple values as comma-separated strings
  if (params.brands && params.brands.length > 0) {
    query.append('brands', params.brands.join(','));
  }
  if (params.type_search_brand) {
    query.append('type_search_brand', params.type_search_brand);
  }
  if (params.categories && params.categories.length > 0) {
    query.append('categories', params.categories.join(','));
  }
  if (params.type_search_category) {
    query.append('type_search_category', params.type_search_category);
  }
  if (params.materials && params.materials.length > 0) {
    query.append('materials', params.materials.join(','));
  }
  if (params.type_search_material) {
    query.append('type_search_material', params.type_search_material);
  }
  if (params.sort_by) {
    query.append('sort_by', params.sort_by);
  }

  query.append('limit', limit.toString());

  let nextUrl: string | null = ${BASE_URL}?${query.toString()};

  try {
    while (nextUrl) {
      const response: any = await axios.get<PaginatedProductResponse>(nextUrl);
      allProducts = allProducts.concat(response.data.data);
      nextUrl = response.data.links.next;
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }

  return allProducts;
};