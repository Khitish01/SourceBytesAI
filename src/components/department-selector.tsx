"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Eye, Edit, Trash } from "lucide-react"
import { getDepartmentList } from "./apicalls/department"

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
  user_type: string
  setSelectedDepartments: (departments: string[]) => void
  setAllDeptData: (departments: any[]) => void
}

export function DepartmentSelector({ user_type, selectedDepartments, setSelectedDepartments, setAllDeptData }: DepartmentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static "All" option
  const allOption: Department = {
    id: "all",
    name: "All",
    permissions: { view: false, edit: false, delete: false },
  }

  // API data (simulated)
  const [apiDepartments, setApiDepartments] = useState<Department[]>([])

  const fetchCodeFiles = async () => {
    setLoading(true);
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
    const response = await getDepartmentList(token, tenant_id);
    console.log(response.data.results);
    if (response.success) {

      let apiData = response.data.results
      apiData = apiData?.map((x: any) => ({ ...x, permissions: { view: false, edit: false, delete: false } }))
      console.log(response.data.results);
      setApiDepartments(apiData);
      // setSyncStatuses(new Map(apiData.map((file: FileData) => [file.id, { status: "idle" }])));
    } else {
      setError(response.error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCodeFiles();
  }, []);
  // Combine static "All" with API departments
  const [allDepartment, setAllDepartment] = useState<Department>(allOption)
  const departments = [allDepartment, ...apiDepartments]

  // Helper function to check if a department has any permissions
  const hasAnyPermission = (dept: Department) =>
    dept.permissions.view || dept.permissions.edit || dept.permissions.delete

  // Update selected departments whenever permissions change
  useEffect(() => {
    const newSelectedDepartments = []
    const allDeptData = []

    // Add departments with permissions to selected
    for (const dept of apiDepartments) {
      if (hasAnyPermission(dept)) {
        newSelectedDepartments.push(dept.id)
        allDeptData.push(dept)
      }
    }

    // Add "All" if all departments are selected and it has any permissions
    if (newSelectedDepartments.length === apiDepartments.length && hasAnyPermission(allDepartment)) {
      newSelectedDepartments.push("all")
    }

    setSelectedDepartments(newSelectedDepartments)
    setAllDeptData(allDeptData)
  }, [apiDepartments, allDepartment])

  const toggleDepartment = (departmentId: string) => {
    if (departmentId === "all") {
      if (selectedDepartments.includes("all")) {
        // Deselect all and remove all permissions
        // Clear permissions for all departments
        setAllDepartment((prev) => ({
          ...prev,
          permissions: { view: false, edit: false, delete: false },
        }))

        setApiDepartments((prev) =>
          prev.map((dept) => ({
            ...dept,
            permissions: { view: false, edit: false, delete: false },
          })),
        )
      } else {
        // Select all and ensure at least one permission is active
        const updatedAllDept = { ...allDepartment }

        // If no permissions are active, activate view permission
        if (
          !updatedAllDept.permissions.view &&
          !updatedAllDept.permissions.edit &&
          !updatedAllDept.permissions.delete
        ) {
          updatedAllDept.permissions.view = true
          setAllDepartment(updatedAllDept)

          // Apply view permission to all API departments
          setApiDepartments((prev) =>
            prev.map((dept) => ({
              ...dept,
              permissions: {
                ...dept.permissions,
                view: true,
              },
            })),
          )
        }
      }
      return
    }

    // Toggle individual department
    const dept = apiDepartments.find((d) => d.id === departmentId)
    if (!dept) return

    if (selectedDepartments.includes(departmentId)) {
      // Deselect department and remove all permissions
      setApiDepartments((prev) =>
        prev.map((d) =>
          d.id === departmentId ? { ...d, permissions: { view: false, edit: false, delete: false } } : d,
        ),
      )
    } else {
      // Select department and add view permission if no permissions are active
      if (!hasAnyPermission(dept)) {
        setApiDepartments((prev) =>
          prev.map((d) => (d.id === departmentId ? { ...d, permissions: { ...d.permissions, view: true } } : d)),
        )
      }
    }
  }

  const togglePermission = (departmentId: string, permission: "view" | "edit" | "delete") => {
    if (departmentId === "all") {
      // Toggle permission for "All" option
      const newValue = !allDepartment.permissions[permission]

      // Update "All" option
      setAllDepartment((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: newValue,
        },
      }))

      // Apply the same permission to all API departments
      setApiDepartments((prev) =>
        prev.map((dept) => ({
          ...dept,
          permissions: {
            ...dept.permissions,
            [permission]: newValue,
          },
        })),
      )
    } else {
      // Toggle permission for a specific department
      const newValue = !apiDepartments.find((d) => d.id === departmentId)?.permissions[permission]

      setApiDepartments((prev) =>
        prev.map((dept) =>
          dept.id === departmentId
            ? {
              ...dept,
              permissions: {
                ...dept.permissions,
                [permission]: newValue,
              },
            }
            : dept,
        ),
      )

      // Check if all departments have this permission enabled/disabled
      // and update "All" accordingly
      const updatedApiDepts = apiDepartments.map((dept) =>
        dept.id === departmentId
          ? {
            ...dept,
            permissions: {
              ...dept.permissions,
              [permission]: newValue,
            },
          }
          : dept,
      )

      const allHavePermission = updatedApiDepts.every((dept) =>
        dept.id === departmentId ? newValue : dept.permissions[permission],
      )

      if (allHavePermission !== allDepartment.permissions[permission]) {
        setAllDepartment((prev) => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            [permission]: allHavePermission,
          },
        }))
      }
    }
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
                  className=" rounded-md p-3 flex items-center justify-between"
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

                  {user_type == 'admin' && (
                    <div className="flex items-center space-x-2">
                      {/* View Permission Toggle */}
                      <div
                        className={`relative flex items-center h-5 w-9 rounded-full cursor-pointer ${department.permissions.view ? "bg-orange-500" : "bg-gray-200"}`}
                        onClick={() => togglePermission(department.id, "view")}
                      >
                        <div
                          className={`absolute left-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${department.permissions.view ? "translate-x-4" : "translate-x-0"}`}
                        >
                          <Eye className="h-3 w-3 text-gray-500" />
                        </div>
                      </div>

                      {/* Edit Permission Toggle */}
                      <div
                        className={`relative flex items-center h-5 w-9 rounded-full cursor-pointer ${department.permissions.edit ? "bg-orange-500" : "bg-gray-200"}`}
                        onClick={() => togglePermission(department.id, "edit")}
                      >
                        <div
                          className={`absolute left-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${department.permissions.edit ? "translate-x-4" : "translate-x-0"}`}
                        >
                          <Edit className="h-3 w-3 text-gray-500" />
                        </div>
                      </div>

                      {/* Delete Permission Toggle */}
                      <div
                        className={`relative flex items-center h-5 w-9 rounded-full cursor-pointer ${department.permissions.delete ? "bg-orange-500" : "bg-gray-200"}`}
                        onClick={() => togglePermission(department.id, "delete")}
                      >
                        <div
                          className={`absolute left-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${department.permissions.delete ? "translate-x-4" : "translate-x-0"}`}
                        >
                          <Trash className="h-3 w-3 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

