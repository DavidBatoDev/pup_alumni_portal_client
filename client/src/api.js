import axios from "axios";
import { store } from "./store/store.js";
import { logout } from "./store/UserSlice.js";


// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`, // Replace with your API URL
  timeout: 10000, // Optional: Add a timeout for requests
});

// Function to get the access token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  return token && token.trim() ? token : null; // Ensure token is not empty
};

// Function to save the new access token
const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Request Interceptor: Attach the JWT token to every request
// Request Interceptor: Attach the JWT token only if requiresAuth is true
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Attach the Authorization header only if requiresAuth is true (default: true)
    if (config.headers?.requiresAuth !== false && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Remove the requiresAuth flag before sending the request
    delete config.headers.requiresAuth;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response Interceptor: Handle token expiration and refreshing
api.interceptors.response.use(
  (response) => {
    // If the response is successful, return it directly
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("error", error.response);

    // Check if the error is due to token expiration
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Token has expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint
        const refreshTokenResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/refresh-token`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        // Save the new token
        const newToken = refreshTokenResponse.data.token;
        saveToken(newToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, log the user out
        console.error(
          refreshError.response?.data?.message || "Failed to refresh token"
        );
        store.dispatch(logout());
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // If the error is not 401 or the retry fails, reject the error
    return Promise.reject(error);
  }
);


export default api;
