import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/brand';

export interface Brand {
  id: number;
  name: string;
  description: string | null;
}

export const getBrandById = async (id: number): Promise<Brand> => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get<Brand>(`${BASE_URL}/${id}`, { headers });
  return response.data;
};