import axios from 'axios';

/**
 * Axios instance with base config and response unwrapping
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: unwrap { success, data, error } shape
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body.success) {
      return body.data;
    }
    return Promise.reject(new Error(body.error || 'Unknown error'));
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export { apiClient };
