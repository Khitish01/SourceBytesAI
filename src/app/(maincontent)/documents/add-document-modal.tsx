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
import { Loader2 } from "lucide-react"
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
    const [isUploading, setIsUploading] = useState(false)


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
        setIsUploading(true)
        const formData = new FormData();
        formData.append('file', file);



        try {
            const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}")
            const token = authDetails?.data?.token
            const tenant_id = authDetails?.data?.tenant_id

            const response = await uploadFile(token, formData, tenant_id)

            if (response.success) {
                onClose()
            } else {
                // Handle error
                console.error("Upload failed:", response.message)
                alert("Upload failed. Please try again.")
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("An error occurred during upload. Please try again.")
        } finally {
            setIsUploading(false)
        }

    }



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
                                disabled={isUploading}
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
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={isUploading || !file}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Add Document"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

