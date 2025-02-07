"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"

interface Organization {
    id: string
    name: string
    email: string
    subscriptionType: string
    accountManager: string
    status: "Active" | "Inactive"
    address?: string
}

// This is a mock function to fetch organization data
// In a real application, you would fetch this data from your API
const getOrganization = async (id: string): Promise<Organization | null> => {
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulating a not found scenario for demonstration
    if (id === "not-found") return null

    return {
        id,
        name: "World Health Organization",
        email: "who@example.com",
        subscriptionType: "Professional",
        accountManager: "John Doe",
        status: "Active",
        address: "Geneva, Switzerland",
    }
}

interface EditOrganizationPageProps {
    params: {
        id: string
    }
}

const EditOrganizationPage: React.FC<EditOrganizationPageProps> = ({ params }) => {
    const router = useRouter()
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrganization = async () => {
            setIsLoading(true)
            const data = await getOrganization(params.id)
            setOrganization(data)
            setIsLoading(false)
        }

        fetchOrganization()
    }, [params.id])

    if (isLoading) {
        return <div className="container mx-auto py-6">Loading...</div>
    }

    if (!organization) {
        return (
            <div className="container mx-auto py-6">
                <h2 className="text-2xl font-semibold">Organization not found</h2>
                <Button onClick={() => router.push("/dashboard")} className="mt-4">
                    Back to Dashboard
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="grid w-full max-w-5xl gap-6 p-6 mx-auto bg-white rounded-lg shadow-lg md:grid-cols-[2fr,1fr]">
                {/* Left side - Form */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Edit Organization</h2>
                        <div className="space-x-2">
                            <Button variant="outline" onClick={() => router.push("/dashboard")}>
                                Back
                            </Button>
                            <Button variant="destructive">Delete</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Organization Name*</Label>
                            <Input id="name" defaultValue={organization.name} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email*</Label>
                            <Input id="email" type="email" defaultValue={organization.email} />
                        </div>

                        <div>
                            <Label htmlFor="accountManager">Account Manager Name*</Label>
                            <Input id="accountManager" defaultValue={organization.accountManager} />
                        </div>

                        <div>
                            <Label htmlFor="accountManagerEmail">Account Manager Email*</Label>
                            <Input id="accountManagerEmail" type="email" />
                        </div>

                        <div>
                            <Label htmlFor="subscriptionType">Subscription Type</Label>
                            <Input id="subscriptionType" defaultValue={organization.subscriptionType} readOnly />
                        </div>

                        <div>
                            <Label htmlFor="address">Organization Address</Label>
                            <Input id="address" defaultValue={organization.address} />
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select defaultValue={organization.status.toLowerCase()}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Right side - Subscription Plans */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Subscription Plans</h3>

                    <Card className="p-4 bg-orange-500 text-white">
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold">Pro</h4>
                            <div className="text-right">
                                <div>100k/Month</div>
                                <div className="text-sm opacity-90">Started 20.01.25</div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <h5 className="font-medium">Payment Details:</h5>
                            <div className="flex items-center gap-2">
                                <Check size={16} />
                                <span>Duration: 12 Months</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={16} />
                                <span>Status: Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={16} />
                                <span>Expiry Date: 22.06.24</span>
                            </div>

                            <Button className="w-full bg-white text-orange-500 hover:bg-white/90">Selected</Button>
                        </div>
                    </Card>

                    <Card className="p-4 bg-pink-50">
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold">Free trial</h4>
                            <div className="text-right">
                                <div>Free</div>
                                <div className="text-sm text-gray-500">With restrictions</div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <h5 className="font-medium">Plan includes:</h5>
                            <div className="flex items-center gap-2 text-sm">
                                <Check size={16} className="text-gray-500" />
                                <span>Lorem ipsum dolor sit amet, consectetur elit.</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check size={16} className="text-gray-500" />
                                <span>Lorem ipsum dolor sit amet.</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check size={16} className="text-gray-500" />
                                <span>Consectetur adipiscing elit.</span>
                            </div>

                            <Button variant="outline" className="w-full">
                                Change Plan
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EditOrganizationPage