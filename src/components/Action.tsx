import React, { useState } from 'react'
import { Download, Share, Eye, Trash2 } from 'lucide-react'
import { ConfirmationModal } from './confirmation-modal';

interface ActionProps {
    selectedFile: { id: string, file_name: string } | null;
    onDelete: () => void;
}

export const Action = ({ selectedFile, onDelete }: ActionProps) => {
    const [isModelOpen, setIsModalOpen] = useState<boolean>(false);
    const handleDelete = () => {
        onDelete()
        setIsModalOpen(false)
        // onDelete()
    }
    return (
        <aside className="w-full lg:w-[240px] p-4 bg-white rounded-lg border border-zinc-200">
            <h2 className="text-base font-medium mb-4">Actions:</h2>

            <div className="space-y-4">
                {/* Download Action */}
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                </button>

                {/* Share Action */}
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    <Share className="h-4 w-4" />
                    Share
                </button>

                {/* Preview Action */}
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    <Eye className="h-4 w-4" />
                    Preview
                </button>

                {/* Delete Action */}
                <button className="w-full flex items-center gap-2 px-3 py-2 mt-6 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </button>
                <ConfirmationModal isOpen={isModelOpen} onClose={() => setIsModalOpen(false)} onDelete={handleDelete} />
            </div>
        </aside>
    )
}