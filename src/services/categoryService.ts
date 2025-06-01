import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/category';

/**
 * Represents a category from the API.
 */
export interface Category {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  status_enum: number;
}

/**
 * Generic paginated response shape.
 */
interface PaginatedResponse {
  data: Category[];
  links: {
    next: string | null;
  };
}

/**
 * Fetches the first page of categories (no pagination).
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<{ data: Category[] }>(BASE_URL);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

/**
 * Fetches all root categories (parent=null) across paginated results.
 */
export const getRootCategories = async (): Promise<Category[]> => {
  let allCategories: Category[] = [];
  let nextUrl: string | null = `${BASE_URL}?limit=10&parent=null`;

  try {
    while (nextUrl) {
      const response:any = await axios.get<PaginatedResponse>(nextUrl);
      allCategories = allCategories.concat(response.data.data);
      nextUrl = response.data.links.next;
    }
  } catch (error) {
    console.error('Failed to fetch root categories:', error);
    throw error;
  }

  return allCategories;
};

/**
 * Fetches all subcategories for a given parent ID across paginated results.
 * @param parentId - the ID of the parent category
 */
export const getSubCategories = async (parentId: number): Promise<Category[]> => {
  let allSubCategories: Category[] = [];
  let nextUrl: string | null = `${BASE_URL}?limit=10&parent=${parentId}`;

  try {
    while (nextUrl) {
      const response:any = await axios.get<PaginatedResponse>(nextUrl);
      allSubCategories = allSubCategories.concat(response.data.data);
      nextUrl = response.data.links.next;
    }
  } catch (error) {
    console.error(`Failed to fetch subcategories for parent ID ${parentId}:`, error);
    throw error;
  }

  return allSubCategories;
};
