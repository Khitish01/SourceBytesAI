"use client"; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { ChatComponent } from '@/components/ChatComponent';
// import { getUserRole } from '../../utils/auth';
import SuperAdmindashboard from '@/components/SuperAdmindashboard';

const Dashboard = () => {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRole = async () => {
            // const userRole = await getUserRole(); // Fetch user role from session, API, or cookies
            const userRole = JSON.parse(localStorage.getItem('authDetails') as string).data.user_type
            // const userRole = "super_admin"
            if (!userRole) {
                router.push('/dashboard'); // Redirect if not authenticated
                return;
            }
            setRole(userRole);
        };

        fetchRole();
    }, [router]);

    if (!role) {
        return <h1>loading...</h1> // Show a loading state while fetching role
    }

    return (
        <>

            <div>
                {role === "superuser" ? <SuperAdmindashboard /> : <ChatComponent />}
            </div>
        </>
    );
};

export default Dashboard;