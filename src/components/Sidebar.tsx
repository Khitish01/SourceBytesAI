'use client'
import { useEffect, useState } from 'react';
import { Layout, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from './ui/card';
import { TbLayoutSidebarFilled } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation"
// import { getUserRole } from '@/app/utils/auth';




export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const fetchRole = async () => {
            const userRole = JSON.parse(localStorage.getItem('authDetails') as string).data.user_type
            setRole(userRole);
        };

        fetchRole();
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('authDetails');
        router.push('/')
    }

    const menuItems = [
        { icon: Layout, label: 'Dashboard', href: '/dashboard' },
        ...(role === 'superuser'
            ? [{ icon: FileText, label: 'Add Admin Accounts', href: '/accounts' }]
            : [{ icon: FileText, label: 'Documents', href: '/documents' }]),
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <aside
            className={cn(
                'h-screen bg-zinc-800 text-white left-0 top-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
                isExpanded ? 'w-80' : 'w-20'
            )}
        >
            <div className={`flex items-center justify-between ${isExpanded ? 'p-4' : 'py-4 px-2'}`}>
                <div className={cn('flex items-center', isExpanded ? 'gap-3' : 'gap-0')}>
                    <Image
                        src="/SYEEKBYET LOGO bg 1.svg"
                        alt="SourceBytes.AI Logo"
                        width={20}
                        height={20}
                        className="w-[25px] h-[25px]"
                    />
                    <span className={cn('font-semibold text-xl whitespace-nowrap transition-all duration-300 ease-in-out',
                        isExpanded ? 'block' : 'hidden'
                    )}>
                        SourceBytes.AI
                    </span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-lg text-lg hover:bg-white/10 transition-all duration-300 ease-in-out"
                >
                    <TbLayoutSidebarFilled className='h-5 w-5 pointer-events-auto' />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        onClick={() => { router.push(item.href) }}
                        className={`flex ${pathname == item.href ? 'bg-white/25 font-extrabold' : ''} cursor-pointer  items-center text-lg gap-3 ${isExpanded ? 'p-3' : 'py-3 justify-center'} rounded-lg hover:bg-white/10 transition-all duration-300 ease-in-out`}
                    >
                        <item.icon className={`w-5 h-5 ${pathname == item.href ? 'text-[#EF6A37]' : ''}`} />
                        <span className={cn('whitespace-nowrap transition-all duration-300 ease-in-out',
                            isExpanded ? 'block' : 'hidden'
                        )}>
                            {item.label}
                        </span>
                    </a>
                ))}
            </nav>
            <div className="px-4 mb-4">
                <Card className={cn('relative overflow-hidden bg-gradient-to-b from-[#eb9471] to-[#d05524] text-white p-6 border-none',
                    isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                )}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 right-12 w-16 h-16 bg-white/10 rounded-full" />
                    <Image
                        src="/SYEEKBYET bgwhite.svg"
                        alt="SourceBytes.AI Logo"
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">SourceBytes.AI</h3>
                    <p className="text-md leading-tight opacity-90">Transforming Enterprises with Generative AI</p>
                </Card>
            </div>

            <div className="p-3 border-t border-white/10">
                <button onClick={handleLogout}
                    className={cn('flex items-center w-full p-3 text-xl rounded-lg hover:bg-white/10 text-left transition-all duration-300 ease-in-out',
                        isExpanded ? 'gap-3' : 'gap-0'
                    )}>
                    <LogOut className="w-5 h-5" />
                    <span className={cn('whitespace-nowrap transition-all duration-300 ease-in-out',
                        isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                    )}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};