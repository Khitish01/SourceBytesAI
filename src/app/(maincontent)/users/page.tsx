"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/components/user-table"
import { AddUserModal } from "@/components/add-user-modal"
// import type { User } from "@/types/user"

export default function UserManagementPage() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [users, setUsers] = useState<any[]>([
    {
      id: "1",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "HR, Sales +2",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Admin",
      isActive: true,
    },
    {
      id: "2",
      name: "Dhiraj Dutta",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Employee",
      isActive: false,
    },
    {
      id: "3",
      name: "Rahul Singh",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Admin",
      isActive: true,
    },
    {
      id: "4",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "All",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Org Admin",
      isActive: true,
    },
    {
      id: "5",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Admin",
      isActive: true,
    },
    {
      id: "6",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Admin",
      isActive: true,
    },
    {
      id: "7",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Admin",
      isActive: true,
    },
    {
      id: "8",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Employee",
      isActive: true,
    },
    {
      id: "9",
      name: "Arman Singh",
      email: "abc@gmail.com",
      department: "HR, Sales",
      createdOn: "03:00:54 | 11-03-2024",
      userType: "Admin",
      isActive: true,
    },
  ])

  const handleAddUser = (user: any) => {
    setUsers((prevUsers) => [...prevUsers, user])
    setIsAddUserModalOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main content */}
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

          <UserTable users={users} />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select className="border rounded p-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 border rounded">
                <span className="sr-only">First page</span>
                <span className="px-1">«</span>
              </button>
              <button className="p-1 border rounded">
                <span className="sr-only">Previous page</span>
                <span className="px-1">‹</span>
              </button>
              <span className="text-sm text-gray-500">Page 1 of 1</span>
              <button className="p-1 border rounded">
                <span className="sr-only">Next page</span>
                <span className="px-1">›</span>
              </button>
              <button className="p-1 border rounded">
                <span className="sr-only">Last page</span>
                <span className="px-1">»</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  )
}

