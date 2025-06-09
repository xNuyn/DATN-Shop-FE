import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/subproduct';

export interface Review {
  user_name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SubProduct {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    category: number;
    brand: number;
    image: string;
    created_at: string;
    price_min: number;
    price_max: number;
    sold_per_month: number;
    discount_percentage_max: number;
  };
  old_price: number;
  price: number;
  color: string;
  size: string;
  stock: number;
  image: string;
  specification: string;
  discount_percentage: string;
  saled_per_month: number;
  reviews: Review[];
}

export interface SubProductTopLists {
  topDiscounts: SubProduct[];
  topSales: SubProduct[];
  top_rated: SubProduct[];
  topNew: SubProduct[];
}

export const fetchTopSubProducts = async (): Promise<SubProductTopLists> => {
  try {
    const res = await axios.get<SubProduct[]>(API_URL);
    const subProducts = res.data;

    const topDiscounts = [...subProducts]
      .filter(p => p.discount_percentage !== null)
      .sort((a, b) => parseFloat(b.discount_percentage) - parseFloat(a.discount_percentage))
      .slice(0, 3);

    const topSales = [...subProducts]
      .sort((a, b) => Number(b.saled_per_month) - Number(a.saled_per_month))
      .slice(0, 3);

    const topNew = [...subProducts]
      .sort(
        (a, b) =>
          new Date(b.product.created_at).getTime() - new Date(a.product.created_at).getTime()
      )
      .slice(0, 3);

    const top_rated = [...subProducts].slice(0, 3);

    return {
      topDiscounts,
      topSales,
      top_rated,
      topNew,
    };
  } catch (error) {
    console.error('Error fetching subproducts:', error);
    throw error;
  }
};

export const getSubproducts = async (): Promise<SubProduct[]> => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get<SubProduct[]>(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSubproductById = async (id: number): Promise<SubProduct> => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get<SubProduct>(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteSubProduct = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  await axios.delete(
    `${API_URL}/${id}/soft-delete`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateSubProductById = async (
  id: number,
  payload: Record<string, any>
) => {
  const token = localStorage.getItem('access_token');
  const res = await axios.patch(
    `${API_URL}/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
  return res.data;
};