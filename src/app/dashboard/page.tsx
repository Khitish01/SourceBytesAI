"use client"; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { ChatComponent } from '@/components/ChatComponent';

import { getUserRole } from '../utils/auth';
import SuperAdmindashboard from '@/components/SuperAdmindashboard';

const Dashboard = () => {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRole = async () => {
            const userRole = await getUserRole(); // Fetch user role from session, API, or cookies
            if (!userRole) {
                router.push('/dashboard'); // Redirect if not authenticated
                return;
            }
            setRole(userRole);
        };

        fetchRole();
    }, [router]);

    if (!role) {
        return <SuperAdmindashboard />  // Show a loading state while fetching role
    }

    return (
        <>

            <div>
                {role === "super_admin" ? <SuperAdmindashboard /> : <ChatComponent />}
            </div>
        </>
    );
};

export default Dashboard;