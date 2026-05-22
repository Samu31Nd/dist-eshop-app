import { create } from "zustand";
import { loginAction, logoutAction } from "../actions/login.action";
import { checkAuthAction } from "../actions/check-auth.action";
import { registerAction } from "../actions/register.action";
import type { ProfileData } from "../interfaces/profile.dto";
import { updateProfileAction } from "../actions/updateProfile.action";
import { deleteUserAction } from "../actions/deleteUser.action";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthState = {
  user: ProfileData | null;
  token: string | null;
  authStatus: AuthStatus;

  // Igual que el original — siempre true porque Tomcat no maneja roles
  isAdmin: () => boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (profile: ProfileData, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  updateProfile: (
    data: Parameters<typeof updateProfileAction>[0],
  ) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set /*, get*/) => ({
  user: null,
  token: null,
  authStatus: "checking",

  // Tomcat no tiene roles; devolvemos true por defecto para no romper
  // las guards que dependan de isAdmin() en el resto de la app
  isAdmin: () => true,

  // ── LOGIN ──────────────────────────────────────────────────────────────
  // loginAction hace /login + /consulta_usuario y devuelve { id_usuario, token, user }
  login: async (email, password) => {
    try {
      const data = await loginAction(email, password);
      // Persistir antes de la segunda llamada para que el interceptor los tenga
      localStorage.setItem("token", data.token);
      localStorage.setItem("id_usuario", String(data.id_usuario));
      localStorage.setItem("email", email); // consulta_usuario lo necesita
      set({ user: data.user, token: data.token, authStatus: "authenticated" });
      return true;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("id_usuario");
      localStorage.removeItem("email");
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },

  // ── REGISTER ───────────────────────────────────────────────────────────
  // Solo registra; no inicia sesión. Redirigir al login después.
  register: async (profile, password) => {
    try {
      const data = await registerAction(profile, password);
      console.log(data.mensaje);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  // ── LOGOUT ─────────────────────────────────────────────────────────────
  logout: () => {
    logoutAction();
    set({ user: null, token: null, authStatus: "not-authenticated" });
  },

  // ── CHECK AUTH STATUS ──────────────────────────────────────────────────
  checkAuthStatus: async () => {
    try {
      const data = await checkAuthAction();
      set({ user: data.user, token: data.token, authStatus: "authenticated" });
      return true;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("id_usuario");
      localStorage.removeItem("email");
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },
  // Llama al action, y si sale bien actualiza user en el store global
  updateProfile: async (data) => {
    try {
      const updatedUser = await updateProfileAction(data);
      set({ user: updatedUser });
      return true;
    } catch {
      return false;
    }
  },

  deleteProfile: async () => {
    try {
      const { mensaje } = await deleteUserAction();
      console.log(mensaje);
      logoutAction(); // por si acaso — es idempotente
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return true;
    } catch {
      return false;
    }
  },
}));
