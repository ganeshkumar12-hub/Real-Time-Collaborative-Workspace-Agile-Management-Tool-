import { create } from "zustand";
import { loginUser, registerUser } from "../services/authService";

const useAuthStore = create((set) => ({
  // Initialize from localStorage so state survives page refresh
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  register: async (userData) => {
    const data = await registerUser(userData);

    set({
      user: data.user,
      token: data.token,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },

  login: async (userData) => {
    const data = await loginUser(userData);

    set({
      user: data.user,
      token: data.token,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
    });
  },
}));

export default useAuthStore;