"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// import type { User } from "@/types/user"
import { DepartmentSelector } from "@/components/department-selector"
import { UserTypeSelect } from "./user-type-select"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: any) => void
}

type UserType = "Admin" | "Employee"
type Step = 1 | 2

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState<string>("Admin")
  const [allowFullAccess, setAllowFullAccess] = useState(false)
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState<boolean>(false)

  const resetForm = () => {
    setStep(1)
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setUserType("Admin")
    setAllowFullAccess(false)
    setSelectedDepartments([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }
  const handleSubmit = () => {
    // Handle form submission
    console.log({
      userType,
      allowFullAccess,
      selectedDepartments,
    })
    onClose()
  }

  const handleContinue = () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all required fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setStep(2)
  }

  const handleAddUser = () => {
    // Basic validation
    if (selectedDepartments.length === 0) {
      alert("Please select at least one department")
      return
    }

    const newUser: any = {
      id: Date.now().toString(),
      name,
      email,
      department: selectedDepartments.join(", "),
      createdOn: new Date().toLocaleString(),
      userType,
      isActive: true,
    }

    onAddUser(newUser)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-full max-w-md relative">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add User</h2>
            <button onClick={handleClose} className="text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  User Name<span className="text-red-500">*</span>
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Create password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button onClick={handleContinue} className="w-full bg-orange-500 hover:bg-orange-600">
                Continue
              </Button>
            </div>
          ) : (
            // <div className="space-y-4">
            //   <div className="space-y-2">
            //     <Label htmlFor="userType">
            //       User Type<span className="text-red-500">*</span>
            //     </Label>
            //     <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
            //       <SelectTrigger>
            //         <SelectValue placeholder="Select User Type" />
            //       </SelectTrigger>
            //       <SelectContent>
            //         <SelectItem value="Admin">Admin</SelectItem>
            //         <SelectItem value="Employee">Employee</SelectItem>
            //       </SelectContent>
            //     </Select>
            //   </div>

            //   {userType === "Admin" && (
            //     <div className="flex items-center space-x-2">
            //       <Checkbox
            //         id="allowFullAccess"
            //         checked={allowFullAccess}
            //         onCheckedChange={(checked) => setAllowFullAccess(checked as boolean)}
            //       />
            //       <label
            //         htmlFor="allowFullAccess"
            //         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-orange-500"
            //       >
            //         Allow full access
            //       </label>
            //     </div>
            //   )}

            //   <div className="space-y-2">
            //     <Label htmlFor="departments">
            //       Departments<span className="text-red-500">*</span>
            //     </Label>
            //     <DepartmentSelector
            //       selectedDepartments={selectedDepartments}
            //       setSelectedDepartments={setSelectedDepartments}
            //     />
            //   </div>

            //   <Button onClick={handleAddUser} className="w-full bg-orange-500 hover:bg-orange-600">
            //     {userType === "Admin" ? "Add Admin" : "Add Employee"}
            //   </Button>
            // </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-type" className="text-base font-medium">
                  User Type<span className="text-red-500">*</span>
                </Label>
                <UserTypeSelect
                  value={userType}
                  onChange={setUserType}
                  isOpen={isDepartmentDropdownOpen}
                  setIsOpen={setIsDepartmentDropdownOpen}
                />
              </div>

              {userType === "Admin" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-access"
                    checked={allowFullAccess}
                    onCheckedChange={(checked) => setAllowFullAccess(checked as boolean)}
                    className="h-5 w-5 border-2 border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                  />
                  <Label htmlFor="allow-access" className="text-base">
                    Allow full access
                  </Label>
                </div>
              )}
              {!allowFullAccess && (
                <div className="space-y-2">
                  <Label htmlFor="departments" className="text-base font-medium">
                    Departments<span className="text-red-500">*</span>
                  </Label>
                  <DepartmentSelector
                    selectedDepartments={selectedDepartments}
                    setSelectedDepartments={setSelectedDepartments}
                  />
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md"
              >
                Add {userType}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

