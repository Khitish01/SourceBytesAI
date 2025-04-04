"use server";

const BASE_URL = process.env.API_URL || "https://dev.sourcebytes.ai/api/v1"; // Fallback for safety

export async function getFileList(
  token: string,
  tenant_id: string,
  department_id: string,
  page: number,
  pageSize: number
): Promise<any> {
  const url = `${BASE_URL}/tenants/${tenant_id}/files/?page=${page}&page_size=${pageSize}${department_id == '' ? '' : '&department_id=' + department_id}`;
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

export async function uploadFile(
  token: string,
  formData: FormData,
  tenant_id: string
): Promise<any> {
  const url = `${BASE_URL}/tenants/${tenant_id}/upload-file/`;
  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { errorText, success: false };
      // console.error("Image upload failed:", errorText);
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
): Promise<any> {
  const url = `${BASE_URL}/tenants/${tenant_id}/file/${file_id}/delete/`;
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

export async function syncFile(
  token: string,
  tenant_id: string,
  formData: { file_id: string, department_id?: string },
): Promise<any> {
  const url = `${BASE_URL}/tenants/${tenant_id}/sync-file/`;

  try {
    const response = await fetch(url, {
      method: "POST",
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
        error: data.message || "File syncing failed",
        data: null,
      };
    }

    return {
      success: true,
      message: data.message || "File successfully synced",
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

export async function unSyncFile(
  token: string,
  tenant_id: string,
  formData: { file_ids: string[] },
): Promise<any> {
  const url = `${BASE_URL}/tenants/${tenant_id}/unsync-file/`;

  try {
    const response = await fetch(url, {
      method: "POST",
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
        error: data.message || "File syncing failed",
        data: null,
      };
    }

    return {
      success: true,
      message: data.message || "File successfully synced",
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