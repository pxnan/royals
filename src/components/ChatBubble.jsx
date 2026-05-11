export default function ChatBubble({ sender, text }) {
  const isUser = sender === "user";
  return (
    <div className="ml-5 mr-5">
      <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
        <div
          className={`chat-bubble ${
            isUser
              ? "bg-neutral-800 text-white rounded-l-md rounded-tr-md"
              : "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black rounded-r-md rounded-tl-md before:!bg-yellow-500"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
