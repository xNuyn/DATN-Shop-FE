import axios from "axios";

const API_BASE = 'http://127.0.0.1:8000/api/wishlist';

export const getWishlist = async () => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_BASE}/my-wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const softDeleteWishlistItem = async (wishlistId: number) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const url = `${API_BASE}/${wishlistId}/soft-delete`;
  const response = await axios.delete(url, { headers });
  return response.data;
};

export const addToWishlist = async (sub_product_id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const response = await axios.post(
    API_BASE,
    { sub_product_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};