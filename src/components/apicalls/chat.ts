"use server";

interface SendMessageModel {
    message: string
    conversation_id: string
}
export async function getHistory(token: string): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/chat/conversations/",
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
export async function getChatHistory(token: string, id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/chat/conversations/${id}/`,
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
export async function deleteAllHistory(token: string, tenant_id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/chat/conversations/delete-all/?tenant_id=${tenant_id}`,
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
export async function deleteHistoryById(token: string, id: string, tenant_id: string): Promise<any> {
    try {
        const response = await fetch(
            `https://app.sourcebytes.ai/api/v1/chat/conversations/${id}/delete/?tenant_id=${tenant_id}`,
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
export async function sendChat(token: string, formData: SendMessageModel): Promise<any> {
    try {
        const response = await fetch(
            "https://app.sourcebytes.ai/api/v1/chat/send/",
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