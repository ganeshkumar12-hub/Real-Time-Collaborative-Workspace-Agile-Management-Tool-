import { create } from "zustand";
import { loginUser, registerUser } from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  register: async (userData) => {
    const data = await registerUser(userData);

    set({
      user: data.user,
      token: data.token,
    });

    localStorage.setItem("token", data.token);
  },

  login: async (userData) => {
    const data = await loginUser(userData);

    set({
      user: data.user,
      token: data.token,
    });

    localStorage.setItem("token", data.token);
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },
}));

export default useAuthStore;