function ChatMessage({ role, message }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex mb-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-2xl px-5 py-4 rounded-2xl ${
          isUser
            ? "bg-purple-600 text-white rounded-br-md"
            : "bg-[#1A1A22] text-gray-200 rounded-bl-md border border-[#2D2D38]"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

export default ChatMessage;