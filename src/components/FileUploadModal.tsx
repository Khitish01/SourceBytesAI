import { useState, DragEvent, ChangeEvent } from "react";
import { Input } from "./ui/input";

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
    const [fileType, setFileType] = useState<"file" | "web" | "googleDrive">("file");
    const [urltype, setUrlType] = useState<"full" | "single">("full");
    const [files, setFiles] = useState<File[]>([]);

    if (!isOpen) return null;

    const handleFileTypeChange = (type: "file" | "web" | "googleDrive") => {
        setFileType(type);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        if (files.length > 0) {
            console.log("Uploading files:", files);
            // Add your upload logic here (e.g., API call to upload files)
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-6 w-[30%]">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Knowledge Management</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {/* File Type Selection */}
                <div className="mb-4 bg-gray-200 p-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select file type:
                    </label>
                    <div className="flex space-x-6">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="file"
                                name="fileType"
                                value="file"
                                checked={fileType === "file"}
                                onChange={() => handleFileTypeChange("file")}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                            />
                            <img src="/folder-icon.svg" className="h-4 w-4 ml-2" alt="" />
                            <label htmlFor="file" className="ml-2 text-sm text-gray-700">
                                File
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="web"
                                name="fileType"
                                value="web"
                                checked={fileType === "web"}
                                onChange={() => handleFileTypeChange("web")}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                            />
                            <img src="/web.svg" className="h-4 w-4 ml-2" alt="" />
                            <label htmlFor="web" className="ml-2 text-sm text-gray-700">
                                Web
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="googleDrive"
                                name="fileType"
                                value="googleDrive"
                                checked={fileType === "googleDrive"}
                                onChange={() => handleFileTypeChange("googleDrive")}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                            />
                            <img src="/Group1.svg" className="h-4 w-4 ml-2" alt="" />
                            <label htmlFor="googleDrive" className="ml-2 text-sm text-gray-700">
                                Google Drive
                            </label>
                        </div>
                    </div>
                </div>

                {fileType === "file" ? (
                    <div className="bg-gray-200 p-5 ">
                        {/* Drag and Drop Area */}
                        <p className="text-base font-bold text-black mb-4">
                            Select file:
                        </p>
                        <div
                            className="text-center"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer bg-white p-1"
                            >
                                Drag and drop some files here, Or click to select
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                id="fileInput"
                            />
                            {files.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-700">
                                        Selected files: {files.map((file) => file.name).join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            className="mt-9 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center"
                        >
                            Upload
                            <svg
                                className="ml-2 h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>
                        </button>
                    </div>
                ) : fileType === "web" ? (
                    <div className="bg-gray-200 p-5 ">
                        {/* Drag and Drop Area */}
                        <p className="text-base font-bold text-black mb-4" >
                            <label htmlFor="fileInput">
                                URL to Index:
                            </label>
                        </p>

                        <Input
                            type="text"
                            className="bg-white"
                            id="fileInput"
                        />
                        <div className="flex space-x-6 mt-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="file"
                                    name="urltype"
                                    value="file"
                                    checked={urltype === "full"}
                                    onChange={() => setUrlType("full")}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                />
                                {/* <img src="/folder-icon.svg" className="h-4 w-4 ml-2" alt="" /> */}
                                <label htmlFor="file" className="ml-2 text-sm text-gray-700">
                                    Entire Website
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="web"
                                    name="fileType"
                                    value="web"
                                    checked={urltype === "single"}
                                    onChange={() => setUrlType("single")}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                />
                                {/* <img src="/web.svg" className="h-4 w-4 ml-2" alt="" /> */}
                                <label htmlFor="web" className="ml-2 text-sm text-gray-700">
                                    Single Page
                                </label>
                            </div>
                        </div>
                        {/* Upload Button */}
                        <button
                            className="mt-9 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center"
                        >
                            Connect
                        </button>
                    </div>

                ) : (
                    <div className="bg-gray-200 p-5 ">
                        {/* Drag and Drop Area */}
                        <p className="text-base font-bold text-black mb-4" >
                            <label htmlFor="fileInput">
                                Add Link:
                            </label>
                        </p>

                        <Input
                            type="text"
                            className="bg-white"
                            id="fileInput"
                        />

                        {/* Upload Button */}
                        <button
                            className="mt-9 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center"
                        >
                            Connect
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadModal;