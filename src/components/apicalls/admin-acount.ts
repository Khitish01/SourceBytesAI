"use server";

interface AdminFormData {
    name: string
    tenant_id: string
    password: string
    email: string
}
export async function getAdminList(token: string): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/users/get-admins/",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || "Fetching Admin failed",
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}
export async function createAdmin(token: string, formData: AdminFormData): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/auth/register/admin-user/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(formData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || "Fetching organizations failed",
            };
        }

        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}