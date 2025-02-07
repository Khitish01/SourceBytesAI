import React from 'react'
import { Bell } from "lucide-react";
import { MdOutlineContactSupport } from "react-icons/md";
import { TbUserSquare } from "react-icons/tb";

export const Header = () => {
    return (
        <header className="p-4 flex items-center justify-between border-b border-zinc-200">
            <h1 className="text-xl font-semibold text-zinc-900">Powering Enterprise Innovation with Gen-AI</h1>
            <div className="flex items-center gap-4">
                <button className="p-2 border-[1.5px] hover:bg-zinc-100 transition-colors">
                    <Bell className="w-5 h-5 text-zinc-700" />
                </button>
                <button className="p-2 border-[1.5px] hover:bg-zinc-100 transition-colors">
                    <MdOutlineContactSupport className="w-5 h-5 text-zinc-700" />
                </button>
                <button className="p-2 border-[1.5px] hover:bg-zinc-100 transition-colors">
                    <TbUserSquare className="w-5 h-5 text-zinc-700" />
                </button>
            </div>
        </header>
    )
}
