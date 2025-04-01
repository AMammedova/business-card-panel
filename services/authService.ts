import apiClient from "@/lib/apiClient";

export const loginUser = async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post("/auth/login", credentials);
    console.log("Login response:", response.data, response.status);
    
    if (response.status === 200) {
      const token = response.data.data;
      console.log("Token:", token);
      
      if (token) {
        // Set cookie with proper attributes
        document.cookie = `auth-token=${token}; Path=/; Secure; SameSite=Strict; Max-Age=86400`;
      }
    }
  
    return response.data;
  };
  
