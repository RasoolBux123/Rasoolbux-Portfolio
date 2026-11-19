import { API_URL } from "./config";

const KEY = "admin-token";

// localStorage is simple and fine for learning. In production many apps use an
// httpOnly cookie instead (JavaScript cannot read it, so XSS cannot steal it).
export const getToken = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const setToken = (t: string) => {
  try { localStorage.setItem(KEY, t); } catch {}
};
export const clearToken = () => {
  try { localStorage.removeItem(KEY); } catch {}
};

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Login failed" };
    setToken(data.token);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the server" };
  }
}

// Ask the API who we are. null means: not logged in (or token expired).
export async function fetchMe(): Promise<{ id: number; email: string } | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { clearToken(); return null; }
    return await res.json();
  } catch {
    return null;
  }
}