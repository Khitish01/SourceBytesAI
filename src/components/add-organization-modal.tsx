"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrganisation } from "./apicalls/organisation"

interface AddOrganizationModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: OrganizationFormData) => void
}

interface OrganizationFormData {
    name: string
    contact_email: string
    account_manager_name: string
    account_manager_email: string
    subscription_type: string
    address: string
    phone_number: string
}

const initialFormData: OrganizationFormData = {
    name: "",
    contact_email: "",
    account_manager_name: "",
    account_manager_email: "",
    subscription_type: "",
    address: "",
    phone_number: "",
}

export function AddOrganizationModal({ isOpen, onClose }: AddOrganizationModalProps) {
    const [formData, setFormData] = useState<OrganizationFormData>(initialFormData)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // onSubmit(formData)
        // setFormData(formData)
        const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
        const token = authDetails?.data?.token;
        const response = await createOrganisation(token, formData);

        onClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Organization</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Organization Name*</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact_email">Email*</Label>
                            <Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="account_manager_name">Account Manager Name*</Label>
                            <Input
                                id="account_manager_name"
                                name="account_manager_name"
                                value={formData.account_manager_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="account_manager_email">Account Manager Email*</Label>
                            <Input
                                id="account_manager_email"
                                name="account_manager_email"
                                type="email"
                                value={formData.account_manager_email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subscriptionType">Subscription Type</Label>
                            <Select
                                value={formData.subscription_type}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, subscription_type: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subscription type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Free Trial">Free Trial</SelectItem>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    {/* <SelectItem value="enterprise">Enterprise</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Organization Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                type="tel"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
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

