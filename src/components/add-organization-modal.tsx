"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddOrganizationModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: OrganizationFormData) => void
}

interface OrganizationFormData {
    name: string
    email: string
    accountManagerName: string
    accountManagerEmail: string
    subscriptionType: string
    address: string
    phoneNumber: string
}

const initialFormData: OrganizationFormData = {
    name: "",
    email: "",
    accountManagerName: "",
    accountManagerEmail: "",
    subscriptionType: "",
    address: "",
    phoneNumber: "",
}

export function AddOrganizationModal({ isOpen, onClose }: AddOrganizationModalProps) {
    const [formData, setFormData] = useState<OrganizationFormData>(initialFormData)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // onSubmit(formData)
        setFormData(initialFormData)
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
                            <Label htmlFor="email">Email*</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accountManagerName">Account Manager Name*</Label>
                            <Input
                                id="accountManagerName"
                                name="accountManagerName"
                                value={formData.accountManagerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accountManagerEmail">Account Manager Email*</Label>
                            <Input
                                id="accountManagerEmail"
                                name="accountManagerEmail"
                                type="email"
                                value={formData.accountManagerEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subscriptionType">Subscription Type</Label>
                            <Select
                                value={formData.subscriptionType}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, subscriptionType: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subscription type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free Trial</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Organization Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
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

