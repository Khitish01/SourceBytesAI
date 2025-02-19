"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrganisationList } from "@/components/apicalls/organisation"
import { createAdmin } from "@/components/apicalls/admin-acount"
import { uploadFile } from "@/components/apicalls/tenant-file"
// import { createOrganisation } from "./apicalls/organisation"

interface AddDocumentModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: string) => void
}



export function AddDocumentModal({ isOpen, onClose }: AddDocumentModalProps) {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        
        setFile(selectedFile);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);



        // onSubmit(formData)
        // setFormData(formData)
        const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
        const token = authDetails?.data?.token;
        const tenant_id = authDetails?.data?.tenant_id;

        const response = await uploadFile(token, formData, tenant_id);

        onClose()
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


    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target
    //     setFormData((prev) => ({ ...prev, [name]: value }))
    // }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full gap-4">
                        <div className="grid gap-2">
                            {/* <label htmlFor="file" className="block text-sm font-bold text-gray-700 mb-2">
                                Category Image
                            </label> */}
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf"
                            />
                        </div>
                        {/* <div className="grid gap-2">
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
                        </div> */}
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                        Add Document
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

