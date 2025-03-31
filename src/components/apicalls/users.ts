/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

const BASE_URL = process.env.API_URL || "https://dev.sourcebytes.ai/api/v1";

// Define interfaces for the response structure
interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  tenant_id: string;
  user_type: string;
  is_admin: boolean;
  has_org_full_access: boolean;
  created_on: string;
  department_details: any[];
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
// Define request interface
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  tenant_id: string;
  user_type: string;
  departments?: string[];
  has_org_full_access: boolean;
}

// Define response interface
interface CreatedUser {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  tenant_id: string;
  user_type: string;
  is_admin: boolean;
  has_org_full_access: boolean;
  created_on: string;
  department_details: {
    id: string;
    name: string;
  }[];
}

/**
 * Retrieves a paginated list of all users in the specified tenant, along with their department details.
 *
 * @param {string} token - The authentication token
 * @param {string} tenant_id - The tenant ID
 * @returns {Promise<{success: boolean, message?: string, data?: PaginatedResponse, error?: string}>} - The promise resolves with an object containing `success`, `message`, `data` and `error` properties. If the request was successful, `success` is `true`, `message` is a success message, and `data` contains the paginated list of users. If the request failed, `success` is `false`, `error` is an error message, and `data` is `undefined`.
 */

export async function getDepartmentUsers(
  token: string,
  tenant_id: string,
  page: number,
  size: number
): Promise<{
  success: boolean;
  message?: string;
  data?: PaginatedResponse;
  error?: string;
}> {
  const BASE_URL = 'https://dev.sourcebytes.ai/api/v1';
  const url = `${BASE_URL}/users/dept-user/list/?page=${page}&page_size=${size}&tenant_id=${tenant_id}`;

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
        error: data.message || "Failed to retrieve users",
      };
    }

    return {
      success: true,
      message: data.message || "Users retrieved successfully",
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}



export async function createDepartmentUser(
  token: string,
  userData: CreateUserRequest
): Promise<any> {
  const url = `${BASE_URL}/auth/dept-user/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to create user",
      };
    }

    return {
      success: true,
      message: data.message || "User created successfully",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function grantPermission(
  token: string,
  userData: { user_id: string, tenant_id: string, departments: { id: string, has_file_upload_permission: boolean, has_file_delete_permission: boolean, has_file_view_permission: boolean }[] }
): Promise<any> {
  const url = `${BASE_URL}/auth/dept-user-permission/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to create user",
      };
    }

    return {
      success: true,
      message: data.message || "User created successfully",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

// Define response interface
interface UserDetails {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  tenant_id: string;
  user_type: string;
  is_admin: boolean;
  has_org_full_access: boolean;
  created_on: string;
  department_details: {
    id?: string;
    name?: string;
  }[];
}

export async function getDepartmentUserDetails(
  token: string,
  tenant_id: string,
  user_id: string
): Promise<{
  success: boolean;
  message?: string;
  data?: UserDetails;
  error?: string;
}> {
  const url = `${BASE_URL}/users/dept-user/detail/?tenant_id=${tenant_id}&user_id=${user_id}`;

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
        error: data.message || "Failed to retrieve user details",
      };
    }

    return {
      success: true,
      message: data.message || "User details retrieved successfully",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

// Define request interface
export interface UpdateUserRequest {
  tenant_id: string;
  departments?: string[];
  is_active?: boolean
}

// Define response interface (assuming a similar structure to other endpoints)
// Note: Since no response was provided, this is an educated guess
interface UpdatedUser {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  tenant_id: string;
  user_type: string;
  is_admin: boolean;
  has_org_full_access: boolean;
  created_on: string;
  department_details: {
    id: string;
    name?: string;
  }[];
}

export async function updateDepartmentUser(
  token: string,
  user_id: string,
  updateData: UpdateUserRequest
): Promise<any> {
  const BASE_URL = "https://dev.sourcebytes.ai/api/v1";
  const url = `${BASE_URL}/users/dept-user/update/?user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update user",
      };
    }

    return {
      success: true,
      message: data.message || "User updated successfully",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function deleteDepartmentUser(
  token: string,
  tenant_id: string,
  user_id: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const url = `${BASE_URL}/users/dept-user/delete/?tenant_id=${tenant_id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    // Note: DELETE responses often don't return a body, but we'll handle it if there is one
    let data;
    try {
      data = await response.json();
    } catch {
      // If there's no JSON response, we'll handle it below
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || "Failed to delete user",
      };
    }

    return {
      success: true,
      message: data?.message || "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
