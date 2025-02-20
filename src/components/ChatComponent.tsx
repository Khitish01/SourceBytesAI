"use client"

import { useEffect, useState } from "react"
import { CiMicrophoneOn } from "react-icons/ci"
import { ChatHistory } from "@/components/History"
import { FiCopy } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaPlay } from "react-icons/fa"
import { getChatHistory, sendChat } from "./apicalls/chat"
import { useToast } from "@/hooks/use-toast"

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
    const [messages, setMessages] = useState<any[]>([])
    const [inputText, setInputText] = useState("")
    const [selectedHistory, setSelectedHistory] = useState<any>(null)
    const [newChat, setNewChat] = useState<any>(null)
    const { toast } = useToast()

    const handleSendMessage = async () => {
        if (inputText.trim() === "") return
        const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
        const token = authDetails?.data?.token;
        // Add user message
        // const userMessage: Message = {
        //     id: Date.now(),
        //     text: inputText,
        //     isUser: true,
        // }

        if (selectedHistory) {
            loadListings(selectedHistory)
            const chatResponse = await sendChat(token, { message: inputText, conversation_id: selectedHistory?.id })

            const userMessage = {
                id: chatResponse.data.data.user_message.id,
                message: chatResponse.data.data.user_message.message,
                message_author_type: "user",
                conversation_id: chatResponse.data.data.user_message.conversation_id,
                created_at: chatResponse.data.data.user_message.created_at,
                updated_at: chatResponse.data.data.user_message.updated_at
            }
            setMessages((prevMessages) => [...prevMessages, userMessage])
            setTimeout(() => {
                const agentMessage = {
                    id: chatResponse.data.data.assistant_response.id,
                    message: chatResponse.data.data.assistant_response.message,
                    message_author_type: "assistant",
                    conversation_id: chatResponse.data.data.assistant_response.conversation_id,
                    created_at: chatResponse.data.data.assistant_response.created_at,
                    updated_at: chatResponse.data.data.assistant_response.updated_at
                }
                setMessages((prevMessages) => [...prevMessages, agentMessage])
            })
        }
        else {
            const chatResponse = await sendChat(token, { message: inputText, conversation_id: '' })

            const userMessage = {
                id: chatResponse.data.data.user_message.id,
                message: chatResponse.data.data.user_message.message,
                message_author_type: "user",
                conversation_id: chatResponse.data.data.user_message.conversation_id,
                created_at: chatResponse.data.data.user_message.created_at,
                updated_at: chatResponse.data.data.user_message.updated_at
            }
            setMessages((prevMessages) => [...prevMessages, userMessage])
            setTimeout(() => {
                const agentMessage = {
                    id: chatResponse.data.data.assistant_response.id,
                    message: chatResponse.data.data.assistant_response.message,
                    message_author_type: "assistant",
                    conversation_id: chatResponse.data.data.assistant_response.conversation_id,
                    created_at: chatResponse.data.data.assistant_response.created_at,
                    updated_at: chatResponse.data.data.assistant_response.updated_at
                }
                setMessages((prevMessages) => [...prevMessages, agentMessage])
                setNewChat(agentMessage.conversation_id)
                setSelectedHistory({
                    created_at: userMessage.created_at,
                    id: userMessage.conversation_id,
                    name: userMessage.message,
                    updated_at: userMessage.updated_at
                })
            })
        }

        setInputText("")
    }

    const handleCopyMessage = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({ title: "Copied", description: `Message copied to clipboard!` });
        })
    }

    const handleRegenerateResponse = () => {
        // if (messages.length > 0) {
        //     const aiResponse: Message = {
        //         id: Date.now(),
        //         text: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
        //         isUser: false,
        //     }
        //     setMessages((prevMessages) => [...prevMessages, aiResponse])
        // }
    }

    const handlePlayMessage = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text)
        speechSynthesis.speak(utterance)
    }
    const loadListings = async (selectedHistory: any) => {
        // setLoading(true);
        try {
            const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;

            if (!token) {
                console.error("No auth token found");
                return;
            }

            const fetchedListings = await getChatHistory(token, selectedHistory?.id);
            setMessages(fetchedListings?.data?.messages)

            // setListings(fetchedListings.data);
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedHistory) {
            // Here you can handle the selected history item
            // For example, you could load the chat messages associated with this history
            loadListings(selectedHistory)
        }
        else {
            setMessages([])
        }
    }, [selectedHistory])

    return (
        <div className=" bg-white text-zinc-900 flex">
            <div className="flex-1 flex flex-col ml-20">
                <div className="flex-1 flex relative ">
                    <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full relative h-[calc(100vh-100px)]">
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
                                            className={`flex ${message.message_author_type == 'user' ? 'justify-end' : 'justify-start items-start'}`}
                                        >
                                            {!(message.message_author_type == 'user') && (
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
                                            <div className={`p-6 rounded-2xl max-w-[80%] ${message.message_author_type == 'user' ? "bg-orange-100" : "bg-zinc-100 ml-8"} group relative flex items-center gap-2`}>
                                                <p className="text-sm flex-1">{message.message}</p>

                                                {/* Play button - only shown on assistant messages */}
                                                {!(message.message_author_type == 'user') && (
                                                    <button
                                                        onClick={() => handlePlayMessage(message.message)}
                                                        className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center shrink-0 overflow-hidden"
                                                    >
                                                        <FaPlay className="text-gray-400 text-xs" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleCopyMessage(message.message)}
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
                                <svg className="w-6 h-6 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <ChatHistory historyData={newChat} onHistorySelect={setSelectedHistory} />
                </div>
            </div>
        </div>
    )
}

