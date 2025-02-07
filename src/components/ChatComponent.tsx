"use client"

import { useState } from "react"
import { CiMicrophoneOn } from "react-icons/ci"
import { ChatHistory } from "@/components/History"
import { FiCopy } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaPlay } from "react-icons/fa"

// Dummy AI responses
const dummyResponses = [
    "That's an interesting question! Let me think about it.",
    "Based on my analysis, I would suggest the following approach...",
    "I'm not entirely sure about that, but here's what I know:",
    "That's a complex topic. Let me break it down for you:",
    "Here's a step-by-step guide to address your query:",
]

interface Message {
    id: number
    text: string
    isUser: boolean
}

export const ChatComponent = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState("")

    const handleSendMessage = () => {
        if (inputText.trim() === "") return

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            isUser: true,
        }
        setMessages((prevMessages) => [...prevMessages, userMessage])

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                text: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
                isUser: false,
            }
            setMessages((prevMessages) => [...prevMessages, aiResponse])
        }, 1000)

        setInputText("")
    }

    const handleCopyMessage = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Message copied to clipboard!")
        })
    }

    const handleRegenerateResponse = () => {
        if (messages.length > 0) {
            const aiResponse: Message = {
                id: Date.now(),
                text: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
                isUser: false,
            }
            setMessages((prevMessages) => [...prevMessages, aiResponse])
        }
    }

    const handlePlayMessage = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text)
        speechSynthesis.speak(utterance)
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 flex">
            <div className="flex-1 flex flex-col ml-20">
                <div className="flex-1 flex relative">
                    <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full relative">
                        <div className={`flex-1 overflow-y-auto ${messages.length > 0 ? 'mb-20' : ''}`}>
                            {messages.length === 0 ? (
                                <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
                                    <div className="text-center space-y-6">
                                        <h2 className="text-3xl font-bold text-zinc-900">What can I help with?</h2>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start items-start'}`}
                                        >
                                            {!message.isUser && (
                                                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mr-1 shrink-0 mt-4 overflow-hidden">
                                                    <Image
                                                        src="/SYEEKBYET LOGO bg 2.svg"
                                                        alt="SourceBytes.AI Logo"
                                                        width={48}
                                                        height={48}
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                </div>

                                            )}
                                            <div className={`p-6 rounded-2xl max-w-[80%] ${message.isUser ? "bg-orange-100" : "bg-zinc-100 ml-8"} group relative flex items-center gap-2`}>
                                                <p className="text-sm flex-1">{message.text}</p>

                                                {/* Play button - only shown on assistant messages */}
                                                {!message.isUser && (
                                                    <button
                                                        onClick={() => handlePlayMessage(message.text)}
                                                        className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center shrink-0 overflow-hidden"
                                                    >
                                                        <FaPlay className="text-gray-400 text-xs" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleCopyMessage(message.text)}
                                                    className="text-zinc-500 hover:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                >
                                                    <FiCopy className="w-4 h-4" />
                                                </button>
                                            </div>


                                        </div>
                                    ))}
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleRegenerateResponse}
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Regenerate response
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`${messages.length === 0 ? 'absolute top-1/2 mt-9 left-6 right-6 transform -translate-y-1/2' : 'absolute bottom-6 left-6 right-6'} flex items-center gap-2 bg-white`}>
                            <button className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors shrink-0">
                                <CiMicrophoneOn className="w-6 h-6 text-zinc-700" />
                            </button>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Write here..."
                                className="flex-1 p-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none overflow-hidden"
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto";
                                    void target.offsetHeight;
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shrink-0 flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                    </main>
                    <ChatHistory />
                </div>
            </div>
        </div>
    )
}

