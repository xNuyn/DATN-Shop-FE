import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getUserById = async (id: number) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.get(`${API_BASE_URL}/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateUserById = async (id: number, formData: FormData) => {
  const token = localStorage.getItem("access_token");
  const res = await axios.patch(`${API_BASE_URL}/user/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getUsers = async (page = 1, limit = 8) => {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      params: {
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  await axios.delete(
    `${API_BASE_URL}/user/${id}/soft-delete`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};