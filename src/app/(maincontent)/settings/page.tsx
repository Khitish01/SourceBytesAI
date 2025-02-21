"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editAdminProfile, getAdminProfile } from "@/components/apicalls/profile"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [name, setName] = useState("Khitish Mangal")
    const [email, setEmail] = useState("khitish@gmail.com")
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [avatar, setAvatar] = useState<string>('');
    const { toast } = useToast()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true)
        const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}")
        const token = authDetails?.data?.token
        const data = await editAdminProfile(token, { name, email })
        setLoading(false)

        if (data.success) {
            // router.push("/dashboard")
            toast({ title: "Edited Successfully", description: `Profile has been edited successfully.` })
            setIsEditModalOpen(false)
            getAdminProfileDetails()
        } else {
            toast({ variant: "destructive", title: "Error", description: "Something went wrong!" })
        }



        // Here you would typically send the updated data to your backend
    }


    const getAdminProfileDetails = async () => {
        setLoading(true);
        try {
            const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;
            if (!token) {
                console.error("No auth token found");
                return;
            }

            const fetchedListings = await getAdminProfile(token);

            setProfile(fetchedListings.data.data);
            const nameAvatar = fetchedListings.data.data.name.split(' ')
            setName(fetchedListings.data.data.name)
            setEmail(fetchedListings.data.data.email)

            setAvatar(nameAvatar?.[0].charAt(0) + nameAvatar?.[1].charAt(0))
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAdminProfileDetails();
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 lg:gap-8 max-w-6xl">
            {/* Left Column */}
            <div className="space-y-6 lg:space-y-8">
                <div>
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Profile Details</h2>
                    <Card>
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3 sm:gap-4 bg-gray-950 text-white p-2.5 sm:p-3 rounded-lg">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                    <AvatarImage
                                        src="/jck"
                                        alt="Profile picture"
                                    />
                                    <AvatarFallback className="text-black">{avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{profile?.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-300 truncate">{profile?.email}</p>
                                </div>
                                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                    <DialogTrigger asChild>
                                        <button className="text-gray-300 hover:text-white flex-shrink-0">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                            <Button type="submit" className="bg-orange-500">Save changes</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Selected Language</h2>
                    <Select defaultValue="english">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                            {/* <SelectItem value="french">French</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:max-w-sm">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Subscripted Plan</h2>
                <Card className="bg-[#F26B3A] text-white">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold">Pro</h3>
                            <div className="text-right">
                                <div className="text-lg sm:text-xl font-bold">100k/Month</div>
                                <div className="text-xs sm:text-sm opacity-90">Started 20.01.25</div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <h4 className="font-semibold text-sm sm:text-base">Payment Details :</h4>
                            <div className="space-y-1.5 sm:space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 flex-shrink-0" />
                                    <span>Duration: 12 Months</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 flex-shrink-0" />
                                    <span>Status: Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 flex-shrink-0" />
                                    <span>Expiry Date: 22.06.24</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <button className="w-full bg-white text-[#F26B3A] py-2 rounded-md font-medium flex items-center justify-center gap-2 text-sm">
                                <Check className="h-4 w-4" />
                                Selected
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

