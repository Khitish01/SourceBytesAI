"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

interface User {
  id: string
  name: string
  email: string
  department: string
  createdOn: string
  userType: string
  isActive: boolean
}

interface UserTableProps {
  users: User[]
}

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  const toggleUserActive = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    )
  }

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left">
                <Checkbox
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-left font-medium">Department</th>
              <th className="p-3 text-left font-medium">Created on</th>
              <th className="p-3 text-left font-medium">User Type</th>
              <th className="p-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleSelectUser(user.id)}
                  />
                </td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.department}</td>
                <td className="p-3">{user.createdOn}</td>
                <td className="p-3">{user.userType}</td>
                <td className="p-3 flex items-center gap-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                  <Switch checked={user.isActive} onCheckedChange={() => toggleUserActive(user.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
