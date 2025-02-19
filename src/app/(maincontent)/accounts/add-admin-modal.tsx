"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrganisationList } from "@/components/apicalls/organisation"
import { createAdmin } from "@/components/apicalls/admin-acount"
// import { createOrganisation } from "./apicalls/organisation"

interface AddAdminModalProps {
    isOpen: boolean
    onClose: () => void
}

interface AdminFormData {
    name: string
    tenant_id: string
    password: string
    email: string,
    cpassword: string
}

const initialFormData: AdminFormData = {
    name: "",
    tenant_id: "",
    password: "",
    email: "",
    cpassword: ""
}

export function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
    const [formData, setFormData] = useState<AdminFormData>(initialFormData)
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // onSubmit(formData)
        const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
        const token = authDetails?.data?.token;
        const { cpassword, ...formDataWithoutCpassword } = formData; // Remove cpassword safely
        const response = await createAdmin(token, formDataWithoutCpassword);

        if (response.success) {

            setFormData(initialFormData)
            onClose()
        }
    }

    const loadOrganisations = async () => {
        setLoading(true);
        try {
            const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;

            if (!token) {
                console.error("No auth token found");
                return;
            }

            const fetchedListings = await getOrganisationList(token);
            setListings(fetchedListings.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrganisations();
    }, []); // Empty dependency array ensures it runs only once when the component mounts.


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Admin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tenant_id">Select Organization *</Label>
                            {/* <Input id="tenant_id" name="tenant_id" value={formData.name} onChange={handleChange} required /> */}
                            <Select
                                value={formData.tenant_id}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, tenant_id: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Organisation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {listings && listings.map((org: any) => (
                                        <SelectItem key={org?.id} value={org.tenant_id}>{org.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Admin Name*</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email*</Label>
                            <Input id="email" autoComplete="" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Create Password</Label>
                            <Input type="password" autoComplete="off" id="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cpassword">Confirm Password</Label>
                            <Input type="password" autoComplete="off" id="cpassword" name="cpassword" value={formData.cpassword} onChange={handleChange} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                        Add Organization
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

