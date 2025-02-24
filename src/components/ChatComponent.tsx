"use client";

import { useEffect, useState, useRef } from "react";
import { CiMicrophoneOn } from "react-icons/ci";
import { ChatHistory } from "@/components/History";
import { FiCopy } from "react-icons/fi";
import Image from "next/image";
import { FaPlay, FaStop } from "react-icons/fa"; // Removed FaPause
import { getChatHistory, sendChat } from "./apicalls/chat";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

export const ChatComponent = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [selectedHistory, setSelectedHistory] = useState<any>(null);
    const [newChat, setNewChat] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [playingMessageId, setPlayingMessageId] = useState<number | null>(null); // Track playing message
    const { toast } = useToast();
    let generationTimeout: NodeJS.Timeout | null = null;
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // const handleSendMessage = async () => {
    //     if (inputText.trim() === "") return;

    //     if (isGenerating) {
    //         if (generationTimeout) clearTimeout(generationTimeout);
    //         setIsGenerating(false);
    //         toast({ title: "Stopped", description: "Message generation stopped." });
    //         return;
    //     }

    //     const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
    //     const token = authDetails?.data?.token;
    //     if (!token) {
    //         toast({ variant: "destructive", title: "Error", description: "No authentication token found" });
    //         return;
    //     }

    //     setIsGenerating(true);

    //     try {
    //         const tempUserMessage = {
    //             id: Date.now(),
    //             message: inputText,
    //             message_author_type: "user",
    //             conversation_id: selectedHistory?.id || "",
    //             created_at: new Date().toISOString(),
    //             updated_at: new Date().toISOString(),
    //         };
    //         setMessages((prevMessages) => [...prevMessages, tempUserMessage]);

    //         const chatResponse = await sendChat(token, {
    //             message: inputText,
    //             conversation_id: selectedHistory?.id || "",
    //         });

    //         const userMessage = {
    //             id: chatResponse.data.data.user_message.id,
    //             message: chatResponse.data.data.user_message.message,
    //             message_author_type: "user",
    //             conversation_id: chatResponse.data.data.user_message.conversation_id,
    //             created_at: chatResponse.data.data.user_message.created_at,
    //             updated_at: chatResponse.data.data.user_message.updated_at,
    //         };

    //         const agentMessage = {
    //             id: chatResponse.data.data.assistant_response.id,
    //             message: chatResponse.data.data.assistant_response.message,
    //             message_author_type: "assistant",
    //             conversation_id: chatResponse.data.data.assistant_response.conversation_id,
    //             created_at: chatResponse.data.data.assistant_response.created_at,
    //             updated_at: chatResponse.data.data.assistant_response.updated_at,
    //         };

    //         generationTimeout = setTimeout(() => {
    //             if (isGenerating) {
    //                 setMessages((prevMessages) =>
    //                     prevMessages.filter((msg) => msg.id !== tempUserMessage.id).concat([userMessage, agentMessage])
    //                 );

    //                 if (!selectedHistory) {
    //                     setNewChat(agentMessage.conversation_id);
    //                     setSelectedHistory({
    //                         created_at: userMessage.created_at,
    //                         id: userMessage.conversation_id,
    //                         name: userMessage.message,
    //                         updated_at: userMessage.updated_at,
    //                     });
    //                 }
    //             }
    //             setIsGenerating(false);
    //             generationTimeout = null;
    //         }, 1000);

    //         setInputText("");
    //     } catch (error) {
    //         toast({
    //             variant: "destructive",
    //             title: (
    //                 <div className="flex items-start gap-2">
    //                     <XCircle className="h-11 w-9 text-white" />
    //                     <div className="flex flex-col">
    //                         <span className="font-semibold text-base">Error</span>
    //                         <span className="text-sm font-light">Failed to send message</span>
    //                     </div>
    //                 </div>
    //             ) as unknown as string,
    //             duration: 5000,
    //         });
    //         console.error(error);
    //         setIsGenerating(false);
    //     }
    // };

    const chatEndRef = useRef<HTMLDivElement>(null);
    // Function to auto-scroll to the bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSendMessage = async () => {
        if (inputText.trim() === "") return
        const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
        const token = authDetails?.data?.token;
        setIsGenerating(true);
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
        setIsGenerating(false);
        setInputText("")
    }

    const handleCopyMessage = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                variant: "success",
                title: (
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-11 w-9 text-white" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-base">Copied</span>
                            <span className="text-sm font-light">Message copied to clipboard!</span>
                        </div>
                    </div>
                ) as unknown as string,
                duration: 5000,
            });
        });
    };

    const handlePlayMessage = (messageId: number, text: string) => {
        if (playingMessageId === messageId) {
            // Stop the current message
            speechSynthesis.cancel();
            setPlayingMessageId(null);
            utteranceRef.current = null;
        } else {
            // Stop any ongoing speech and start new message from the beginning
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utteranceRef.current = utterance;
            utterance.onend = () => {
                setPlayingMessageId(null);
                utteranceRef.current = null;
            };
            speechSynthesis.speak(utterance);
            setPlayingMessageId(messageId);
        }
    };

    const loadListings = async (selectedHistory: any) => {
        try {
            const authDetails = JSON.parse(localStorage.getItem("authDetails") || "{}");
            const token = authDetails?.data?.token;
            if (!token) throw new Error("No auth token found");

            const fetchedListings = await getChatHistory(token, selectedHistory?.id);
            setMessages(fetchedListings?.data?.messages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedHistory) {
            loadListings(selectedHistory);
        } else {
            setMessages([]);
        }
        return () => {
            if (generationTimeout) clearTimeout(generationTimeout);
            speechSynthesis.cancel();
            setPlayingMessageId(null);
        };
    }, [selectedHistory]);

    return (
        <div className="bg-white text-zinc-900 flex">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex relative">
                    <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full relative h-[calc(100vh-100px)]">
                        <div className={`flex-1 overflow-y-auto chat-container ${messages.length > 0 ? "mb-20" : ""}`}>
                            {messages.length === 0 ? (
                                <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
                                    <div className="text-center space-y-6">
                                        <h2 className="text-3xl font-bold text-zinc-900">What can I help with?</h2>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6  rounded-xl w-full bg-gradient-to-r from-[#fef4e5] to-[#f9cda1]" >

                                    <div className="space-y-4 bg-white rounded-xl p-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.message_author_type === "user" ? "justify-end" : "justify-start items-center"}`}
                                            >
                                                {message.message_author_type !== "user" && (
                                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mr-1 shrink-0 overflow-hidden">
                                                        <Image
                                                            src="/SYEEKBYET LOGO bg 2.svg"
                                                            alt="SourceBytes.AI Logo"
                                                            width={48}
                                                            height={48}
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    className={`py-2 p-4 rounded-3xl max-w-[80%] ${message.message_author_type === "user" ? "bg-[#FAF6F6]" : "bg-zinc-100 ml-8"} group relative flex items-center gap-2`}
                                                >
                                                    <p className="text-sm flex-1">{message.message}</p>
                                                    {message.message_author_type !== "user" && (
                                                        <button
                                                            onClick={() => handlePlayMessage(message.id, message.message)}
                                                            className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 hover:scale-110"
                                                        >
                                                            {playingMessageId === message.id ? (
                                                                <FaStop className="text-gray-400 text-xs" />
                                                            ) : (
                                                                <FaPlay className="text-gray-400 text-xs" />
                                                            )}
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
                                        <div ref={chatEndRef} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className={`${messages.length === 0 ? "absolute top-1/2 mt-9 left-6 right-6 transform -translate-y-1/2" : "absolute bottom-6 left-6 right-6"} flex items-center gap-2 bg-white`}
                        >
                            <button className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors shrink-0">
                                <CiMicrophoneOn className="w-6 h-6 text-zinc-700" />
                            </button>
                            <textarea
                                readOnly={isGenerating}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Write here..."
                                className="flex-1 p-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none overflow-hidden"
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto";
                                    target.style.maxHeight = "300px";
                                    void target.offsetHeight;
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isGenerating}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`p-2 ${isGenerating ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"} text-white rounded-lg transition-colors shrink-0 flex items-center justify-center`}
                            >
                                {isGenerating ? (
                                    <FaStop className="w-5 h-5" />
                                ) : (
                                    <img src="/send-2.svg" className="w-6 h-6" alt="" />
                                )}
                            </button>
                        </div>
                    </main>
                    <ChatHistory historyData={newChat} onHistorySelect={setSelectedHistory} />
                </div>
            </div>
        </div>
    );
};