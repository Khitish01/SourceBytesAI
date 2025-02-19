"use server";

interface AuthResponse {
    success: boolean;
    error?: string;
}
interface OrganizationFormData {
    name: string
    contact_email: string
    account_manager_name: string
    account_manager_email: string
    subscription_type: string
    address: string
    phone_number: string
}

interface OrganizationEdit {
    name: string
    contact_email: string
    phone_number: string
    account_manager_name: string
    account_manager_email: string
    address: string
    is_active: boolean
}

export async function getOrganisationList(token: string): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/tenants/organizations/",
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
export async function createOrganisation(token: string, formData: OrganizationFormData): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/tenants/organizations/",
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

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}
export async function getOrganisationDetailsById(token: string, id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/tenants/organizations/${id}/`,
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

export async function deleteOrganisation(token: string, id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/tenants/organizations/${id}/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                }
            }
        );
        console.log(response);


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

export async function editOrganisation(token: string, id: string, form: OrganizationEdit): Promise<any> {
    try {
        console.log(form);
        
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/tenants/organizations/${id}/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(form)
            }
        );
        console.log(response);


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

