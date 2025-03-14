"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, File, Search } from "lucide-react";
import ReusableTable from "@/components/ReusableTable";
import CodeFileUploaderPage from "@/components/CodeFileUploaderPage";
import { useLanguage } from "@/context/LanguageContext";
import { getCodeFiles, syncCodeFile, downloadCodeFile, deleteCodeFile } from "@/components/apicalls/importcodefiles";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import TurndownService from "turndown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface FileData {
    id: string;
    name: string;
    status: string;
    lastModified: string;
    size: string;
    code_file: string;
    isStaged?: boolean;
    type?: string;
}

const CodeFileImportPage = () => {
    const [data, setData] = useState<FileData[]>([]);
    const [syncStatuses, setSyncStatuses] = useState<
        Map<string, { status: "idle" | "pending" | "success" | "failure"; lastSync?: string; statusCode?: number }>
    >(new Map());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewContent, setPreviewContent] = useState<string>("");

    const { translations } = useLanguage();
    const { toast } = useToast();
    const turndownService = new TurndownService();

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

        const response = await getCodeFiles(token, tenant_id);
        if (response.success) {
            const apiData = response.data.data.results.map((item: any) => ({
                id: item.id,
                name: item.code_file_name,
                status: item.status as FileData["status"],
                lastModified: new Date(item.uploaded_at).toISOString().split("T")[0],
                size: item.code_file_size_kb,
                code_file: item.code_file,
            }));
            setData(apiData);
            setSyncStatuses(new Map(apiData.map((file: FileData) => [file.id, { status: "idle" }])));
        } else {
            setError(response.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCodeFiles();
    }, []);

    const syncFile = async (fileId: string) => {
        setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "pending" }));
        const authDetailsString = sessionStorage.getItem("authDetails");
        if (!authDetailsString) {
            setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "failure" }));
            setError("No authentication details found");
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Authentication_details_missing || "Authentication details missing",
                variant: "destructive",
            });
            return;
        }

        let authDetails;
        try {
            authDetails = JSON.parse(authDetailsString);
        } catch (e) {
            setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "failure" }));
            setError("Failed to parse auth details");
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Failed_to_parse_authentication_details || "Failed to parse authentication details",
                variant: "destructive",
            });
            return;
        }

        const token = authDetails.data?.token;
        const tenant_id = authDetails.data?.tenant_id;

        if (!token || !tenant_id) {
            setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "failure" }));
            setError("Token or tenant_id missing");
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Token_or_tenant_id_missing || "Token or tenant_id missing",
                variant: "destructive",
            });
            return;
        }

        const fileToSync = data.find((file) => file.id === fileId);
        if (!fileToSync || !fileToSync.code_file) {
            setSyncStatuses((prev) => new Map(prev).set(fileId, { status: "failure" }));
            setError("File not found or missing code_file path");
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.File_not_found_or_missing_code_file_path || "File not found or missing code_file path",
                variant: "destructive",
            });
            return;
        }

        const syncForm = {
            codefile_id: fileToSync.id,
            codefile_path: fileToSync.code_file,
            status: fileToSync.status,
        };

        const response = await syncCodeFile(token, tenant_id, syncForm);
        if (response.success) {
            setSyncStatuses((prev) =>
                new Map(prev).set(fileId, {
                    status: "success",
                    lastSync: new Date().toISOString(),
                    statusCode: 200,
                })
            );
            setData((prev) =>
                prev.map((file) =>
                    file.id === fileId ? { ...file, status: "Ready" } : file
                )
            );
        } else {
            const statusCode = response.error.includes("status 400") ? 400 :
                response.error.includes("status 500") ? 500 : null;
            setSyncStatuses((prev) =>
                new Map(prev).set(fileId, {
                    status: "failure",
                    statusCode: statusCode || undefined,
                })
            );
            setError(response.error);
            toast({
                title: translations?.toast?.Sync_Failed || "Sync Failed",
                description: response.error,
                variant: "destructive",
            });
        }
    };

    const handleUploadSuccess = async () => {
        await fetchCodeFiles();
    };

    const handleDownload = async (e: React.MouseEvent, fileId: string, fileName: string) => {
        e.preventDefault(); // Prevent default behavior
        e.stopPropagation(); // Stop event propagation
        console.log("handleDownload started for file:", fileName);

        const authDetailsString = sessionStorage.getItem("authDetails");
        if (!authDetailsString) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Authentication_details_missing || "Authentication details missing",
                variant: "destructive",
            });
            return;
        }

        let authDetails;
        try {
            authDetails = JSON.parse(authDetailsString);
        } catch (e) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Failed_to_parse_authentication_details || "Failed to parse authentication details",
                variant: "destructive",
            });
            return;
        }

        const token = authDetails.data?.token;
        const tenant_id = authDetails.data?.tenant_id;

        if (!token || !tenant_id) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Token_or_tenant_id_missing || "Token or tenant_id missing",
                variant: "destructive",
            });
            return;
        }

        setLoading(true); // Show loader during download
        try {
            const response = await downloadCodeFile(token, tenant_id, fileId);
            console.log("DownloadCodeFile API Response:", response);

            if (response.success) {
                const { html_content } = response.data;
                console.log("HTML content received:", html_content.substring(0, 100) + "...");

                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = html_content;
                document.body.appendChild(tempDiv);
                console.log("Temp div created");

                const canvas = await html2canvas(tempDiv);
                console.log("Canvas created");

                const imgData = canvas.toDataURL("image/png");
                const doc = new jsPDF();
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                document.body.removeChild(tempDiv);
                console.log("PDF generation completed");

                doc.save(`${fileName.split(".")[0]}.pdf`);
                console.log("PDF saved");

                toast({
                    title: translations?.toast?.Success || "Success",
                    description:
                        (translations?.toast?.File || "File") +
                        ` ${fileName} ` +
                        (translations?.toast?.downloaded_as_PDF_successfully || "downloaded as PDF successfully"),
                    variant: "success",
                });
            } else {
                toast({
                    title: translations?.toast?.Download_Failed || "Download Failed",
                    description: response.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error in handleDownload:", error);
            toast({
                title: translations?.toast?.Error || "Error",
                description: "An unexpected error occurred during download",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (fileId: string, fileName: string) => {
        const authDetailsString = sessionStorage.getItem("authDetails");
        if (!authDetailsString) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Authentication_details_missing || "Authentication details missing",
                variant: "destructive",
            });
            return;
        }

        let authDetails;
        try {
            authDetails = JSON.parse(authDetailsString);
        } catch (e) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Failed_to_parse_authentication_details || "Failed to parse authentication details",
                variant: "destructive",
            });
            return;
        }

        const token = authDetails.data?.token;
        const tenant_id = authDetails.data?.tenant_id;

        if (!token || !tenant_id) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Token_or_tenant_id_missing || "Token or tenant_id missing",
                variant: "destructive",
            });
            return;
        }

        const response = await downloadCodeFile(token, tenant_id, fileId);
        if (response.success) {
            setPreviewContent(response.data.html_content);
            setShowPreviewModal(true);
        } else {
            toast({
                title: translations?.toast?.Preview_Failed || "Preview Failed",
                description: response.error,
                variant: "destructive",
            });
        }
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
        setPreviewContent("");
    };

    const confirmDelete = async () => {
        if (!fileToDelete) return;

        const authDetailsString = sessionStorage.getItem("authDetails");
        if (!authDetailsString) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Authentication_details_missing || "Authentication details missing",
                variant: "destructive",
            });
            setShowDeleteModal(false);
            setFileToDelete(null);
            return;
        }

        let authDetails;
        try {
            authDetails = JSON.parse(authDetailsString);
        } catch (e) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Failed_to_parse_authentication_details || "Failed to parse authentication details",
                variant: "destructive",
            });
            setShowDeleteModal(false);
            setFileToDelete(null);
            return;
        }

        const token = authDetails.data?.token;
        const tenant_id = authDetails.data?.tenant_id;

        if (!token || !tenant_id) {
            toast({
                title: translations?.toast?.Error || "Error",
                description: translations?.toast?.Token_or_tenant_id_missing || "Token or tenant_id missing",
                variant: "destructive",
            });
            setShowDeleteModal(false);
            setFileToDelete(null);
            return;
        }

        setLoading(true);
        const response = await deleteCodeFile(token, tenant_id, fileToDelete.id);
        setLoading(false);

        if (response.success) {
            setData((prev) => prev.filter((file) => file.id !== fileToDelete.id));
            setSyncStatuses((prev) => {
                const newMap = new Map(prev);
                newMap.delete(fileToDelete.id);
                return newMap;
            });
            toast({
                title: translations?.toast?.Success || "Success",
                description:
                    (translations?.toast?.File || "File") +
                    ` ${fileToDelete.name} ` +
                    (translations?.toast?.deleted_successfully || "deleted successfully"),
                variant: "success",
            });
        } else {
            toast({
                title: translations?.toast?.Delete_Failed || "Delete Failed",
                description: response.error || "Failed to delete file",
                variant: "destructive",
            });
        }

        setShowDeleteModal(false);
        setFileToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setFileToDelete(null);
    };

    const fields = [
        {
            key: "name",
            label: translations?.code_file?.Name || "Name",
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
            label: translations?.code_file?.Status || "Status",
            sortable: false,
            render: (value: FileData["status"]) => {
                const statusStyles: Record<FileData["status"], string> = {
                    "Processing!": "text-blue-500",
                    "Ready to Sync": "text-gray-500",
                    "Not Accepted": "text-red-500",
                    Ready: "text-green-500",
                };
                return <span className={`font-medium ${statusStyles[value]}`}>{value}</span>;
            },
        },
        {
            key: "lastModified",
            label: translations?.code_file?.Last_Modified || "Last Modified",
            sortable: false,
        },
        {
            key: "sync",
            label: translations?.code_file?.Sync || "Sync",
            sortable: false,
            render: (_: any, row: FileData) => {
                if (row.isStaged) return null;
                const syncState = syncStatuses.get(row.id) || { status: "idle" };
                const colorClass =
                    syncState.statusCode === 200 ? "text-orange-500" :
                        syncState.statusCode === 500 ? "text-red-500" :
                            syncState.statusCode === 400 ? "text-blue-500" :
                                "";

                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => syncFile(row.id)}
                        className="mx-auto flex"
                        disabled={syncState.status === "pending"}
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${colorClass} ${syncState.status === "pending" ? "animate-spin" : ""}`}
                        />
                    </Button>
                );
            },
        },
        { key: "size", label: translations?.code_file?.Size || "Size" },
    ];

    const icons = [
        {
            key: "download",
            icon: <Download className="h-4 w-4" />,
            onClick: (row: FileData) => (e: React.MouseEvent) => handleDownload(e, row.id, row.name),
            condition: (row: FileData) => !row.isStaged,
        },
        {
            key: "view",
            icon: <img src="/Eye.svg" alt="View file" className="w-5 h-5" />,
            onClick: (row: FileData) => () => handlePreview(row.id, row.name), // No event needed here
            condition: (row: FileData) => !row.isStaged,
        },
        {
            key: "send",
            icon: <img src="/send-3.svg" alt="Send file" className="w-5 h-5" />,
            onClick: (row: FileData) => () => console.log(`Sending ${row.name}`), // No event needed
            condition: (row: FileData) => row.status === "Ready" && !row.isStaged,
        },
        {
            key: "delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (row: FileData) => () => {
                if (row.isStaged) {
                    setStagedFiles((prev) => prev.filter((file: { name: string }) => file.name !== row.name));
                } else {
                    setFileToDelete(row);
                    setShowDeleteModal(true);
                }
            },
        },
    ];

    const displayData = [...data];

    return (
        <>
            <div className="md:p-6 mx-auto">
                <CodeFileUploaderPage onUploadSuccess={handleUploadSuccess} />
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="flex flex-wrap justify-between py-4 items-center px-6">
                        <h2 className="text-lg font-semibold">
                            {translations?.code_file?.Already_Index_websites || "Already Indexed Websites"}
                        </h2>
                        <div className="flex items-center space-x-3">
                            <div className="relative md:w-64">
                                <input
                                    type="text"
                                    placeholder={translations?.code_file?.Type_to_search || "Type to search"}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={""}
                                    onChange={(e) => console.log(e.target.value)}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <img src="/filter-tick.svg" alt="Filter" className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <img src="/document-download.svg" alt="Download" className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
                <ReusableTable
                    data={displayData}
                    fields={fields}
                    icons={icons}
                    pageSize={10}
                    selectable={true}
                    onSelectionChange={(selectedIds) => console.log("Selected rows:", selectedIds)}
                />
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h3 className="text-lg font-semibold mb-4">
                                {translations?.ImportFile?.Want_to_Delete_Code_File || "Want to Delete Code File?"}
                            </h3>
                            <p className="mb-6">
                                {translations?.ImportFile?.Are_you_sure_you_want_to_delete || "Are you sure you want to delete"}{" "}
                                <span className="font-bold">{fileToDelete?.name}</span>?{" "}
                                {translations?.ImportFile?.This_action_cannot_be_undone ||
                                    "This action cannot be undone"}
                            </p>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    variant="destructive"
                                    onClick={confirmDelete}
                                    className="bg-orange-500 hover:bg-orange-600"
                                    disabled={loading}
                                >
                                    {loading ? <Loader size="sm" className="mr-2" /> : null}
                                    {translations?.ImportFile?.Continue || "Continue"}
                                </Button>
                                <Button variant="outline" onClick={cancelDelete} className="text-gray-700">
                                    {translations?.ImportFile?.Cancel || "Cancel"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {showPreviewModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                {translations?.ImportFile?.Preview_Document || "Preview Document"}
                            </h3>
                            <div
                                className="border p-4 rounded bg-gray-50"
                                dangerouslySetInnerHTML={{ __html: previewContent }}
                            />
                            <div className="flex justify-end mt-4">
                                <Button variant="outline" onClick={closePreviewModal} className="text-gray-700">
                                    {translations?.ImportFile?.Close || "Close"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loading && !showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <Loader size="lg" className="text-white" />
                </div>
            )}
        </>
    );
};

function setStagedFiles(arg0: (prev: any) => any) {
    console.log("setStagedFiles called with:", arg0);
}

export default CodeFileImportPage;