/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Folder, MoreHorizontal, Plus, ChevronDown, ChevronRight, EllipsisVertical, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import FileUploadModal from "@/components/FileUploadModal"
import {
    createDepartment,
    deleteDepartment,
    deleteFile,
    getDepartmentList,
    renameDepartment,
} from "@/components/apicalls/department"
import { getOrganisationDetails } from "@/components/apicalls/organisation"
import Loader from "@/components/Loader"
import { getFileList, syncFile, unSyncFile } from "@/components/apicalls/tenant-file"
import dayjs from "dayjs"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

// Types for our data structure
type ItemType = "organization" | "department" | "sub-department" | "folder" | "source" | "file"

interface Item {
    id: string
    name: string
    type: ItemType
    children?: Item[]
    files?: FileItem[]
    expanded?: boolean
    path?: string
    is_folder?: boolean
    sub_departments?: any[]
}

interface FileItem {
    id: string
    name: string
    status: string
    lastSync: string
    size: string
    syncNow: string
    selected?: boolean
}

export default function DataSourceExplorer() {
    // Initial data structure
    const [items, setItems] = useState<Item[]>([])
    const [documents, setDocuments] = useState<any>({})
    // State for dialogs
    const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false)
    const [isCreateSubDepartmentOpen, setIsCreateSubDepartmentOpen] = useState(false)
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
    const [isRename, setIsRename] = useState(false)
    const [isCreateSourceOpen, setIsCreateSourceOpen] = useState(false)
    const [newItemName, setNewItemName] = useState("Untitled folder")
    const [currentParentId, setCurrentParentId] = useState<string | null>(null)

    // State for dropdown menu
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>({})
    const [activeItem, setActiveItem] = useState<Item | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [path, setPath] = useState<any[] | undefined>([])
    const [orgDetails, setOrgDetails] = useState<any>({})
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
    // State for file view
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedView, setSelectedView] = useState<"list" | "explorer">("list")
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [fileContextMenuOpen, setFileContextMenuOpen] = useState(false)
    const [fileContextMenuPosition, setFileContextMenuPosition] = useState({ x: 0, y: 0 })
    const { toast } = useToast()

    // Toggle item expansion
    const toggleExpand = (id: string) => {
        setItems((prevItems) => {
            const updateItem = (items: Item[]): Item[] => {
                return items.map((item) => {
                    if (item.id === id) {
                        return { ...item, expanded: !item.expanded }
                    }
                    if (item.children) {
                        return { ...item, children: updateItem(item.children) }
                    }
                    return item
                })
            }
            return updateItem(prevItems)
        })
    }

    // Helper function to get all expanded item IDs
    const getExpandedItemIds = (items: Item[]): string[] => {
        const expandedIds: string[] = []

        const collectExpandedIds = (items: Item[]) => {
            items.forEach((item) => {
                if (item.expanded) {
                    expandedIds.push(item.id)
                }
                if (item.children && item.children.length > 0) {
                    collectExpandedIds(item.children)
                }
            })
        }

        collectExpandedIds(items)
        return expandedIds
    }

    // Handle three-dot menu click
    const handleMenuClick = (e: React.MouseEvent, item: Item) => {
        e.stopPropagation()
        setActiveItem(item)
        setCurrentParentId(item.id)
        setDropdownPosition({ x: e.clientX, y: e.clientY })
        setIsDropdownOpen(true)
    }

    // Create new item
    const createNewItem = (type: ItemType, isRename = false) => {
        if (!activeItem) return
        if (isRename) {
            setIsRename(true)
            setNewItemName(activeItem?.name)
        }
        setIsDropdownOpen(false)
        if (type === "department") {
            setIsCreateDepartmentOpen(true)
        } else if (type === "sub-department") {
            setIsCreateSubDepartmentOpen(true)
        } else if (type === "folder") {
            setIsCreateFolderOpen(true)
        } else if (type === "source") {
            setIsCreateSourceOpen(true)
        }
    }

    // Add new item to the data structure
    const addNewItem = async (type: ItemType) => {
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }
        const payload: { name: string; parent?: string; is_folder?: boolean } = {
            name: newItemName,
        }
        if (type == "folder" && activeItem?.type == "organization") {
            payload["is_folder"] = true
        } else if (type == "sub-department") {
            payload["parent"] = activeItem?.id
        } else if (type == "folder" && activeItem?.type != "organization") {
            payload["is_folder"] = true
            payload["parent"] = activeItem?.id
        }
        console.log(payload)

        const response = await createDepartment(token, payload, tenant_id)

        console.log(response)
        if (response.success) {
            // Store the current expanded state before fetching
            const expandedItemIds = getExpandedItemIds(items)

            // Fetch updated data
            await fetchCodeFiles(expandedItemIds)
        } else {
            setError(response.error)
        }
        // Reset state
        setNewItemName("Untitled folder")
        setCurrentParentId(null)
        closeAllDialogs()
        setLoading(false)
    }

    // Close all dialogs
    const closeAllDialogs = () => {
        setIsCreateDepartmentOpen(false)
        setIsCreateSubDepartmentOpen(false)
        setIsCreateFolderOpen(false)
        setIsCreateSourceOpen(false)
    }

    // Toggle file selection
    const toggleFileSelection = (id: string) => {
        setSelectedFiles((prev) => {
            if (prev.includes(id)) {
                return prev.filter((fileId) => fileId !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    // Handle file context menu
    const handleFileContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setFileContextMenuPosition({ x: e.clientX, y: e.clientY })
        setFileContextMenuOpen(true)
    }

    const transformData = (orgDetails: any, apiData: any[]): Item[] => {
        const buildHierarchy = (department: any): Item => ({
            id: department?.id,
            name: department?.name,
            type: department?.is_folder ? "folder" : department?.parent == null ? "department" : "sub-department",
            expanded: false,
            path: department?.path,
            is_folder: department?.is_folder,
            children: department?.sub_departments?.map(buildHierarchy), // Recursively process sub-departments
        })
        // children: dept.sub_departments.map((subDept: any) => ({
        //     ...subDept,
        //     type: subDept.is_folder ? "folder" : "sub-department",
        // })),
        return [
            {
                id: orgDetails?.id,
                name: orgDetails?.name,
                type: "organization",
                expanded: false,
                children: apiData?.filter((dept) => dept?.parent === null)?.map(buildHierarchy), // Build hierarchy for top-level departments
            },
        ]
    }

    const fetchCodeFiles = async (expandedItemIds?: string[]) => {
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }
        const orgDetails = await getOrganisationDetails(token, tenant_id)
        console.log(orgDetails)

        setOrgDetails(orgDetails)
        const response = await getDepartmentList(token, tenant_id)
        if (response.success) {
            console.log(response.data.results)

            // setSyncStatuses(new Map(apiData.map((file: FileData) => [file.id, { status: "idle" }])));
        } else {
            setError(response.error)
        }
        const apiData = transformData(orgDetails?.data, response?.data?.results)

        // If we have expanded IDs to restore, apply them to the tree
        if (expandedItemIds && expandedItemIds.length > 0) {
            const restoreExpandedState = (items: Item[]): Item[] => {
                return items.map((item) => {
                    if (expandedItemIds.includes(item.id)) {
                        item.expanded = true
                    }
                    if (item.children && item.children.length > 0) {
                        item.children = restoreExpandedState(item.children)
                    }
                    return item
                })
            }

            const updatedData = restoreExpandedState(apiData)
            setItems(updatedData)
        } else {
            setItems(apiData)
        }

        setLoading(false)
    }
    const getDocumentList = async (department_id: string, page: number, pageSize: number) => {
        // console.log('sssssssssss');
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }
        const response = await getFileList(token, tenant_id, department_id, page, pageSize)
        if (response.success) {
            console.log("getDocumentList", response.data.results)

            // const apiData = transformData(orgDetails.data, response.data.results);
            setDocuments(response?.data)
            // setSyncStatuses(new Map(apiData.map((file: FileData) => [file.id, { status: "idle" }])));
        } else {
            setError(response.error)
        }
        setLoading(false)
    }
    const BASE_URL = "http://35.200.227.29:8000" // Adjust based on your environment

    // Handle file download in development mode needs to be fixed
    const handleDownload = async (fileUrl: string, fileName: string) => {
        try {
            const fullUrl = `${BASE_URL}${fileUrl}`
            console.log("Downloading from:", fullUrl) // Debug log
            const response = await fetch(fullUrl)

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading file:", error)
        }
    }

    // Handle file view (open in browser)
    const handleView = (fileUrl: string) => {
        const fullUrl = `${BASE_URL}${fileUrl}`
        console.log("Viewing at:", fullUrl) // Debug log
        window.open(fullUrl, "_blank") // Open in a new tab
    }

    // Handle file deletion
    const handleDelete = async (fileId: string) => {
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }

        const response = await deleteFile(token, tenant_id, fileId)
        if (response.success) {
            console.log(response.message) // "File successfully deleted"
            // Refresh the file list after deletion
            await getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : "", currentPage, pageSize)
        } else {
            console.error("Delete failed:", response.error)
            setError(response.error || "Failed to delete file")
        }
        setLoading(false)
    }
    const handleSync = async (doc: any) => {
        // console.log('ddddddddddddddddddddddddddddddddddd');
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }
        let response

        if (doc?.upload_status == "Ready to Sync") {
            const payload: { file_id: string; department_id?: string } = {
                file_id: doc?.id,
                department_id: doc?.department,
            }

            response = await syncFile(token, tenant_id, payload)
        } else {
            const payload: { file_ids: string[] } = {
                file_ids: [doc.id],
            }
            response = await unSyncFile(token, tenant_id, payload)
        }

        if (response.success) {
            console.log(response.message) // "File successfully deleted"
            // Refresh the file list after deletion
            await getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : "", currentPage, pageSize)
        } else {
            console.error("Delete failed:", response.error)
            setError(response.error || "Failed to delete file")
        }
        setLoading(false)
    }
    const handleDeleteDepartment = async () => {
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }

        const response = await deleteDepartment(token, tenant_id, activeItem?.id)
        if (response.success) {
            console.log(response.message)
            // Store expanded state before refreshing
            const expandedItemIds = getExpandedItemIds(items)
            // Remove the deleted item ID from expanded IDs
            const filteredExpandedIds = expandedItemIds.filter((id) => id !== activeItem?.id)
            // Refresh with preserved expanded state
            await fetchCodeFiles(filteredExpandedIds)
        } else {
            console.error("Delete failed:", response.error)
            setError(response.error || "Failed to delete file")
        }
        setLoading(false)
    }
    const handleRenameDepartment = async () => {
        setLoading(true)
        const authDetailsString = sessionStorage.getItem("authDetails")
        if (!authDetailsString) {
            setError("No authentication details found in session storage")
            setLoading(false)
            return
        }

        let authDetails
        try {
            authDetails = JSON.parse(authDetailsString)
        } catch (e) {
            setError("Failed to parse auth details from session storage")
            setLoading(false)
            return
        }

        const token = authDetails.data?.token
        const tenant_id = authDetails.data?.tenant_id

        if (!token || !tenant_id) {
            setError("Token or tenant_id missing in auth details")
            setLoading(false)
            return
        }
        const payload: { name: string; parent?: string; is_folder?: boolean } = {
            name: newItemName,
        }

        const response = await renameDepartment(token, tenant_id, payload, activeItem?.id)

        if (response.success) {
            console.log(response.message)
            // Store expanded state before refreshing
            const expandedItemIds = getExpandedItemIds(items)
            // Refresh with preserved expanded state
            await fetchCodeFiles(expandedItemIds)
        } else {
            console.error("Delete failed:", response.error)
            setError(response.error || "Failed to delete file")
        }
        // Reset state
        setNewItemName("Untitled folder")
        setCurrentParentId(null)
        closeAllDialogs()
        setLoading(false)
    }

    useEffect(() => {
        fetchCodeFiles()
    }, [])

    const isFolder = (name: string, departments: any[]): boolean => {
        for (const department of departments) {
            if (department.name === name && department.is_folder) {
                return true
            }
            if (department.children && isFolder(name, department.children)) {
                return true
            }
        }
        return false
    }

    const toggleSelectUser = (userId: string) => {
        setSelectedDocuments((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
    }

    const toggleSelectAll = () => {
        if (selectedDocuments?.length === documents?.results?.length) {
            setSelectedDocuments([])
        } else {
            setSelectedDocuments(documents?.results.map((doc: any) => doc.id))
        }
    }

    /**
     * Render a single tree item.
     * @param {Item} item The tree item to render.
     * @param {number} [level=0] The level of the item in the tree.
     * @returns {JSX.Element} The rendered tree item.
     */
    const renderTreeItem = (item: Item, level = 0) => {
        const isExpandable = item?.children && item?.children?.length > 0
        // console.log(isExpandable);

        const paddingLeft = level * 16

        return (
            <div key={item.id}>
                <div
                    className={cn(
                        "flex items-center py-2 px-2 hover:bg-gray-100 cursor-pointer",
                        level === 0 && "font-medium",
                        isSelected && item.id == selectedItem?.id && "bg-gray-100",
                    )}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={() => {
                        // if (item.type !== "organization") {
                        setIsSelected(true)
                        setCurrentPage(1)
                        getDocumentList(item.type !== "organization" ? item?.id : "", 1, pageSize)
                        console.log(item)

                        let selectedPath: any = item?.path?.split("/")
                        console.log(selectedPath)
                        selectedPath?.[0] == ""
                            ? (selectedPath[0] = orgDetails?.data?.name)
                            : (selectedPath = [orgDetails?.data?.name])
                        selectedPath = selectedPath?.map((x: any, i: number) => ({
                            is_folder: isFolder(x, items?.[0]?.children || []),
                            name: x,
                        }))
                        setPath(selectedPath)

                        console.log(item)
                        console.log(selectedPath)
                        setSelectedItem(item)
                        // }
                        toggleExpand(item.id)
                    }}
                >
                    {isExpandable ? (
                        item.expanded ? (
                            <ChevronDown size={16} className="mr-2" />
                        ) : (
                            <ChevronRight size={16} className="mr-2" />
                        )
                    ) : (
                        <span className="w-6"></span>
                    )}

                    {item.type === "organization" ? (
                        <img src="/organisation.svg" alt="" className="h-4 w-4  mr-2" />
                        // <Folder className="h-4 w-4 text-[#FF6B35] mr-2" />
                    ) : item.type === "department" || item.type === "sub-department" ? (
                        <img src="/department.svg" alt="" className="h-4 w-4  mr-2" />
                        // <Folder className="h-4 w-4 text-[#FFD700] mr-2" />
                    ) : (
                        <img src="/folder-icon.svg" alt="" className="h-4 w-4  mr-2" />
                        // <File className="h-4 w-4 mr-2" />
                    )}

                    <span className="">{item.name}</span>

                    <button className="hover:bg-gray-200 p-1 rounded" onClick={(e) => handleMenuClick(e, item)}>
                        <EllipsisVertical size={16} className="text-zinc-400" />
                    </button>
                </div>

                {isExpandable && item.expanded && <div>{item.children?.map((child) => renderTreeItem(child, level + 1))}</div>}
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {loading && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <Loader size="lg" className="text-white" />
                </div>
            )}

            {selectedView === "list" ? (
                <div className="flex h-full">
                    {/* Sidebar */}
                    <div className={`w-64 ${isSelected ? "border-r" : ""} overflow-auto`}>
                        {items.map((item) => renderTreeItem(item))}
                    </div>

                    {/* Main content */}
                    {isSelected ? (
                        <div className="flex-1 p-4">
                            <div className="flex justify-between mb-4">
                                <div className="text-xl font-semibold flex gap-2">
                                    {path &&
                                        path.map((item: any, index: number) => (
                                            <span className="flex gap-3 items-center" key={index}>
                                                {index == 0 ? (
                                                    <img src="/organisation.svg" alt="" className="h-4 w-4 " />
                                                ) : item?.is_folder ? (
                                                    <img src="/folder-icon.svg" alt="" className="h-4 w-4" />
                                                ) : (
                                                    <img src="/department.svg" alt="" className="h-4 w-4" />
                                                )}
                                                {/* <span>{item}</span> */}
                                                <span>{item?.name}</span>
                                                {index == path?.length - 1 ? (
                                                    // <img src="/weui_arrow-outlined.svg" alt="" className="h-6 w-6" />
                                                    <></>
                                                ) : (
                                                    <img src="/weui_arrow-outlined.svg" alt="" className="h-6 w-6" />
                                                )}
                                            </span>
                                        ))}
                                </div>
                                <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => setIsModalOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Source
                                </Button>

                                <FileUploadModal
                                    isOpen={isModalOpen}
                                    department_id={
                                        activeItem
                                            ? activeItem?.type == "organization"
                                                ? null
                                                : activeItem?.id
                                            : selectedItem?.type == "organization"
                                                ? null
                                                : selectedItem?.id
                                    }
                                    onClose={() => {
                                        setCurrentPage(1)
                                        getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : "", 1, pageSize)
                                        setIsModalOpen(false)
                                    }}
                                />
                            </div>

                            <div className="rounded-md mt-10">
                                <div className="flex items-center justify-between p-4">
                                    <h3 className="font-medium">Data Source:</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Input className="pl-8 w-64" placeholder="Type to search" />

                                            <img src="/search-Icon.svg" alt="" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-md">
                                            <img src="/filter-tick.svg" alt="" className="h-5 w-5" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-md">
                                            <img src="/document-download.svg" alt="" className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {selectedDocuments?.length > 0 && (
                                    <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 rounded-3xl mb-3 ">
                                        <button className="p-1 hover:bg-gray-200 rounded">
                                            {/* <img src="/datasource-download.svg" alt="" className="h-5 w-5" /> */}
                                            <X className="h-4 w-4" />
                                        </button>
                                        <span className="text-sm font-medium">{selectedDocuments?.length} selected</span>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <img src="/datasource-download.svg" alt="" className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <img src="/datasource-view.svg" alt="" className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <img src="/trash.svg" alt="" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b">
                                                <th className="w-8 p-3 text-left">
                                                    {/* <input type="checkbox" className="rounded" /> */}
                                                    <Checkbox
                                                        checked={
                                                            documents?.results?.length > 0 && selectedDocuments?.length === documents?.results?.length
                                                        }
                                                        onCheckedChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th className="text-left p-3 font-medium">Name</th>
                                                <th className="text-left p-3 font-medium">Status</th>
                                                <th className="text-left p-3 font-medium">Last Sync</th>
                                                <th className="text-left p-3 font-medium">Size</th>
                                                <th className="text-left p-3 font-medium">Sync Now</th>
                                                <th className="text-left p-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents?.results &&
                                                documents?.results.map((doc: any) => (
                                                    <tr key={doc?.id} className="border-t hover:bg-gray-50">
                                                        <td className="p-3">
                                                            {/* <input type="checkbox" className="rounded" /> */}
                                                            <Checkbox
                                                                checked={selectedDocuments.includes(doc.id)}
                                                                onCheckedChange={() => toggleSelectUser(doc.id)}
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 flex items-center justify-center rounded">
                                                                    {/* <File className="h-3 w-3 text-yellow-600" /> */}
                                                                    <img src="/datasource-list-file.svg" alt="" className="h-4 w-4" />
                                                                </div>
                                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-60">
                                                                    {doc?.original_filename}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            {doc?.upload_status == "Ready to Sync" ? (
                                                                <span className="text-gray-800">{doc?.upload_status}</span>
                                                            ) : doc?.upload_status == "Ready" ? (
                                                                <span className="text-green-500">{doc?.upload_status}</span>
                                                            ) : doc?.upload_status == "Not Accepted" ? (
                                                                <span className="text-red-500">{doc?.upload_status}</span>
                                                            ) : doc?.upload_status == "Processing!" ? (
                                                                <span className="text-blue-500">{doc?.upload_status}</span>
                                                            ) : (
                                                                <span className="text-orange-500">{doc?.upload_status}</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            {doc?.last_sync ? dayjs(doc?.last_sync).format("hh:mm:ss | DD-MM-YYYY") : "-"}
                                                        </td>
                                                        <td className="p-3">{doc?.file_size_kb}</td>
                                                        <td className="p-3">
                                                            {doc?.upload_status == "Ready to Sync" ? (
                                                                <button className="text-gray-500 hover:text-gray-700" onClick={() => handleSync(doc)}>
                                                                    <img src="/datasource-sync.svg" alt="" className="h-5 w-5" />
                                                                </button>
                                                            ) : doc?.upload_status == "Ready" ? (
                                                                <button className="text-gray-500 hover:text-gray-700" onClick={() => handleSync(doc)}>
                                                                    <img src="/datasource-sync-green.svg" alt="" className="h-5 w-5" />
                                                                </button>
                                                            ) : doc?.upload_status == "Not Accepted" ? (
                                                                <button className="text-gray-500 hover:text-gray-700">
                                                                    <>-</>
                                                                </button>
                                                            ) : doc?.upload_status == "Processing!" ? (
                                                                <button className="text-gray-500 hover:text-gray-700" onClick={() => handleSync(doc)}>
                                                                    <img src="/datasource-sync-orange.svg" alt="" className="h-5 w-5" />
                                                                </button>
                                                            ) : (
                                                                <button className="text-gray-500 hover:text-gray-700">
                                                                    <>-</>
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-3 text-gray-500">
                                                                <button
                                                                    className="hover:text-gray-700"
                                                                    onClick={() => handleDownload(doc.file, doc.original_filename)}
                                                                    title="Download"
                                                                >
                                                                    <img src="/datasource-download.svg" alt="" className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    className="hover:text-gray-700"
                                                                    onClick={() => handleView(doc.file)}
                                                                    title="View"
                                                                >
                                                                    <img src="/datasource-view.svg" alt="" className="h-5 w-5" />
                                                                </button>
                                                                {/* <button className="hover:text-gray-700">
                                                                <img src="/send-2.svg" alt="" className="h-5 w-5" />
                                                            </button> */}
                                                                <button
                                                                    className="hover:text-gray-700"
                                                                    onClick={() => handleDelete(doc.id)}
                                                                    title="Delete"
                                                                >
                                                                    <img src="/trash.svg" alt="" className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {documents?.results?.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-10">
                                                        {/* <span>No Data Found</span> */}
                                                        <div className="w-full flex justify-center align-middle">
                                                            <img src="/no-data-found.svg" className="w-56" alt="" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-3 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>Show</span>
                                        <select
                                            className="border rounded px-2 py-1"
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value))
                                                getDocumentList(
                                                    selectedItem.type !== "organization" ? selectedItem?.id : "",
                                                    1,
                                                    Number(e.target.value),
                                                )
                                            }}
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span>entries</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            className="border rounded p-1"
                                            disabled={documents?.results?.length == 0 || currentPage == 1}
                                            onClick={() => {
                                                getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : "", 1, pageSize)
                                                setCurrentPage(1)
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            className="border rounded p-1"
                                            disabled={documents?.results?.length == 0 || currentPage == 1}
                                            onClick={() => {
                                                getDocumentList(
                                                    selectedItem.type !== "organization" ? selectedItem?.id : "",
                                                    currentPage - 1,
                                                    pageSize,
                                                )
                                                setCurrentPage(currentPage - 1)
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="px-2">
                                            Page {currentPage} of {Math.ceil(documents?.count / pageSize)}
                                        </span>
                                        <button
                                            className="border rounded p-1"
                                            disabled={
                                                documents?.results?.length == 0 || currentPage == Math.ceil(documents?.count / pageSize)
                                            }
                                            onClick={() => {
                                                getDocumentList(
                                                    selectedItem.type !== "organization" ? selectedItem?.id : "",
                                                    currentPage + 1,
                                                    pageSize,
                                                )
                                                setCurrentPage(currentPage + 1)
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <button
                                            className="border rounded p-1"
                                            disabled={
                                                documents?.results?.length == 0 || currentPage == Math.ceil(documents?.count / pageSize)
                                            }
                                            onClick={() => {
                                                getDocumentList(
                                                    selectedItem.type !== "organization" ? selectedItem?.id : "",
                                                    Math.ceil(documents?.count / pageSize),
                                                    pageSize,
                                                )
                                                setCurrentPage(Math.ceil(documents?.count / pageSize))
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <div className="flex h-full">
                    {/* Explorer view */}
                    <div className="flex-1 p-4">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">NTTDATA</h2>
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Source
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer relative group"
                                >
                                    {item.type === "organization" || item.type === "department" ? (
                                        <Folder className="h-5 w-5 text-[#FF6B35]" />
                                    ) : (
                                        <Folder className="h-5 w-5 text-[#FFD700]" />
                                    )}
                                    <span>{item.name}</span>
                                    <button
                                        className="ml-auto opacity-0 group-hover:opacity-100"
                                        onClick={(e) => handleMenuClick(e, item)}
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown Menu */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <div className="hidden">Trigger</div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    style={{
                        position: "absolute",
                        top: `${dropdownPosition.y}px`,
                        left: `${dropdownPosition.x}px`,
                    }}
                    className="w-44 bg-gray-200 p-0"
                >
                    {activeItem?.type === "organization" && (
                        <>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("department")}
                            >
                                New Department
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("folder")}
                            >
                                New Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" onClick={() => setIsModalOpen(true)}>
                                New Source
                            </DropdownMenuItem>
                        </>
                    )}

                    {activeItem?.type === "department" && (
                        <>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("sub-department")}
                            >
                                New Sub-Department
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("folder")}
                            >
                                New Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                New Source
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("department", true)}
                            >
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" onClick={() => handleDeleteDepartment()}>
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}

                    {activeItem?.type === "sub-department" && (
                        <>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("sub-department")}
                            >
                                New Sub-Department
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("folder")}
                            >
                                New Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                New Source
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("sub-department", true)}
                            >
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" onClick={() => handleDeleteDepartment()}>
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}

                    {activeItem?.type === "folder" && (
                        <>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("folder")}
                            >
                                New Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                New Source
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2"
                                onClick={() => createNewItem("folder", true)}
                            >
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" onClick={() => handleDeleteDepartment()}>
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Create Department Dialog */}
            <Dialog open={isCreateDepartmentOpen} onOpenChange={setIsCreateDepartmentOpen} modal={true}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isRename ? "Update" : "Create new"} Department</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Untitled folder"
                            className="w-full"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeAllDialogs}>
                            Cancel
                        </Button>
                        {isRename ? (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => handleRenameDepartment()}>
                                Update
                            </Button>
                        ) : (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("department")}>
                                Create
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Sub-Department Dialog */}
            <Dialog open={isCreateSubDepartmentOpen} onOpenChange={setIsCreateSubDepartmentOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isRename ? "Update" : "Create new"} Sub-Department</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Untitled folder"
                            className="w-full"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeAllDialogs}>
                            Cancel
                        </Button>
                        {isRename ? (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => handleRenameDepartment()}>
                                Update
                            </Button>
                        ) : (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("sub-department")}>
                                Create
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Folder Dialog */}
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isRename ? "Update" : "Create new"} Folder</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Untitled folder"
                            className="w-full"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeAllDialogs}>
                            Cancel
                        </Button>
                        {isRename ? (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => handleRenameDepartment()}>
                                Update
                            </Button>
                        ) : (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("folder")}>
                                Create
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Source Dialog */}
            <Dialog open={isCreateSourceOpen} onOpenChange={setIsCreateSourceOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle> {isRename ? "Update" : "Create new"} Source</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Untitled source"
                            className="w-full"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeAllDialogs}>
                            Cancel
                        </Button>
                        {isRename ? (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => handleRenameDepartment()}>
                                Update
                            </Button>
                        ) : (
                            <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("source")}>
                                Create
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

