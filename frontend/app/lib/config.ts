//export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";


// Uploaded files (CV, photo, project images) live on the backend and come as "/api/files/...".
// Files that ship with the site (like /pic.jpg) are served by the frontend itself.
export const assetUrl = (path: string) => (path.startsWith("/api/") ? `${API_URL}${path}` : path);