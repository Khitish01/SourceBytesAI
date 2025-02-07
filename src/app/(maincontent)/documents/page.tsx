"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Search } from 'lucide-react'
import { Action } from '@/components/Action'
import { TbFilterCheck } from "react-icons/tb";
import { PiFileArrowDownDuotone } from "react-icons/pi";
import { RiFileUploadLine } from "react-icons/ri";



interface Document {
    id: string
    name: string
    lastModified: string
    size: string
}

const DocumentPage = () => {
    const [entries, setEntries] = useState<number>(10)
    const [documents] = useState<Document[]>([
        { id: '1', name: 'IndoSakura_098yu.pdf', lastModified: '11-03-2024', size: '34 KB' },
        { id: '2', name: 'IndoSakura_098yu.pdf', lastModified: '21-03-2024', size: '24 MB' },
        { id: '3', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '4', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '5', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '6', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '7', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '8', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '9', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
        { id: '10', name: 'IndoSakura_098yu.pdf', lastModified: '22-03-2024', size: '20 KB' },
    ])

    return (
        <div className="p-4 md:p-6 max-w-[2000px] mx-auto">
            <div className="flex justify-end mb-3">
                <Button className="bg-orange-500 hover:bg-orange-600 flex items-center">
                    <RiFileUploadLine className="h-4 w-4" />
                    Upload
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Type to search"
                                className="pl-10 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <TbFilterCheck className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                            <PiFileArrowDownDuotone className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </TableHead>
                                    <TableHead className="min-w-[300px]">Name</TableHead>
                                    <TableHead className="min-w-[200px]">Last Modified</TableHead>
                                    <TableHead className="min-w-[150px]">Size</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <svg className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6C4.89543 2 4 2.89543 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="truncate">{doc.name}</span>
                                        </TableCell>
                                        <TableCell>{doc.lastModified}</TableCell>
                                        <TableCell>{doc.size}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Show</span>
                                <select
                                    value={entries}
                                    onChange={(e) => setEntries(Number(e.target.value))}
                                    className="border rounded p-1 text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-500">entries</span>
                            </div>

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
                <div className="lg:min-w-[240px]">
                    <Action />
                </div>
            </div>
        </div>
    )
}

export default DocumentPage