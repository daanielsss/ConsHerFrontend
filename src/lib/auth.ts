import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (): { email: string } | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<{ email: string }>(token);
  } catch {
    return null;
  }
};
