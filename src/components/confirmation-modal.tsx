"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrganisation } from "./apicalls/organisation"
import { Trash2, X } from "lucide-react"

interface AddOrganizationModalProps {
    isOpen: boolean
    modalData?: any
    onClose: () => void
    onDelete?: () => void;
    onConfirm?: () => void;
}

export function ConfirmationModal({ isOpen, modalData, onClose, onDelete, onConfirm }: AddOrganizationModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                {/* <DialogHeader>
                    <DialogTitle>Do you want to Delete?</DialogTitle>
                </DialogHeader> */}
                <div className="p-5">
                    <DialogHeader>
                        <DialogTitle>{modalData?.header ? modalData?.header : 'Do you want to Delete?'}</DialogTitle>
                    </DialogHeader>
                    {modalData?.desc ? (
                        <DialogDescription className="mt-4">Are you sure you want to Active the profile?</DialogDescription>
                    ) : (
                        <></>
                    )}
                    {/* <h1 className="mb-3">Do you want to Delete?</h1> */}
                    <div className="flex gap-3 flex-wrap justify-center">
                        {modalData?.confirmbutton ? (
                            <button className=" flex items-center gap-2 px-3 py-2 mt-6 text-sm text-white bg-orange-500 border border-orange-500 rounded-md hover:bg-orange-700 transition-colors"
                                onClick={onConfirm}
                            >
                                {/* <Trash2 className="h-4 w-4" /> */}
                                Continue
                            </button>
                        ) : (
                            <button className=" flex items-center gap-2 px-3 py-2 mt-6 text-sm text-white bg-red-500 border border-red-500 rounded-md hover:bg-red-700 transition-colors"
                                onClick={onDelete}
                            >
                                {/* <Trash2 className="h-4 w-4" /> */}
                                Delete
                            </button>
                        )}
                        <button className=" flex items-center gap-2 px-3 py-2 mt-6 text-sm text-black border border-black rounded-md hover:bg-red-50 transition-colors"
                            onClick={onClose}
                        >
                            {/* <X className="h-4 w-4" /> */}
                            Cancel
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

