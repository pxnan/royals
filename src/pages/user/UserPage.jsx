import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import { sendQuestion, getRecommendationsByCategory } from "../../api";
import Navbar from '../../components/Navbar';

const UserPage = () => {
    // State untuk histori chat
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chatHistory");
        if (saved) {
            try {
                const { messages: savedMessages, lastUpdated } = JSON.parse(saved);
                const twelveHours = 12 * 60 * 60 * 1000;
                const now = new Date().getTime();
                if (now - lastUpdated > twelveHours) {
                    localStorage.removeItem("chatHistory");
                    return [];
                }
                return savedMessages || [];
            } catch (e) {
                console.error("Error parsing chat history:", e);
                return [];
            }
        }
        return [];
    });

    // ========== LOADING STATES (DIPISAH) ==========
    const [waitingForResponse, setWaitingForResponse] = useState(false); // loading untuk chat bubble
    const [recommendationsLoading, setRecommendationsLoading] = useState(false); // loading untuk rekomendasi

    const [hasWelcomed, setHasWelcomed] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (messages.length > 0) {
            const dataToSave = {
                messages: messages,
                lastUpdated: new Date().getTime()
            };
            localStorage.setItem("chatHistory", JSON.stringify(dataToSave));
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0 && !hasWelcomed) {
            const welcomeMessage = {
                sender: "bot",
                text: "Hai selamat datang! Ada yang bisa saya bantu?",
            };
            setMessages([welcomeMessage]);
            setHasWelcomed(true);
        }
    }, [messages, hasWelcomed]);

    const fetchRecommendationsByCategory = async (kategori) => {
        setWaitingForResponse(false); // pastikan chat loading mati sebelum fetch rekomendasi
        setRecommendationsLoading(true); // hanya rekomendasi yang loading
        try {
            const data = await getRecommendationsByCategory(kategori);
            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error("Failed to load category recommendations:", err);
            setRecommendations([]);
        } finally {
            setRecommendationsLoading(false);
        }
    };

    const handleSend = async (question) => {
        if (waitingForResponse) return; // cegah double send

        const userMessage = { sender: "user", text: question };
        setMessages((prev) => [...prev, userMessage]);
        setWaitingForResponse(true);                  // chat loading ON
        setRecommendations([]);                       // hapus rekomendasi lama
        setRecommendationsLoading(false);              // matikan skeleton rekomendasi

        try {
            const data = await sendQuestion(question);

            if (data.status === "ambigu" && data.opsi_pertanyaan) {
                const botMessage = {
                    sender: "bot",
                    text: data.jawaban,
                    ambiguousOptions: data.opsi_pertanyaan,
                };
                setMessages((prev) => [...prev, botMessage]);
                // tidak fetch rekomendasi karena ambigu
            } else {
                const botMessage = { sender: "bot", text: data.jawaban };
                setMessages((prev) => [...prev, botMessage]);

                if (data.kategori) {
                    await fetchRecommendationsByCategory(data.kategori);
                }
            }
        } catch (error) {
            console.error("Send error:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Terjadi kesalahan koneksi dengan server." },
            ]);
        } finally {
            setWaitingForResponse(false); // chat loading OFF
        }
    };

    const handleAmbiguousOptionClick = (option) => {
        setMessages(prev => {
            const newMessages = [...prev];
            for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].sender === "bot" && newMessages[i].ambiguousOptions) {
                    newMessages.splice(i, 1);
                    break;
                }
            }
            return newMessages;
        });
        handleSend(option);
    };

    const handleClearHistory = () => {
        const welcomeMessage = {
            sender: "bot",
            text: "Hai selamat datang! Ada yang bisa saya bantu?",
        };
        setMessages([welcomeMessage]);
        setHasWelcomed(true);
        setRecommendations([]);
        setRecommendationsLoading(false);
        setWaitingForResponse(false); // reset juga jika sedang loading
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar 
                onClearHistory={handleClearHistory} 
                hasMessages={messages.length > 1} 
            />

            <div className="flex-1 overflow-y-auto">
                <div className="min-h-full flex flex-col-reverse p-4 sm:p-6">
                    <div className="max-w-3xl mx-auto w-full space-y-3">
                        <ChatWindow 
                            messages={messages}
                            loading={waitingForResponse}          // skeleton chat bubble
                            recommendationsLoading={recommendationsLoading}  // skeleton rekomendasi
                            recommendations={recommendations}
                            onAmbiguousOptionClick={handleAmbiguousOptionClick}
                            onRecommendationClick={handleSend}
                        />

                        {/* Rekomendasi awal (fallback) - hanya saat tidak ada rekomendasi dan tidak loading */}
                        {messages.length === 1 && !recommendationsLoading && recommendations.length === 0 && (
                            <div className="flex flex-col space-y-2 mt-4 px-5">
                                <p className="text-xs text-gray-500 font-semibold mb-1">Mungkin Anda ingin bertanya:</p>
                                {[
                                    "Saya mau lihat daftar menu!",
                                    "Alamatnya dimana ya?",
                                    "Bagaimana cara reservasi di Royal's Resto?"
                                ].map((recom, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(recom)}
                                        className="text-left py-2 px-4 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 hover:border-amber-700 hover:text-amber-700 transition-all text-sm font-medium cursor-pointer"
                                    >
                                        {recom}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 z-50">
                <div className="max-w-3xl mx-auto md:mb-3 w-auto p-3 sm:p-4 border-t md:border md:rounded-xl border-gray-300">
                    <ChatInput onSend={handleSend} loading={waitingForResponse} />
                </div>
            </div>
        </div>
    );
};

export default UserPage;