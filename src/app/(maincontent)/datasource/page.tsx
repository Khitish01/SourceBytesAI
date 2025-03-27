// "use client";

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useLanguage } from "@/context/LanguageContext";

// export default function DataSourcePage() {
//     const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(true);
//     const [isSourceCodeOpen, setIsSourceCodeOpen] = useState(true);
//     const router = useRouter();
//     const { translations } = useLanguage();

//     // State to track which item is currently clicked/actively pressed
//     const [activeItem, setActiveItem] = useState(null);

//     const handleNavigation = (path: string) => {
//         router.push(path); // Navigate to the specified path
//     };

//     return (
//         <div className="md:p-5 py-5 font-sans">
//             <div className="mb-8">
//                 <button
//                     className="flex items-center mb-3 text-gray-800 text-xl font-semibold focus:outline-none"
//                     onClick={() => setIsKnowledgeOpen(!isKnowledgeOpen)}
//                 >
//                     {/* Knowledge Management */}
//                     {translations?.data_source?.title1}
//                     <ChevronDown
//                         className={`w-5 h-5 ml-2 transition-transform duration-200 ${isKnowledgeOpen ? "rotate-180" : ""}`}
//                     />
//                 </button>

//                 {isKnowledgeOpen && (
//                     <div className="flex gap-8 md:p-6 w-fit flex-wrap">
//                         {/* Import Knowledge Section */}
//                         <div className="flex-1 bg-gray-100 rounded-xl p-6 flex flex-col items-center">
//                             <h2 className="text-xl font-semibold mb-6">{translations?.data_source?.sub_title1}</h2>
//                             <div className="flex gap-5">
//                                 {[
//                                     { label: translations?.data_source?.text1, icon: "Group.svg", path: "/web" },
//                                     { label: translations?.data_source?.text2, icon: "Vector.svg", path: "/ImportFile" },
//                                 ].map((item, index) => (
//                                     <div
//                                         key={index}
//                                         className={`bg-white rounded-lg p-6 text-center w-[120px] h-[120px] shadow-sm flex flex-col justify-center items-center cursor-pointer transition-colors ${activeItem === item.label ? "bg-blue-100 border border-blue-300" : "hover:bg-blue-50"
//                                             }`}
//                                         onClick={() => handleNavigation(item.path)}
//                                     >
//                                         <img
//                                             src={`/${item.icon}`}
//                                             alt={item.label}
//                                             className="w-[40px] mb-2"
//                                         />
//                                         <p className="text-sm font-medium">{item.label}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Setup Auto-Syncing Section */}
//                         <div className="flex-1 bg-gray-100 rounded-xl p-6 w-fit flex flex-col items-center">
//                             <h2 className="text-xl font-semibold mb-6 whitespace-nowrap">
//                                 {/* Setup Auto-Syncing from Apps */}
//                                 {translations?.data_source?.title2}
//                             </h2>
//                             <div
//                                 className={`bg-white rounded-lg p-6 text-center w-[120px] h-[120px] shadow-sm flex flex-col justify-center items-center cursor-pointer transition-colors ${activeItem === "Google Drive" ? "bg-blue-100 border border-blue-300" : "hover:bg-blue-50"
//                                     }`}
//                                 onClick={() => handleNavigation("/ImportGdrive")}
//                                 onMouseLeave={() => setActiveItem(null)}
//                             >
//                                 <img src="/Group1.svg" alt="Google Drive" className="w-[40px] mb-2" />
//                                 <p className="text-sm font-medium">{translations?.data_source?.text3}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div>
//                 <button
//                     className="flex items-center mb-3 text-gray-800 text-xl font-semibold focus:outline-none"
//                     onClick={() => setIsSourceCodeOpen(!isSourceCodeOpen)}
//                 >
//                     {translations?.data_source?.title2}
//                     <ChevronDown
//                         className={`w-5 h-5 ml-2 transition-transform duration-200 ${isSourceCodeOpen ? "rotate-180" : ""}`}
//                     />
//                 </button>

//                 {isSourceCodeOpen && (
//                     <div className="flex p-6 w-fit">
//                         <div className="bg-gray-100 rounded-xl p-6 w-fit flex flex-col items-center">
//                             <h2 className="text-lg font-semibold mb-4">{translations?.data_source?.sub_title3}</h2>
//                             <div className="flex items-center gap-4">
//                                 <div
//                                     className={`bg-white rounded-lg p-6 text-center w-[120px] h-[120px] shadow-sm flex flex-col justify-center items-center cursor-pointer transition-colors ${activeItem === "Code File" ? "bg-blue-100 border border-blue-300" : "hover:bg-blue-50"
//                                         }`}
//                                     onClick={() => handleNavigation("/ImportCodeFile")}
//                                     onMouseLeave={() => setActiveItem(null)}
//                                 >
//                                     <div className="w-10 h-10 mb-2 flex items-center justify-center">
//                                         <img src="/Group2.svg" alt="Code File" className="w-8 h-8" />
//                                     </div>
//                                     <p className="text-sm font-medium">{translations?.data_source?.text4}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }





"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Folder, File, MoreHorizontal, Plus, ChevronDown, ChevronRight, Bell, Layout, User, MoreVertical, EllipsisVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import FileUploadModal from "@/components/FileUploadModal"
import { getDepartmentList } from "@/components/apicalls/department"
import { getOrganisationDetails } from "@/components/apicalls/organisation"
import Loader from "@/components/Loader"
import { getFileList } from "@/components/apicalls/tenant-file"
import dayjs from "dayjs"

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

    // {
    //     id: "nttdata",
    //     name: "NTTDATA",
    //     type: "organization",
    //     expanded: true,
    //     children: [
    //         {
    //             id: "hr",
    //             name: "HR",
    //             type: "department",
    //             expanded: false,
    //             children: [
    //                 {
    //                     id: "payroll-policy",
    //                     name: "Payroll Policy",
    //                     type: "folder",
    //                 },
    //                 {
    //                     id: "leave-policy",
    //                     name: "Leave Policy",
    //                     type: "folder",
    //                 },
    //             ],
    //         },
    //         {
    //             id: "finance",
    //             name: "Finance",
    //             type: "department",
    //         },
    //     ],
    // }


    // Sample files for the file explorer view
    const [files, setFiles] = useState<FileItem[]>([
        {
            id: "1",
            name: "IndoSakura.pdf",
            status: "Uploading...",
            lastSync: "03:00:54 | 11-03-2024",
            size: "34 KB",
            syncNow: "-",
        },
        {
            id: "2",
            name: "https://apps...",
            status: "Ready to Sync",
            lastSync: "03:00:54 | 11-03-2024",
            size: "34 KB",
            syncNow: "↻",
        },
        {
            id: "3",
            name: "IndoSakura.pdf",
            status: "Processing!",
            lastSync: "03:00:54 | 11-03-2024",
            size: "34 KB",
            syncNow: "↻",
        },
        {
            id: "4",
            name: "https://apps...",
            status: "Not Accepted",
            lastSync: "03:00:54 | 11-03-2024",
            size: "34 KB",
            syncNow: "-",
        },
        {
            id: "5",
            name: "IndoSakura.pdf",
            status: "Ready",
            lastSync: "03:00:54 | 11-03-2024",
            size: "34 KB",
            syncNow: "↻",
        },
    ])

    // State for dialogs
    const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false)
    const [isCreateSubDepartmentOpen, setIsCreateSubDepartmentOpen] = useState(false)
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
    const [isCreateSourceOpen, setIsCreateSourceOpen] = useState(false)
    const [newItemName, setNewItemName] = useState("Untitled folder")
    const [currentParentId, setCurrentParentId] = useState<string | null>(null)

    // State for dropdown menu
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [activeItem, setActiveItem] = useState<Item | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [path, setPath] = useState<any[] | undefined>([]);
    const [orgDetails, setOrgDetails] = useState<any>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    // State for file view
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedView, setSelectedView] = useState<"list" | "explorer">("list")
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [fileContextMenuOpen, setFileContextMenuOpen] = useState(false)
    const [fileContextMenuPosition, setFileContextMenuPosition] = useState({ x: 0, y: 0 })

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

    // Handle three-dot menu click
    const handleMenuClick = (e: React.MouseEvent, item: Item) => {
        e.stopPropagation()
        setActiveItem(item)
        setCurrentParentId(item.id)
        setDropdownPosition({ x: e.clientX, y: e.clientY })
        setIsDropdownOpen(true)
    }

    // Create new item
    const createNewItem = (type: ItemType) => {
        if (!activeItem) return

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
    const addNewItem = (type: ItemType) => {
        if (!currentParentId) return

        const newId = `${type}-${Date.now()}`
        const newItem: Item = {
            id: newId,
            name: newItemName,
            type: type,
        }

        setItems((prevItems) => {
            const updateItems = (items: Item[]): Item[] => {
                return items.map((item) => {
                    if (item.id === currentParentId) {
                        return {
                            ...item,
                            expanded: true,
                            children: [...(item.children || []), newItem],
                        }
                    }
                    if (item.children) {
                        return { ...item, children: updateItems(item.children) }
                    }
                    return item
                })
            }
            return updateItems(prevItems)
        })

        // Reset state
        setNewItemName("Untitled folder")
        setCurrentParentId(null)
        closeAllDialogs()
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

        return [
            {
                id: orgDetails?.id,
                name: orgDetails?.name,
                type: "organization",
                expanded: false,
                children: apiData
                    .filter(dept => dept.parent === null)
                    .map(dept => ({
                        ...dept,
                        type: dept?.is_folder ? 'folder' : 'department',
                        expanded: false,
                        children: dept.sub_departments.map((subDept: any) => ({
                            ...subDept,
                            type: subDept.is_folder ? "folder" : "sub-department",
                        })),
                    })),
            },
        ];
    };

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
        const orgDetails = await getOrganisationDetails(token, tenant_id);
        console.log(orgDetails);

        setOrgDetails(orgDetails)
        const response = await getDepartmentList(token, tenant_id);
        if (response.success) {
            console.log(response.data.results);

            const apiData = transformData(orgDetails.data, response.data.results);
            setItems(apiData);
            // setSyncStatuses(new Map(apiData.map((file: FileData) => [file.id, { status: "idle" }])));
        } else {
            setError(response.error);
        }
        setLoading(false);
    };
    const getDocumentList = async (department_id: string, page: number, pageSize: number) => {
        console.log('sssssssssss');
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
        const response = await getFileList(token, tenant_id, department_id, page,pageSize);
        if (response.success) {
            console.log(response.data.results);

            // const apiData = transformData(orgDetails.data, response.data.results);
            setDocuments(response?.data);
            // setSyncStatuses(new Map(apiData.map((file: FileData) => [file.id, { status: "idle" }])));
        } else {
            setError(response.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCodeFiles();
    }, []);

    // Render tree item
    const isFolder = (name: string): boolean => {
        // debugger
        for (const department of items?.[0]?.children || []) {
            if (department.name === name && department.is_folder) {
                return true;
            }
            for (const subDept of department.children || []) {
                if (subDept.name === name && subDept.is_folder) {
                    return true;
                }
            }
        }
        return false;
    };

    const renderTreeItem = (item: Item, level = 0) => {
        const isExpandable = item.children && item.children.length > 0
        // console.log(isExpandable);

        const paddingLeft = level * 16

        return (
            <div key={item.id}>
                <div
                    className={cn("flex items-center py-2 px-2 hover:bg-gray-100 cursor-pointer", level === 0 && "font-medium", isSelected && item.id == selectedItem?.id && "bg-gray-100")}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={() => {
                        // if (item.type !== "organization") {
                        setIsSelected(true);
                        setCurrentPage(1);
                        getDocumentList(item.type !== "organization" ? item?.id : '', 1, pageSize);
                        let selectedPath: any = item?.path?.split('/')
                        console.log(selectedPath);
                        selectedPath?.[0] == '' ? selectedPath[0] = orgDetails?.data?.name : selectedPath = [orgDetails?.data?.name]
                        selectedPath = selectedPath?.map((x: any, i: number) => ({ is_folder: isFolder(x), name: x }))
                        setPath(selectedPath);

                        console.log(item);
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

                    <button
                        className="hover:bg-gray-200 p-1 rounded"
                        onClick={(e) => handleMenuClick(e, item)}
                    >
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
                    <div className={`w-64 ${isSelected ? 'border-r' : ''} overflow-auto`}>{items.map((item) => renderTreeItem(item))}</div>

                    {/* Main content */}
                    {isSelected ? (
                        <div className="flex-1 p-4">
                            <div className="flex justify-between mb-4">
                                <div className="text-xl font-semibold flex gap-2">

                                    {path && path.map((item: any, index: number) => (
                                        <span className="flex gap-3 items-center" key={index}>
                                            {index == 0 ? (

                                                <img src="/organisation.svg" alt="" className="h-4 w-4 " />
                                            ) : (

                                                item?.is_folder ?
                                                    <img src="/folder-icon.svg" alt="" className="h-4 w-4" /> :
                                                    <img src="/department.svg" alt="" className="h-4 w-4" />
                                            )}
                                            {/* <span>{item}</span> */}
                                            <span>{item?.name}</span>
                                            {index == path.length - 1 ? (
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
                                    onClose={() => setIsModalOpen(false)}
                                />
                            </div>

                            <div className="rounded-md mt-10">
                                <div className="flex items-center justify-between p-4">
                                    <h3 className="font-medium">Data Source:</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Input className="pl-8 w-64" placeholder="Type to search" />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-md">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-md">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 rounded-3xl mb-3 ">
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <span className="text-sm font-medium">3 selected</span>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button className="p-1 hover:bg-gray-200 rounded">
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
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded">
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
                                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded">
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
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded">
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
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded">
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
                                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded">
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
                                                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b">
                                                <th className="w-8 p-3 text-left">
                                                    <input type="checkbox" className="rounded" />
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

                                            {documents?.results && documents?.results.map((doc: any) => (
                                                // <></>
                                                <tr key={doc?.id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3">
                                                        <input type="checkbox" className="rounded" />
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 bg-yellow-100 flex items-center justify-center rounded">
                                                                <File className="h-3 w-3 text-yellow-600" />
                                                            </div>
                                                            <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-60">{doc?.original_filename}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="text-orange-500">{doc?.upload_status}</span>
                                                    </td>
                                                    <td className="p-3">{doc?.last_sync ? dayjs(doc?.last_sync).format('hh:mm:ss | DD-MM-YYYY') : '-'}</td>
                                                    <td className="p-3">{doc?.file_size_kb}</td>
                                                    <td className="p-3">
                                                        <button className="text-gray-500 hover:text-gray-700">
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
                                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                />
                                                            </svg>
                                                        </button>

                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <button className="hover:text-gray-700">
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
                                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button className="hover:text-gray-700">
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
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button className="hover:text-gray-700">
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
                                                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button className="hover:text-gray-700">
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
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {documents?.results?.length == 0 && (
                                                // <></>
                                                <tr>
                                                    <td colSpan={6} className="text-center py-20">
                                                        <span>No Data Found</span>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-3 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>Show</span>
                                        <select className="border rounded px-2 py-1" value={pageSize} onChange={(e) => {
                                            setPageSize(Number(e.target.value))
                                            getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : '', 1, Number(e.target.value))
                                        }}>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span>entries</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="border rounded p-1" disabled={documents?.results?.length == 0 || currentPage == 1} onClick={() => {
                                            getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : '', 1, pageSize)
                                            setCurrentPage(1);
                                        }}>
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
                                        <button className="border rounded p-1" disabled={documents?.results?.length == 0 || currentPage == 1} onClick={() => {
                                            getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : '', currentPage - 1, pageSize)
                                            setCurrentPage(currentPage - 1);
                                        }}>
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
                                        <span className="px-2">Page {currentPage} of {Math.ceil(documents?.count / pageSize)}</span>
                                        <button className="border rounded p-1" disabled={documents?.results?.length == 0 || currentPage == Math.ceil(documents?.count / pageSize)} onClick={() => {
                                            getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : '', currentPage + 1, pageSize)
                                            setCurrentPage(currentPage + 1);
                                        }}>
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
                                        <button className="border rounded p-1" disabled={documents?.results?.length == 0 || currentPage == Math.ceil(documents?.count / pageSize)} onClick={() => {
                                            getDocumentList(selectedItem.type !== "organization" ? selectedItem?.id : '', Math.ceil(documents?.count / pageSize), pageSize)
                                            setCurrentPage(Math.ceil(documents?.count / pageSize));
                                        }}>
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
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("department")}>New Department</DropdownMenuItem>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("folder")}>New Folder</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" onClick={() => setIsModalOpen(true)}>New Source</DropdownMenuItem>
                        </>
                    )}

                    {activeItem?.type === "department" && (
                        <>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("sub-department")}>New Sub-Department</DropdownMenuItem>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("folder")}>New Folder</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" onClick={() => setIsModalOpen(true)}>New Source</DropdownMenuItem>
                        </>
                    )}

                    {activeItem?.type === "sub-department" && (
                        <>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("sub-department")}>New Sub-Department</DropdownMenuItem>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("folder")}>New Folder</DropdownMenuItem>
                            <DropdownMenuItem className=" rounded-none px-4 py-2" onClick={() => setIsModalOpen(true)}>New Source</DropdownMenuItem>
                        </>
                    )}

                    {activeItem?.type === "folder" && (
                        <>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => createNewItem("folder")}>New Folder</DropdownMenuItem>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" onClick={() => setIsModalOpen(true)}>New Source</DropdownMenuItem>
                            <DropdownMenuItem className="border-b-[1px] border-b-gray-300 rounded-none px-4 py-2" >Rename</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-none px-4 py-2" >Delete</DropdownMenuItem>
                        </>
                    )}

                </DropdownMenuContent>
            </DropdownMenu>

            {/* Create Department Dialog */}
            <Dialog open={isCreateDepartmentOpen} onOpenChange={setIsCreateDepartmentOpen} modal={true}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create new Department</DialogTitle>
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
                        <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("department")}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Sub-Department Dialog */}
            <Dialog open={isCreateSubDepartmentOpen} onOpenChange={setIsCreateSubDepartmentOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create new Sub-Department</DialogTitle>
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
                        <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("sub-department")}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Folder Dialog */}
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create new Folder</DialogTitle>
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
                        <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("folder")}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Source Dialog */}
            <Dialog open={isCreateSourceOpen} onOpenChange={setIsCreateSourceOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create new Source</DialogTitle>
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
                        <Button className="bg-[#FF6B35] hover:bg-[#FF8C5A]" onClick={() => addNewItem("source")}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

