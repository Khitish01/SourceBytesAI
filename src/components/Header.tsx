"use client"

import React from 'react'
import { Bell } from "lucide-react";
import { MdOutlineContactSupport } from "react-icons/md";
import { TbUserSquare } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export const Header = () => {
    const router = useRouter();
    const { translations } = useLanguage();
    return (
        <header className="p-4 pl-0 flex items-center justify-between border-b border-zinc-200">
            <h1 className="text-xl font-semibold text-zinc-900">{translations?.header?.text_1}</h1>
            <div className="flex items-center gap-4">
                <button className="p-2 border-[1.5px] hover:bg-zinc-100 transition-colors">
                    <Bell className="w-5 h-5 text-zinc-700" />
                </button>
                <button className="p-2 border-[1.5px] hover:bg-zinc-100 transition-colors">
                    <MdOutlineContactSupport className="w-5 h-5 text-zinc-700" onClick={() => { window.open("https://sourcebytes.ai/", "_blank", "noopener,noreferrer");; }} />
                </button>
                <button className="p-2 border-[1.5px] hover:bg-zinc-100 transition-colors">
                    <TbUserSquare className="w-5 h-5 text-zinc-700" onClick={() => { router.push('/settings') }} />
                </button>
            </div>
        </header>
    )
}
