"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, Trash2, RefreshCw, Upload, File, X } from "lucide-react"
import ReusableTable from "@/components/ReusableTable"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface FileData {
    id: string
    name: string
    status: "Processing!" | "Ready to Sync" | "Not Accepted" | "Ready"
    lastModified: string
    size: string
    isStaged?: boolean // Flag to indicate staged (not yet uploaded) files
    type?: string
}

const CodeFileImportPage = () => {
    const [data, setData] = useState<FileData[]>([
        { id: "1", name: "Document 1", status: "Ready", lastModified: "2023-05-15", size: "1.2 MB" },
        { id: "2", name: "Document 2", status: "Not Accepted", lastModified: "2023-05-14", size: "2.5 MB" },
        { id: "3", name: "Document 3", status: "Processing!", lastModified: "2023-05-13", size: "0.8 MB" },
    ])

    // Track sync status for each file
    const [syncStatuses, setSyncStatuses] = useState<
        Map<string, { status: "idle" | "pending" | "success" | "failure"; lastSync?: string }>
    >(new Map(data.map((file) => [file.id, { status: "idle" }])))

    // Modal state for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [fileToDelete, setFileToDelete] = useState<FileData | null>(null)

    // Staged files before upload
    const [stagedFiles, setStagedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Upload progress state
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    // File type validation
    const allowedFileTypes = [".txt", ".pdf", ".doc", ".docx"]
    const maxFileSize = 10 * 1024 * 1024 // 10MB

    // Simulated async API call for sync
    const syncFile = async (fileId: string) => {
        setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "pending" }))
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const success = Math.random() > 0.2
            if (success) {
                setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "success", lastSync: new Date().toISOString() }))
            } else {
                throw new Error("Sync failed")
            }
        } catch (error) {
            setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "failure" }))
        }
    }

    // Handle delete confirmation
    const confirmDelete = () => {
        if (fileToDelete) {
            console.log(`Deleting ${fileToDelete.name}`)
            setData((prev) => prev.filter((file) => file.id !== fileToDelete.id))
            setSyncStatuses((prev) => {
                const newMap = new Map(prev)
                newMap.delete(fileToDelete.id)
                return newMap
            })
            setShowDeleteModal(false)
            setFileToDelete(null)
        }
    }

    // Cancel delete
    const cancelDelete = () => {
        setShowDeleteModal(false)
        setFileToDelete(null)
    }

    // Validate file before staging
    const validateFile = useCallback(
        (file: File): { valid: boolean; reason?: string } => {
            // Check file size
            if (file.size > maxFileSize) {
                return { valid: false, reason: `File size exceeds the maximum limit of 10MB` }
            }

            // Check file type
            const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
            if (!allowedFileTypes.includes(fileExtension)) {
                return { valid: false, reason: `File type ${fileExtension} is not supported` }
            }

            return { valid: true }
        },
        [allowedFileTypes, maxFileSize],
    )

    // Process files into FileData format (for staging)
    const stageFiles = useCallback(
        (files: File[]) => {
            setUploadError(null)

            // Filter out invalid files and duplicates
            const validFiles: File[] = []
            const invalidFiles: { file: File; reason: string }[] = []

            for (const file of files) {
                // Check for duplicates
                if (stagedFiles.some((f) => f.name === file.name) || data.some((f) => f.name === file.name)) {
                    invalidFiles.push({ file, reason: "File with the same name already exists" })
                    continue
                }

                // Validate file
                const validation = validateFile(file)
                if (validation.valid) {
                    validFiles.push(file)
                } else {
                    invalidFiles.push({ file, reason: validation.reason || "Invalid file" })
                }
            }

            // Show toast notifications for invalid files
            if (invalidFiles.length > 0) {
                invalidFiles.forEach(({ file, reason }) => {
                    toast({
                        title: "File not accepted",
                        description: `${file.name}: ${reason}`,
                        variant: "destructive",
                    })
                })
            }

            // Add valid files to staged files
            if (validFiles.length > 0) {
                setStagedFiles((prev) => [...prev, ...validFiles])
                toast({
                    title: "Files selected",
                    description: `${validFiles.length} file(s) ready to upload`,
                    variant: "default",
                })
            }
        },
        [data, stagedFiles, validateFile],
    )

    // Handle file upload (called on button click)
    const handleUpload = async () => {
        if (stagedFiles.length === 0) return

        setIsUploading(true)
        setUploadProgress(0)
        setUploadError(null)

        // Simulate upload progress
        const totalFiles = stagedFiles.length
        let uploadedFiles = 0

        try {
            for (const file of stagedFiles) {
                // Simulate file upload with progress
                await new Promise<void>((resolve, reject) => {
                    let progress = 0
                    const interval = setInterval(() => {
                        progress += Math.random() * 10
                        if (progress >= 100) {
                            clearInterval(interval)
                            uploadedFiles++
                            setUploadProgress((uploadedFiles / totalFiles) * 100)
                            resolve()
                        } else {
                            setUploadProgress((uploadedFiles / totalFiles) * 100 + progress / totalFiles)
                        }
                    }, 200)

                    // Simulate random failure (10% chance)
                    if (Math.random() < 0.1) {
                        clearInterval(interval)
                        reject(new Error(`Failed to upload ${file.name}`))
                    }
                })
            }

            // Convert staged files to FileData
            const newFiles: FileData[] = stagedFiles.map((file, index) => ({
                id: `${Date.now()}-${index}`,
                name: file.name,
                status: "Ready to Sync",
                lastModified: new Date(file.lastModified).toISOString().split("T")[0],
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                type: file.type || "unknown",
            }))

            // On success, add to data and reset staged files
            setData((prev) => [...prev, ...newFiles])
            setSyncStatuses((prev) => {
                const newMap = new Map(prev)
                newFiles.forEach((file) => newMap.set(file.id, { status: "idle" }))
                return newMap
            })

            toast({
                title: "Upload complete",
                description: `Successfully uploaded ${stagedFiles.length} file(s)`,
                variant: "default",
            })

            setStagedFiles([])
        } catch (error) {
            console.error("Upload failed:", error)
            setUploadError(error instanceof Error ? error.message : "Upload failed")

            toast({
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Failed to upload files",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    const fields = [
        {
            key: "name",
            label: "Name",
            sortable: false,
            render: (value: string, row: FileData) => (
                <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <span className={row.isStaged ? "italic text-gray-600" : ""}>{value}</span>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: false,
            render: (value: FileData["status"]) => {
                const statusStyles: Record<FileData["status"], string> = {
                    "Processing!": "text-blue-500",
                    "Ready to Sync": "text-gray-500",
                    "Not Accepted": "text-red-500",
                    Ready: "text-green-500",
                }
                return <span className={`font-medium ${statusStyles[value]}`}>{value}</span>
            },
        },
        {
            key: "lastModified",
            label: "Last Modified",
            sortable: false,
            render: (value: string) => value,
        },
        {
            key: "sync",
            label: "Sync",
            sortable: false,
            render: (_: any, row: FileData) => {
                if (row.isStaged) return null // No sync for staged files
                const status = syncStatuses.get(row.id) || { status: "idle" }
                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => syncFile(row.id)}
                        className="mx-auto flex"
                        disabled={status.status === "pending"}
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${status.status === "success" ? "text-[#EF6A37]" : status.status === "failure" ? "text-red-500" : ""} ${status.status === "pending" ? "animate-spin" : ""}`}
                        />
                    </Button>
                )
            },
        },
        { key: "size", label: "Size" },
    ]

    const icons = [
        {
            key: "download",
            icon: <Download className="h-4 w-4" />,
            onClick: (row: FileData) => console.log(`Downloading ${row.name}`),
            condition: (row: FileData) => !row.isStaged, // Disable for staged files
        },
        {
            key: "view",
            icon: <img src="/Eye.svg" alt="View file" className="w-5 h-5" />,
            onClick: (row: FileData) => console.log(`Viewing ${row.name}`),
            condition: (row: FileData) => !row.isStaged,
        },
        {
            key: "send",
            icon: <img src="/send-3.svg" alt="Send file" className="w-5 h-5" />,
            onClick: (row: FileData) => console.log(`Sending ${row.name}`),
            condition: (row: FileData) => row.status === "Ready" && !row.isStaged,
        },
        {
            key: "delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (row: FileData) => {
                if (row.isStaged) {
                    setStagedFiles((prev) => prev.filter((file) => file.name !== row.name))
                } else {
                    setFileToDelete(row)
                    setShowDeleteModal(true)
                }
            },
        },
    ]

    const [dragActive, setDragActive] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files)
                stageFiles(files)
            }
        },
        [stageFiles],
    )

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                const files = Array.from(e.target.files)
                stageFiles(files)
                e.target.value = "" // Reset input
            }
        },
        [stageFiles],
    )

    const handleBrowseClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }, [])

    const handleSelectionChange = (selectedIds: string[]) => {
        console.log("Selected rows:", selectedIds)
    }

    const removeAllStagedFiles = () => {
        setStagedFiles([])
        toast({
            title: "Files cleared",
            description: "All staged files have been removed",
            variant: "default",
        })
    }

    // Combine data and staged files for display
    const displayData = [
        ...stagedFiles.map((file, index) => ({
            id: `staged-${index}`,
            name: file.name,
            status: "Ready to Sync" as const,
            lastModified: new Date(file.lastModified).toISOString().split("T")[0],
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            isStaged: true,
        })),
        ...data,
    ]

    return (
        <div className="p-6 mx-auto">
            <h2 className="text-lg font-semibold mb-4">Upload Files:</h2>
            <div className="bg-gray-100 p-6 rounded-lg mb-6 max-w-xl">
                <h3 className="font-semibold mb-4">Select File:</h3>

                {/* Drag and drop area */}
                <div
                    className={cn(
                        "border-2 border-dashed rounded-md p-8 mb-4 bg-white text-center transition-colors duration-200 relative",
                        dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400",
                    )}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Drop files here or click to browse"
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept={allowedFileTypes.join(",")}
                        aria-label="File input"
                    />

                    <div className="flex flex-col items-center justify-center gap-2">
                        {/* <Upload className="h-10 w-10 text-gray-400" /> */}
                        <p className="text-gray-700 font-medium">Drag and drop files here</p>
                        <p className="text-gray-500 text-sm">or</p>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleBrowseClick()
                            }}
                        >
                            Browse Files
                        </Button>
                        {/* <p className="text-xs text-gray-500 mt-2">Supported formats: {allowedFileTypes.join(", ")} (Max: 10MB)</p> */}
                    </div>
                </div>

                {/* Selected files preview */}
                {stagedFiles.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">Selected Files ({stagedFiles.length})</h4>
                            <Button variant="ghost" size="sm" onClick={removeAllStagedFiles} className="text-gray-500 h-8">
                                Clear All
                            </Button>
                        </div>
                        <div className="max-h-40 overflow-y-auto bg-white rounded-md border border-gray-200 p-2">
                            {stagedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <File className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                        <span className="text-sm truncate" title={file.name}>
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setStagedFiles((prev) => prev.filter((_, i) => i !== index))
                                        }}
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload progress */}
                {isUploading && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Uploading...</span>
                            <span className="text-sm">{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                    </div>
                )}

                {/* Upload error */}
                {uploadError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                )}

                {/* Upload button */}
                <div className="flex justify-center align-middle">
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                        onClick={handleUpload}
                        disabled={stagedFiles.length === 0 || isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                        <img src="/document-upload.svg" alt="Upload icon" className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* File table */}
            <ReusableTable
                data={displayData}
                fields={fields}
                icons={icons}
                pageSize={5}
                selectable={true}
                onSelectionChange={handleSelectionChange}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Want to Delete Code File?</h3>
                        <p className="mb-6">
                            Are you sure you want to delete <span className="font-bold">{fileToDelete?.name}</span>? This action
                            cannot be undone
                        </p>
                        <div className="flex justify-end space-x-4">
                            <Button variant="destructive" onClick={confirmDelete} className="bg-orange-500 hover:bg-orange-600">
                                Continue
                            </Button>
                            <Button variant="outline" onClick={cancelDelete} className="text-gray-700">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CodeFileImportPage

