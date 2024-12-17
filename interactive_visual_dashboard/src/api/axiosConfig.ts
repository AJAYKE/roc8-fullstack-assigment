import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const apiBaseURL = "http://localhost:8176";

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      try {
        const refreshToken = cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token missing. User must re-authenticate.");
        }

        const refreshResponse = await axios.post(
          `${apiBaseURL}/api/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.access_token;

        cookies.set("accessToken", newAccessToken, {
          path: "/",
          expires: new Date(Date.now() + 60 * 60 * 1000),
          secure: true,
          sameSite: "strict",
        });

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error(
          "Refresh token expired. Redirecting to login.",
          refreshError
        );

        cookies.remove("accessToken");
        cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
