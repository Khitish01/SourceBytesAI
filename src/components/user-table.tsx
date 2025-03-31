"use client"

import { useState } from "react"
import { Eye, Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import dayjs from "dayjs"
import { updateDepartmentUser, UpdateUserRequest } from "./apicalls/users"
import { ConfirmationModal } from "./confirmation-modal"

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
  onEdit: () => void
}

export function UserTable({ users: initialUsers, onEdit }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUsersData, setSelectedUsersData] = useState<any>({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});

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

  const toggleUserActive = async (data: any) => {
    setLoading(true);
    debugger;
    const authDetailsString = sessionStorage.getItem("authDetails");
    if (!authDetailsString) {
      setError("No authentication details found in session storage");
      setLoading(false);
      return;
    }

    let authDetails;
    try {
      authDetails = JSON.parse(authDetailsString);
    } catch (e) {
      setError("Failed to parse auth details from session storage");
      setLoading(false);
      return;
    }

    const token = authDetails.data?.token;
    const tenant_id = authDetails.data?.tenant_id;

    if (!token || !tenant_id) {
      setError("Token or tenant_id missing in auth details");
      setLoading(false);
      return;
    }

    let payload: UpdateUserRequest = {

      "tenant_id": tenant_id,
      "is_active": !data.isActive

    }

    console.log(payload);
    const response = await updateDepartmentUser(token, data?.id, payload)
    if (response.success) {
      console.log(response);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === data.id ? { ...user, isActive: !user.isActive } : user
        )
      )

    } else {
      setError(response.error);
    }
    setLoading(false);
    onEdit()

  }
  const togglePermission = (user: any) => {

    setModalData({ header: `Want to ${!user.isActive ? 'Active' : 'Inactive'} the ${user.name}?`, desc: true, confirmbutton: true })
    setSelectedUsersData({ id: user.id, isActive: user.isActive })
    setIsModalOpen(true)


    // setUsers((prevUsers) =>
    //   prevUsers.map((x) =>
    //     x.id === user.id ? { ...x, isActive: !x.isActive } : x
    //   )
    // );
  };

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto h-[calc(100vh-280px)]">
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
                <td className="p-3">{user.createdOn ? dayjs(user.createdOn).format('hh:mm:ss | DD-MM-YYYY') : '-'}</td>
                <td className="p-3">{user.userType}</td>
                <td className="p-3 flex items-center gap-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <img src="/edit_icon.svg" alt="" className="h-5 w-5"/>
                  </button>
                  {/* <Switch checked={user.isActive} onCheckedChange={() => {
                    setModalData({ header: `Want to ${!user.isActive ? 'Active' : 'Inactive'} the ${user.name}?`, desc: true, confirmbutton: true })
                    setSelectedUsersData({ id: user.id, isActive: user.isActive })
                    setIsModalOpen(true)
                  }
                  } /> */}

                  <div
                    className={`relative flex items-center h-5 w-10 rounded-full cursor-pointer ${user.isActive ? "bg-green-500" : "bg-gray-200"}`}
                    onClick={() => togglePermission(user)}
                  >
                    <div
                      className={`absolute left-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${user.isActive ? "translate-x-4" : "translate-x-0"}`}
                    >
                      {/* <Eye className="h-3 w-3 text-gray-500" /> */}
                      {user.isActive ? (

                        <img src="/tick-icon.svg" alt="" className="h-3 w-3 invert-[1]" />
                      ) : (
                        <img src="/close-icon.svg" alt="" className="h-3 w-3" />

                      )}
                    </div>
                  </div>


                </td>
                <ConfirmationModal modalData={modalData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => toggleUserActive(selectedUsersData)}></ConfirmationModal>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
