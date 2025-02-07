import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { CiTrash } from "react-icons/ci";
import { History } from "lucide-react";

export const ChatHistory = () => {
    const historyItems = [
        { id: 1, title: "Previous conversation about AI", time: "2 hours ago" },
        { id: 2, title: "Machine learning discussion", time: "Yesterday" },
        { id: 3, title: "Data analysis query", time: "2 days ago" },
        { id: 4, title: "Code optimization help", time: "3 days ago" },
    ];
    return (
        <aside className="w-80 border-l border-zinc-200 p-4 hidden lg:flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-zinc-700" />
                <h2 className="text-lg font-semibold">History</h2>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto">
                {historyItems.map((item) => (
                    <div
                        key={item.id}
                        className="p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors border border-zinc-200"
                    >
                        <div className="flex items-start gap-3">
                            <Checkbox className="w-4 h-4 text-zinc-500 mt-1" />
                            <div>
                                <h3 className="text-sm font-medium text-zinc-900">{item.title}</h3>
                                <p className="text-xs text-zinc-500 mt-1">{item.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Button Stays at Bottom */}
            <button className="p-3 mt-4 w-full bg-zinc-100 text-zinc-400 hover:bg-slate-200 text-sm rounded-lg transition-colors shrink-0 flex items-center justify-center">
                <CiTrash className="w-4 h-4 text-zinc-500 mr-1" />
                Clear History
            </button>
        </aside>
    )
}
