import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

/**
 * AuthProvider component
 * @param children
 * @returns
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const updateUser = (token: string | null ) => {
    if (!token) {
      return null;
    }
    const decode = jwtDecode(token) as any;
    const userContext = {
      companyId: decode.companyId,
      departmentIds: decode.departmentIds,
      email: decode.email,
      id: decode.id,
      role: decode.role,
    };
    return userContext;
  };

  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(updateUser(localStorage.getItem("token")));
  const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosClient.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Function to set the authentication token
  const setToken = (newToken: string) => {
    setToken_(newToken);

    // Get the user information from token
    const decode = jwtDecode(newToken) as any;
    const userContext = {
      companyId: decode.companyId,
      departmentIds: decode.departmentIds,
      email: decode.email,
      id: decode.id,
      role: decode.role,
    };
    setUser(userContext as any);
  };



  useEffect(() => {
    if (token) {
      axiosClient.interceptors.request.use(
        (config) => {
          const accessToken = localStorage.getItem("token"); // get stored access token
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // set in header
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      axiosClient.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {
                  refreshToken,
                });
                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken); //set new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest); //recall Api with new token
              } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                navigate("/auth");
              }
            }
          }
          return Promise.reject(error);
        }
      );
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token, navigate, axiosClient]);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken_(null);
    setUser(null);
    navigate("/auth");
  };

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      axiosClient,
      user,
      logout,
    }),
    [token, axiosClient, user]
  );

  // Provide the authentication context to the children components
  return <AuthContext.Provider value={contextValue as AuthContextType}>{children}</AuthContext.Provider>;
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string) => void;
  axiosClient: AxiosInstance;
  user: any;
  logout: () => void;
};

export const useAuth = (): any => {
  return useContext(AuthContext);
};

export default AuthProvider;
