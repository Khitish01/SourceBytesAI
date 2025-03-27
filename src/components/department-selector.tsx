"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Eye, Edit, Trash } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Department {
  id: string
  name: string
  permissions: {
    view: boolean
    edit: boolean
    delete: boolean
  }
}

interface DepartmentSelectorProps {
  selectedDepartments: string[]
  setSelectedDepartments: (departments: any) => void
}

export function DepartmentSelector({ selectedDepartments, setSelectedDepartments }: DepartmentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize departments with permission states
  const [departments, setDepartments] = useState<Department[]>([
    { id: "all", name: "All", permissions: { view: false, edit: false, delete: false } },
    { id: "hr", name: "HR", permissions: { view: true, edit: false, delete: false } },
    { id: "finance", name: "Finance", permissions: { view: true, edit: false, delete: false } },
    { id: "recruitment", name: "Recruitment", permissions: { view: true, edit: false, delete: false } },
    { id: "marketing", name: "Marketing", permissions: { view: false, edit: false, delete: false } },
    { id: "business-analyst", name: "Business analyst", permissions: { view: true, edit: false, delete: false } },
    { id: "content-writer", name: "Content Writer", permissions: { view: false, edit: false, delete: false } },
  ])

  const toggleDepartment = (departmentId: string) => {
    if (departmentId === "all") {
      if (selectedDepartments.includes("all")) {
        setSelectedDepartments([])
      } else {
        setSelectedDepartments(departments.map((dept) => dept.id))
      }
      return
    }

    setSelectedDepartments((prev:any) => {
      const newSelection = prev.includes(departmentId)
        ? prev.filter((id:any) => id !== departmentId)
        : [...prev, departmentId]

      // Handle "All" option logic
      if (newSelection.length === departments.length - 1 && !newSelection.includes("all")) {
        return [...newSelection, "all"]
      }

      if (prev.includes("all") && !newSelection.includes(departmentId)) {
        return newSelection.filter((id:any) => id !== "all")
      }

      return newSelection
    })
  }

  const togglePermission = (departmentId: string, permission: "view" | "edit" | "delete") => {
    setDepartments((prevDepartments) =>
      prevDepartments.map((dept) =>
        dept.id === departmentId
          ? {
              ...dept,
              permissions: {
                ...dept.permissions,
                [permission]: !dept.permissions[permission],
              },
            }
          : dept,
      ),
    )
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedDepartments.length > 0 ? `${selectedDepartments.length} selected` : "Select Departments"}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          <div className="p-4 max-h-[250px] overflow-auto space-y-3">
            {departments.map((department) => {
              const isSelected = selectedDepartments.includes(department.id)

              return (
                <div
                  key={department.id}
                  className=" rounded-md p-1 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center rounded ${isSelected ? "bg-orange-500 text-white" : "border border-gray-300"} w-6 h-6 cursor-pointer`}
                      onClick={() => toggleDepartment(department.id)}
                    >
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-base">{department.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* View Permission Toggle */}
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <Switch
                        checked={department.permissions.view}
                        onCheckedChange={() => togglePermission(department.id, "view")}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>

                    {/* Edit Permission Toggle */}
                    <div className="flex items-center space-x-1">
                      <Edit className="h-4 w-4 text-gray-500" />
                      <Switch
                        checked={department.permissions.edit}
                        onCheckedChange={() => togglePermission(department.id, "edit")}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>

                    {/* Delete Permission Toggle */}
                    <div className="flex items-center space-x-1">
                      <Trash className="h-4 w-4 text-gray-500" />
                      <Switch
                        checked={department.permissions.delete}
                        onCheckedChange={() => togglePermission(department.id, "delete")}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

