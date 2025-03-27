/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

const BASE_URL = process.env.API_URL || "https://dev.sourcebytes.ai/api/v1"; // Fallback for safety

export async function getDepartmentList(
    token: string,
    tenant_id: string
): Promise<any> {
    const url = `${BASE_URL}/tenants/${tenant_id}/dept/`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
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

export async function createDepartment(
    token: string,
    formData: { name: string, parent?: string, is_folder?: boolean },
    tenant_id: string
): Promise<any> {
    const url = `${BASE_URL}/tenants/${tenant_id}/dept/`;
    // console.log(url);

    //   https://dev.sourcebytes.ai/api/v1/tenants/1cf29321-f9fa-4ee1-9df3-301a740e9662/dept/
    if (!token) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(formData),
        });
        // console.log(response);


        if (!response.ok) {
            const errorText = await response.text();
            return { errorText, success: false };
            console.error("Image upload failed:", errorText);
            // throw new Error(`Failed to upload image: ${errorText}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        return { error, success: false };
        // throw error;
    }
}

export async function deleteFile(
    token: string,
    tenant_id: string,
    file_id: string
): Promise<{
    success: boolean;
    message?: string;
    data: null;
    error?: string;
}> {
    const url = `${BASE_URL}/tenants/${tenant_id}/file/${file_id}/`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || "File deletion failed",
                data: null,
            };
        }

        return {
            success: true,
            message: data.message || "File successfully deleted",
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        };
    }
}
export async function deleteDepartment(
    token: string,
    tenant_id: string,
    department_id: string | undefined
): Promise<any> {
    const url = `${BASE_URL}/tenants/${tenant_id}/dept/?department_id=${department_id}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || "File deletion failed",
                data: null,
            };
        }

        return {
            success: true,
            message: data.message || "File successfully deleted",
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        };
    }
}
export async function renameDepartment(
    token: string,
    tenant_id: string,
    formData: { name: string, parent?: string, is_folder?: boolean },
    department_id: string | undefined
): Promise<any> {
    const url = `${BASE_URL}/tenants/${tenant_id}/dept-update/?department_id=${department_id}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || "File deletion failed",
                data: null,
            };
        }

        return {
            success: true,
            message: data.message || "File successfully deleted",
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        };
    }
}
