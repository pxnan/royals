import React from 'react';
import ChatBubble from './ChatBubble';

const ChatWindow = ({ messages, loading, recommendationsLoading, recommendations, onAmbiguousOptionClick, onRecommendationClick }) => {
    return (
        <>
            {messages.map((msg, idx) => (
                <div key={idx}>
                    <ChatBubble sender={msg.sender} text={msg.text} />
                    {msg.sender === 'bot' && msg.ambiguousOptions && (
                        <div className="flex flex-col space-y-2 mt-2 ml-5">
                            {/* Tampilkan pertanyaan user yang asli */}
                            <div className="text-xs text-gray-500 mb-1">
                                Pertanyaan Anda: <span className="font-medium">"{msg.originalUserQuestion}"</span>
                            </div>
                            
                            {msg.ambiguousOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => onAmbiguousOptionClick(opt, msg.originalUserQuestion)}
                                    className="text-left py-2 px-4 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 hover:border-amber-700 hover:text-amber-700 transition-all text-sm font-medium cursor-pointer w-fit"
                                >
                                    {opt}
                                </button>
                            ))}
                            
                            {/* Tombol "Pertanyaan saya tidak ada" */}
                            <button
                                onClick={() => onAmbiguousOptionClick("__AMBIGUOUS_NOT_FOUND__", msg.originalUserQuestion)}
                                className="text-left py-2 px-4 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-600 hover:text-red-700 transition-all text-sm font-medium cursor-pointer w-fit mt-2"
                            >
                                ❌ Pertanyaan yang saya maksud tidak ada
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Skeleton untuk chat bubble */}
            {loading && (
                <div className="chat chat-start ml-5 mr-5">
                    <div className="chat-bubble skeleton h-8 w-24 bg-gray-200 text-gray-800"></div>
                </div>
            )}

            {/* Skeleton rekomendasi */}
            {recommendationsLoading && (
                <div className="flex flex-col space-y-2 mt-4 px-5">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Memuat rekomendasi...</p>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton h-10 w-full"></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Daftar rekomendasi */}
            {!recommendationsLoading && recommendations && recommendations.length > 0 && (
                <div className="flex flex-col space-y-2 mt-4 px-5">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Pertanyaan lain seputar topik ini:</p>
                    {recommendations.map((rec, i) => (
                        <button
                            key={i}
                            onClick={() => onRecommendationClick(rec)}
                            className="text-left py-2 px-4 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 hover:border-amber-700 hover:text-amber-700 transition-all text-sm font-medium cursor-pointer"
                        >
                            {rec}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default ChatWindow;