import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend, loading }) {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    // Fokus otomatis hanya untuk desktop (mencegah keyboard muncul otomatis di mobile)
    const focusInput = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
        if (!isMobile) {
            inputRef.current?.focus();
        }
    };

    // Fokus saat komponen mount
    useEffect(() => {
        focusInput();
    }, []);

    // Fokus setelah input dikirim
    useEffect(() => {
        if (!loading) {
            focusInput();
        }
    }, [loading]);

    const handleSend = () => {
        if (!input.trim() || loading) return;
        onSend(input);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex gap-2 flex-wrap items-center">
            <input
                ref={inputRef} // <-- ref ditambahkan
                type="text"
                placeholder="Tulis pertanyaan..."
                className="input rounded-md border-gray-500 input-primary p-3 flex-1 min-w-[150px] focus:outline-none focus:border-none focus:ring-1 focus:ring-amber-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
            />

            <button
                className="btn bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 rounded-md text-white hover:to-yellow-500 
               transition-all hover:text-white border-none flex items-center gap-2 min-w-[100px]"
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="loading loading-spinner"></span>
                    </>
                ) : (
                    "Kirim"
                )}
            </button>
        </div>
    );
}
