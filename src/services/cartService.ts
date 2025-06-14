import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/cart';

export const getMyCart = async () => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await axios.get(`${API_BASE}/my-cart`, {
    headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return [];
  }

  // if ("data" in response ){
  //   return response.data;
  // }
  // else return [];
};

export const updateCartItem = async (id: number, quantity: number) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.patch(`${API_BASE}/${id}`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const softDeleteCartItem = async (id: number) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.delete(`${API_BASE}/${id}/soft-delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addToCart = async (sub_product_id: number, quantity: number) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = {
    sub_product_id,
    quantity,
  };

  const response = await axios.post(API_BASE, body, { headers });
  return response.data;
};