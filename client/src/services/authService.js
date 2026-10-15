import api from "./api";

export const authService = {
  async register({ full_name, email, password }) {
    const response = await api.post("/auth/register", {
      full_name,
      email,
      password,
    });
    return response.data;
  },

  async login({ email, password }) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async googleAuth(credential) {
    const response = await api.post("/auth/google", { credential });
    return response.data;
  },
};


export default authService;
