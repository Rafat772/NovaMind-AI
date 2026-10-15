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

  async updateProfile({ full_name, avatar_url }) {
    const response = await api.put("/auth/profile", { full_name, avatar_url });
    return response.data;
  },

  async changePassword({ current_password, new_password }) {
    const response = await api.post("/auth/change-password", {
      current_password,
      new_password,
    });
    return response.data;
  },
};


export default authService;
