import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/category';

export interface Category {
  id: number;
  name: string;
  parent: number | null;
}

// Lấy tất cả danh mục
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

// Lấy các danh mục gốc (parent === null)
export const getRootCategories = async (): Promise<Category[]> => {
  try {
    const categories = await getCategories();
    return categories.filter(category => category.parent === null);
  } catch (error) {
    console.error('Failed to fetch root categories:', error);
    return [];
  }
};

// Lấy các danh mục con theo ID cha
export const getSubCategories = async (parentId: number): Promise<Category[]> => {
  try {
    const categories = await getCategories();
    return categories.filter(category => category.parent === parentId);
  } catch (error) {
    console.error(`Failed to fetch subcategories for parent ID ${parentId}:`, error);
    return [];
  }
};

export const getCategory = async (
  parent: number | null | undefined = undefined
): Promise<Category[]> => {
  const token = localStorage.getItem("access_token");
  const params: Record<string, any> = {};
  if (parent !== undefined) {
    // nếu parent === null thì truyền parent=null
    params.parent = parent;
  }
  const res = await axios.get<Category[]>(`${BASE_URL}`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get<Category>(`${BASE_URL}/${id}`, { headers });
  return response.data;
};

export const createCategory = async (
  data: { parent: number | null; name: string }
): Promise<Category> => {
  const token = localStorage.getItem('access_token');
  const resp = await axios.post<{ category: Category }>(
    BASE_URL,
    { parent: data.parent, name: data.name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // API trả về { category: { … } }
  return resp.data.category;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  await axios.delete(
    `${BASE_URL}/${id}/soft-delete`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};