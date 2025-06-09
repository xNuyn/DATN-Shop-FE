// src/services/compareService.ts
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";

export const getMyCompareProducts = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found');

  const response = await axios.get(`${BASE_URL}/compare-product/my-compareproduct`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const softDeleteCompareProduct = async (id: number) => {
  const token = localStorage.getItem('access_token');
  return await axios.delete(`${BASE_URL}/compare-product/${id}/soft-delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addToCompare = async (sub_product_id: number) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.post(
    `${BASE_URL}/compare-product`,
    { sub_product_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}