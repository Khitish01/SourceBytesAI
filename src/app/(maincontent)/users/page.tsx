/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Loader, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/components/user-table"
import { AddUserModal } from "@/components/add-user-modal"
import { getDepartmentUsers } from "@/components/apicalls/users"

// Define API response User type
interface ApiUser {
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
    results: ApiUser[];
}

// Define UserTable expected type
interface TableUser {
    id: string;
    name: string;
    email: string;
    department: string;
    createdOn: string;
    userType: string;
    isActive: boolean;
}

// Function to transform API data to Table format
const transformApiUserToTableUser = (apiUser: ApiUser): TableUser => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    department: apiUser.department_details.length > 0
        ? apiUser.department_details.map(d => d.name).join(", ")
        : "All",
    createdOn: new Date(apiUser.created_on).toLocaleString(), // Convert to readable format
    userType: apiUser.user_type,
    isActive: apiUser.is_active
});

export default function UserManagementPage() {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
    const [users, setUsers] = useState<TableUser[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [apiResponse, setApiResponse] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const fetchUsers = async (currentPage: number, pageSize: number) => {
        setLoading(true)
        try {
            const authDetails = JSON.parse(sessionStorage.getItem('authDetails') || '{}')
            const token = authDetails?.data?.token
            const tenantId = authDetails?.data?.tenant_id

            if (!token || !tenantId) {
                throw new Error("Authentication details not found")
            }

            const response = await getDepartmentUsers(token, tenantId, currentPage, pageSize)

            if (response.success && response.data) {
                // Transform API users to Table users
                console.log("USER DETAILS", response.data.results)
                const transformedUsers = response.data.results.map(transformApiUserToTableUser)
                setApiResponse(response.data)
                setUsers(transformedUsers)
            } else {
                setError(response.error || "Failed to fetch users")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {

        fetchUsers(currentPage, pageSize)
    }, [])

    const handleAddUser = (user: TableUser) => {
        // setUsers((prevUsers) => [...prevUsers, user])
        // fetchUsers()
        setIsAddUserModalOpen(false)
    }

    return (
        <div className="flex h-[calc(100vh-100px)] bg-gray-50">
            <div className="flex-1">
                <main className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium">List Of User</h2>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Input type="text" placeholder="Type to search" className="pl-8 w-64" />
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            <Button
                                variant="default"
                                className="bg-orange-500 hover:bg-orange-600"
                                onClick={() => setIsAddUserModalOpen(true)}
                            >
                                <span className="mr-2">+</span>
                                Add User
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                            <Loader className="text-white" size={48} />
                        </div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <UserTable users={users} onEdit={() => fetchUsers(currentPage, pageSize)} />
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Show</span>
                            <select className="border rounded p-1 text-sm" value={pageSize} onChange={(e) => {
                                setPageSize(Number(e.target.value))
                                fetchUsers(1, Number(e.target.value))
                            }}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-gray-500">entries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1 border rounded" disabled={apiResponse?.results?.length == 0 || currentPage == 1} onClick={() => {
                                fetchUsers(1, pageSize)
                                setCurrentPage(1);
                            }}>
                                <span className="sr-only">First page</span>
                                <span className="px-1">«</span>
                            </button>
                            <button className="p-1 border rounded" disabled={apiResponse?.results?.length == 0 || currentPage == 1} onClick={() => {
                                fetchUsers(currentPage - 1, pageSize)
                                setCurrentPage(currentPage - 1);
                            }}>
                                <span className="sr-only">Previous page</span>
                                <span className="px-1">‹</span>
                            </button>
                            <span className="px-2">Page {currentPage} of {Math.ceil(apiResponse?.count / pageSize)}</span>
                            <button className="p-1 border rounded" disabled={apiResponse?.results?.length == 0 || currentPage == Math.ceil(apiResponse?.count / pageSize)} onClick={() => {
                                fetchUsers(currentPage + 1, pageSize)
                                setCurrentPage(currentPage + 1);
                            }}>
                                <span className="sr-only">Next page</span>
                                <span className="px-1">›</span>
                            </button>
                            <button className="p-1 border rounded" disabled={apiResponse?.results?.length == 0 || currentPage == Math.ceil(apiResponse?.count / pageSize)} onClick={() => {
                                fetchUsers(Math.ceil(apiResponse?.count / pageSize), pageSize)
                                setCurrentPage(Math.ceil(apiResponse?.count / pageSize));
                            }}>
                                <span className="sr-only">Last page</span>
                                <span className="px-1">»</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => {
                    setCurrentPage(1)
                    setPageSize(10)
                    fetchUsers(1, 10)
                    setIsAddUserModalOpen(false)

                }}
                onAddUser={handleAddUser}
            />
        </div>
    )
}