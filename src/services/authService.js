import { apiRequest, clearToken, setToken } from "./api";

function storeAuthPayload(payload) {
  if (payload?.token) {
    setToken(payload.token);
  }

  return payload.user;
}

export const registerUser = async (email, password, role) => {
  const payload = await apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, role })
  });

  return storeAuthPayload(payload);
};

export const loginUser = async (email, password) => {
  const payload = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  return storeAuthPayload(payload);
};

export const logoutUser = () => {
  clearToken();
};

export const getCurrentUser = async () => {
  const payload = await apiRequest("/api/auth/me");
  return payload.user;
};
