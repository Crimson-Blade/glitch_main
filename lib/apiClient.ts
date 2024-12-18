import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Replace with your FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;