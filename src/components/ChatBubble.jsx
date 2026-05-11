export default function ChatBubble({ sender, text }) {
    const isUser = sender === "user";
    return (
        <div className="ml-5 mr-5">
            <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
                <div
                    className={`chat-bubble ${isUser ? "bg-neutral-800 text-white rounded-l-md rounded-tr-md" : "bg-amber-600 text-white rounded-r-md rounded-tl-md"}`}
                >
                    {text}
                </div>
            </div>
        </div>
    );
}
