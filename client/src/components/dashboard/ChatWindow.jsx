import ChatMessage from "./ChatMessage";

function ChatWindow() {
  return (
    <div className="flex-1 overflow-y-auto p-8">

      <ChatMessage
        role="user"
        message="What is Retrieval-Augmented Generation?"
      />

      <ChatMessage
        role="assistant"
        message="Retrieval-Augmented Generation (RAG) combines information retrieval with Large Language Models. Before generating an answer, the AI searches a knowledge base for relevant information, making responses more accurate and up to date."
      />

      <ChatMessage
        role="user"
        message="Can you explain it with a simple example?"
      />

      <ChatMessage
        role="assistant"
        message="Imagine you have an open-book exam. Instead of answering only from memory, you first open the right page in the book and then write your answer. RAG works in a similar way."
      />

    </div>
  );
}

export default ChatWindow;