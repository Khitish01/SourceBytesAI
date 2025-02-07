export async function getUserRole() {
  try {
    const res = await fetch("/api/auth/me"); // Replace with actual API endpoint
    if (!res.ok) return null;
    const data = await res.json();
    return data.role; // Expected response: { role: "super_admin" | "admin" }
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}
