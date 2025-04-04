import React, { useEffect, useRef, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { CiTrash } from "react-icons/ci";
import { History } from "lucide-react";
import { deleteAllHistory, deleteHistoryById, getConversasionTitle, getHistory } from './apicalls/chat';
import { ConfirmationModal } from './confirmation-modal';
import Loader from './Loader';
import { useLanguage } from '@/context/LanguageContext';
import dayjs from "dayjs";


interface ChatHistoryProps {
    historyData: any;
    onHistorySelect: (selectedChat: any) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const ChatHistory = ({ historyData, onHistorySelect, isOpen, setIsOpen }: ChatHistoryProps) => {
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState<any[]>([]);
    const [isModelOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const { translations } = useLanguage();
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [listings]);

    const loadListings = async () => {
        // setLoading(true);
        try {
            const authDetails = JSON.parse(sessionStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;

            if (!token) {
                console.error("No auth token found");
                return;
            }

            const fetchedListings = await getHistory(token);
            setListings(fetchedListings.data);
            historyData ? setSelectedId(historyData.id) : setSelectedId('')
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };


    useEffect(() => {
        loadListings();

        // setSelectedId(historyData?.id)
    }, [historyData]);


    const handleDelete = async () => {
        try {
            const authDetails = JSON.parse(sessionStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;
            const tenant_id = authDetails?.data?.tenant_id;

            if (!token) {
                console.error("No auth token found");
                return;
            }
            if (selectedId == '') {

                const fetchedListings = await deleteAllHistory(token, tenant_id);
            }
            else {
                const dd = await deleteHistoryById(token, selectedId, tenant_id)
            }
            setIsModalOpen(false)
            setSelectedId('')
            loadListings();
            onHistorySelect(null)
        } catch (error) {
            console.error(error);
        }
    }
    const handleCheckboxChange = async (item: any) => {
        const newSelectedId = selectedId === item.id ? null : item.id
        console.log(newSelectedId);
        console.log(selectedId);

        if (newSelectedId == null) {
            // debugger
            const authDetails = JSON.parse(sessionStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;
            const fetchedListings = await getConversasionTitle(token, selectedId);
            loadListings()
        }

        setSelectedId(newSelectedId)
        onHistorySelect(newSelectedId ? item : null)
    }

    return (
        <aside
            className={`${isOpen ? "w-60 md:w-80 p-5 bg-zinc-100" : "w-5 p-0 bg-white"
                } border-l border-zinc-200   md:relative absolute right-0 md:flex flex-col md:h-[calc(100vh-100px)] min-h-[calc(100vh-100px)] transition-all duration-300`}
        >
            {/* Main Content (only when open) */}
            {isOpen && (
                <>
                    <div className="flex items-center gap-2 mb-4">
                        <History className="w-5 h-5 text-zinc-700" />
                        <h2 className="text-lg font-semibold">{translations?.admin?.history}</h2>
                    </div>
                    <div className="space-y-4 flex flex-col overflow-y-auto">
                        {listings &&
                            listings.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleCheckboxChange(item)}
                                    className={`p-2 rounded-lg ${selectedId === item.id ? "shadow-lg bg-zinc-50" : ""
                                        } hover:bg-zinc-50 cursor-pointer transition-colors border bg-white border-zinc-200`}
                                >
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            className="w-4 h-4 text-zinc-500 mt-1"
                                            checked={selectedId === item.id}
                                            onCheckedChange={() => handleCheckboxChange(item)}
                                        />
                                        <div>
                                            <h3 className="text-sm font-medium text-zinc-900">{item.name}</h3>
                                            <p className="text-xs text-zinc-500 mt-1">{dayjs(item.created_at).format("DD-MMM-YYYY HH:mm:ss")}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Clear History Button */}
                    <button
                        className="p-3 mt-4 w-full bg-zinc-100 text-zinc-800 shadow-2xl hover:bg-slate-200 text-sm rounded-lg transition-colors shrink-0 flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <CiTrash className="w-4 h-4 text-zinc-500 mr-1" />
                        {translations?.admin?.clear_history}
                    </button>
                </>
            )}

            {/* Toggle Button (always visible, positioned on the left border) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute left-[-16px] top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors shadow-md"
            >
                {isOpen ? (
                    <img src="/chatclose.svg" alt="Collapse" className="w-6 h-6" />
                ) : (
                    <img src="/chatclose.svg" alt="Expand" className="w-6 h-6" />
                )}
            </button>

            <ConfirmationModal
                isOpen={isModelOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleDelete}
            />
            {loading && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <Loader size="lg" className="text-white" />
                </div>
            )}
        </aside>
    )
}
