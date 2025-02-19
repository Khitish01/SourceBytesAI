"use server"

export async function getFileList(token: string, tenant_id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/tenants/${tenant_id}/files/`,
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

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}


export async function uploadFile(token: string, formData: FormData, tenant_id: string): Promise<any> {


    if (!token) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/tenants/${tenant_id}/upload-file/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Token ${token}`
                },
                body: formData,
            },
        );


        if (!response.ok) {
            const errorText = await response.text();
            console.error("Image upload failed:", errorText);
            throw new Error(`Failed to upload image: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}


export async function deleteFile(token: string, tenant_id: string, file_id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/tenants/${tenant_id}/file/${file_id}/delete/`,
            {
                method: "DELETE",
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