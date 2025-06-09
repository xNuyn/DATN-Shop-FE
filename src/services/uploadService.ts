import axios from 'axios';

const UPLOAD_URL = 'http://127.0.0.1:8000/api/upload/';

export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('image', file);
  const res = await axios.post<{ image_url: string }>(UPLOAD_URL, form);
  return res.data.image_url;
};