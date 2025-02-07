"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TbFilterCheck } from "react-icons/tb"
import { PiFileArrowDownDuotone } from "react-icons/pi"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { RiFileUploadLine } from "react-icons/ri"
import { AddOrganizationModal } from "@/components/add-organization-modal"


interface Organization {
    id: string
    name: string
    email: string
    subscriptionType: string
    accountManager: string
    status: "Active" | "Inactive"
    address?: string
}

const initialData: Organization[] = [
    {
        id: "1",
        name: "World Health Organization",
        email: "gate@gmail.com",
        subscriptionType: "Professional",
        accountManager: "Tanmay Rath",
        status: "Active",
    },
    {
        id: "2",
        name: "World Trade Organization",
        email: "gate@gmail.com",
        subscriptionType: "Free Trial",
        accountManager: "Tanmay Rath",
        status: "Active",
    },
    {
        id: "3",
        name: "Bill Gates",
        email: "gate@gmail.com",
        subscriptionType: "-",
        accountManager: "Tanmay Rath",
        status: "Inactive",
    },
]

const Accounts = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredData = initialData.filter((org) => org.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleAddOrganization = (data: any) => {
        // Handle the new organization data here
        console.log("New organization:", data)
    }

    return (
        <div className="container mx-auto py-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">All Organizations</h1>
                </div>
                <div>
                    <Button className="bg-orange-500 hover:bg-orange-600 flex items-center" onClick={() => setIsModalOpen(true)}>
                        <RiFileUploadLine className="h-4 w-4" />
                        Add Organization
                    </Button>
                    <AddOrganizationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleAddOrganization}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                <div className="relative w-full sm:w-[250px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Type to search"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <TbFilterCheck className="h-8 w-8 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <PiFileArrowDownDuotone className="h-8 w-8 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Subscription Type</TableHead>
                                <TableHead>Account Manager</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((org) => (
                                <TableRow key={org.id} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        <Link href={`/edit-organisation`}>{org.name}</Link>
                                    </TableCell>
                                    <TableCell>{org.email}</TableCell>
                                    <TableCell>{org.subscriptionType}</TableCell>
                                    <TableCell>{org.accountManager}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                org.status === "Active" ? "border-green-500 text-green-500" : "border-gray-500 text-gray-500"
                                            }
                                        >
                                            {org.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Show</span>
                    <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue>{entriesPerPage}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm">entries</span>
                </div>
                <div className="flex items-center gap-2">
                    <Pagination>
                        <PaginationContent className="flex gap-2">
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default Accounts