import type { BlogResponseM } from "./../interfaces/blog-response.interface";
import type { Result } from "./../interfaces/result.interface";
import axios from "axios";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";

const authStore = useAuthStore();

export const useLoginStore = defineStore("login", {
  state: () => ({
    email: "",
    password: "",
  }),

  actions: {
    async login(): Promise<Result> {
      const { data, status } = await axios.post<BlogResponseM<string>>(
        `${import.meta.env.VITE_BACKEND}/auth/login`,
        {
          email: this.email,
          password: this.password,
        }
      );
      const { message, data: token } = data;
      authStore.token = token;
      return { status, message };
    },
  },
});
