"use client"

import Image from "next/image"
import { useState } from "react"

export default function LandingPage() {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [showOtp, setShowOtp] = useState(false)

    const handleSubmit = () => {
        if (!showOtp) {
            // Validate email
            if (email && email.includes("@")) {
                setShowOtp(true)
                // Here you would typically send the OTP to the user's email
                console.log("Sending OTP to", email)
            } else {
                alert("Please enter a valid email address")
            }
        } else {
            // Validate OTP
            if (otp && otp.length === 6) {
                // Here you would typically verify the OTP
                console.log("Verifying OTP", otp)
                alert("OTP verified successfully!")
            } else {
                alert("Please enter a valid 6-digit OTP")
            }
        }
    }

    return (
        <div className="relative min-h-screen flex">
            {/* Full screen background image */}
            <Image src="/image 2.svg" alt="Professional workspace" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50" />

            {/* Left Section */}
            <div className="relative z-10 w-full lg:w-2/5 flex flex-col justify-between p-4 sm:p-8">
                {/* Logo */}
                <div>
                    <Image src="/Frame 32.svg" alt="SourceBytes.AI Logo" width={190} height={45} className="w-[250px] h-[45px]" />
                </div>

                {/* Main Text */}
                <div className="text-white">
                    <h1 className="font-gilroy font-semibold text-[22px] leading-[35px] text-left decoration-from-font decoration-skip-ink-none mb-4 sm:mb-8">
                        Trusted by Early Adopters to Transform Enterprise Intelligence – Join the Growing Revolution with{" "}
                        <span className="text-[#EF6A37]">SourceBytes.AI</span>
                    </h1>

                    <div className="flex flex-row space-x-8 text-xs sm:text-sm">
                        <div className="flex items-center font-gilroy font-semibold text-[15px] leading-[15px] text-left decoration-from-font decoration-skip-ink-none">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            12+ Data source formats
                        </div>
                        <div className="flex items-center font-gilroy font-semibold text-[15px] leading-[15px] text-left decoration-from-font decoration-skip-ink-none">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            25+ GenAI features
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="relative z-10 w-full lg:w-3/5 flex items-center justify-center">
                <div className="w-full max-w-lg bg-white rounded-2xl p-10 sm:p-8 md:p-10 lg:p-16 shadow-xl m-4 sm:m-4">
                    <div className="mb-8 lg:mb-12">
                        <div className="w-12 h-12 bg-sourcebytes/10 rounded-lg flex items-center justify-center mb-4 sm:mb-8">
                            <Image
                                src="/SYEEKBYET LOGO bg 1.svg"
                                alt="SourceBytes.AI Logo"
                                width={40}
                                height={40}
                                className="w-[40px] h-[40px]"
                            />
                        </div>
                        <p className="text-slate-500 font-gilroy text-sm sm:text-base">
                            Welcome to <span className="text-slate-500 font-semibold">SourceBytes.AI</span>
                        </p>
                        <h2 className="font-gilroy text-slate-950 font-medium text-xl sm:text-[30px] leading-tight sm:leading-[37.14px] mt-2">
                            {showOtp ? "Get started with your email" : "Get started with your email"}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {!showOtp ? (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#EF6A37] focus:border-transparent text-sm sm:text-base"
                            />
                        ) : (
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter your OTP"
                                maxLength={6}
                                className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#EF6A37] focus:border-transparent text-sm sm:text-base"
                            />
                        )}
                        <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-3 bg-[#EF6A37] text-white rounded-lg font-medium hover:bg-[#EF6A37]/85 transition-colors text-sm sm:text-base"
                        >
                            {showOtp ? "Verify OTP" : "Continue"}
                        </button>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-gray-500 overflow-hidden text-ellipsis">
                        By continuing you agree to our <a href="#" className="text-[#EF6A37] hover:underline">privacy policy</a> and <a href="#" className="text-[#EF6A37] hover:underline">terms of use</a>
                    </p>

                </div>
            </div>
        </div>
    )
}

