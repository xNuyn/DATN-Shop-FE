import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

export const login = async ({usernameOrEmail, password}: {usernameOrEmail: string; password: string}) => {
  const response = await axios.post(`${API_URL}/login`, {
    usernameOrEmail,
    password,
  });
  return response.data;
};

export const register = async ({
  username,
  email,
  password,
  full_name,
}: {
  username: string;
  email: string;
  password: string;
  full_name: string;
}) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
    full_name,
  });
  return response.data;
};

export const logout = async (refresh_token: string) => {
  const response = await axios.post(`${API_URL}/logout`, {
    refresh_token,
  });
  return response.data;
};