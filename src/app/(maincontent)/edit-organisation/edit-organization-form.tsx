"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"
import { deleteOrganisation, editOrganisation, getOrganisationDetailsById } from "@/components/apicalls/organisation"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { useToast } from "@/hooks/use-toast"

interface Organization {
  name: string
  contact_email: string
  phone_number: string
  account_manager_name: string
  account_manager_email: string
  address: string
  latest_subscription_type: string
  is_active: boolean
  id: string
  tenant_id: string
  created_at: string
  updated_at: string
}

const initialFormData: Organization = {
  name: "",
  contact_email: "",
  phone_number: "",
  account_manager_name: "",
  account_manager_email: "",
  address: "",
  latest_subscription_type: "",
  is_active: true,
  id: "",
  tenant_id: "",
  created_at: "",
  updated_at: "",
}

export default function EditOrganizationForm() {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || ""
  const [isModelOpen, setIsModalOpen] = useState<boolean>(false)
  const { toast } = useToast()

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}")
    const token = authDetails?.data?.token
    const { latest_subscription_type, id, tenant_id, created_at, updated_at, ...formDataWithoutCpassword } =
      organization
    const data = await editOrganisation(token, id, formDataWithoutCpassword)
    setIsLoading(false)

    if (data.success) {
      router.push("/dashboard")
      toast({ title: "Edited Successfully", description: `${organization?.name} has been edited successfully.` })
    } else {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong!" })
    }
  }

  const handleDelete = async () => {
    const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}")
    const token = authDetails?.data?.token
    setIsModalOpen(false)
    const isdeleted = await deleteOrganisation(token, id)

    if (isdeleted.success) {
      router.push("/dashboard")
      toast({ title: "Deleted", description: `${organization?.name} has been removed.` })
    } else {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong!" })
    }
  }

  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoading(true)
      const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}")
      const token = authDetails?.data?.token
      const data = await getOrganisationDetailsById(token, id)
      setOrganization(data.data)
      setIsLoading(false)
    }

    if (id) {
      fetchOrganization()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrganization((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return <div className="container mx-auto">Loading...</div>
  }

  if (!organization) {
    return (
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold">Organization not found</h2>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <form onSubmit={handleEdit} className="space-y-4">
        <div className="grid w-full gap-6 p-6 mx-auto bg-white rounded-lg shadow-lg md:grid-cols-[2fr,1fr,1fr]">
          {/* Form fields section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Edit Organization</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name*</Label>
                <Input id="name" name="name" value={organization.name} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="contact_email">Email*</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={organization.contact_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="account_manager_name">Account Manager Name*</Label>
                <Input
                  id="account_manager_name"
                  name="account_manager_name"
                  value={organization.account_manager_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="account_manager_email">Account Manager Email*</Label>
                <Input
                  id="account_manager_email"
                  name="account_manager_email"
                  type="email"
                  value={organization.account_manager_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="latest_subscription_type">Subscription Type</Label>
                <Select
                  value={organization.latest_subscription_type}
                  onValueChange={(value) => setOrganization((prev) => ({ ...prev, latest_subscription_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free Trial">Free Trial</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Organization Address</Label>
                <Input id="address" name="address" value={organization.address} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={organization.is_active ? "true" : "false"}
                  onValueChange={(value) => setOrganization((prev) => ({ ...prev, is_active: value === "true" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div>
            <div className="mt-3">
              <Button
                className="w-full bg-orange-500 hover:bg-white border-orange-500 border-2 hover:text-black"
                type="submit"
              >
                Edit
              </Button>
              <Button
                type="button"
                className="w-full mt-5 border-orange-500 border-2 hover:bg-orange-500 hover:text-white bg-white text-black"
                onClick={() => setIsModalOpen(true)}
              >
                Delete
              </Button>
              <ConfirmationModal isOpen={isModelOpen} onClose={() => setIsModalOpen(false)} onDelete={handleDelete} />
            </div>
          </div>

          {/* Subscription plans section */}
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
      </form>
    </div>
  )
}

