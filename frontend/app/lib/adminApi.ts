import { API_URL } from "./config";
import { clearToken, getToken } from "./auth";

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

// One helper for every admin request: adds the token, handles expired sessions,
// and turns server errors into an ApiError the UI can show.
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken() ?? ""}` },
    });
  } catch {
    throw new ApiError("Could not reach the server", 0);
  }

  if (res.status === 401) {
    clearToken();
    window.location.href = "/admin/login";
    throw new ApiError("Session expired", 401);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error ?? "Request failed", res.status, data?.fields);
  return data as T;
}

// Uploads one file (the raw bytes are the request body). Returns the new file URL.
export async function uploadFile(key: string, file: Blob): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin/files/${key}`, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream", Authorization: `Bearer ${getToken() ?? ""}` },
      body: file,
    });
  } catch {
    throw new ApiError("Could not reach the server", 0);
  }

  if (res.status === 401) {
    clearToken();
    window.location.href = "/admin/login";
    throw new ApiError("Session expired", 401);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error ?? "Upload failed", res.status);
  return data.url as string;
}