"use server"

interface EditProfile {
    name: string;
    email: string;
}

export async function getAdminProfile(token: string): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/users/profile/",
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
export async function editAdminProfile(token: string, profile: EditProfile): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/users/update-profile/",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(profile)
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