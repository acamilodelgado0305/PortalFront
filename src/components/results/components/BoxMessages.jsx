import { useEffect, useState, useRef } from "react";
import { getStandarMessageChatsByUser } from "../../../services/standardMessages.services";
import { useAuth } from "../../../Context/AuthContext";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useChatStandardSocket } from "../ChatStandardSocketProvider";
import ChatStandardSocketListener from "./ChatStandardSocketListener";

function BoxMessages({ isOpen, onClose }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isChatOpened, setIsChatOpened] = useState(false);
  const chatStandardSocket = useChatStandardSocket();
  const messagesEndRef = useRef(null); // Referencia para el contenedor de mensajes

  useEffect(() => {
    const fetchGetChats = async () => {
      const response = await getStandarMessageChatsByUser(user.id);
      if (response.success) {
        const formattedChats = response.data
          .map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1] || {};
            const otherUser = chat.otherUser?.data || {};
            return {
              chatId: chat.chatIndex,
              lastMessage: lastMessage.messageContent,
              timestamp: new Date(lastMessage.updatedAt),
              otherUserName: `${otherUser.firstName || "Unknown"} ${otherUser.lastName || ""}`,
              otherUserImage: otherUser.profileImageUrl,
              messages: chat.messages,
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp);

        setChats(formattedChats);
      }
    };

    fetchGetChats();
  }, [user.id]);

  // Desplazar al final de los mensajes cuando cambien
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  if (!isOpen || !user) return null;

  const openChat = (chat) => {
    setChat(chat);
    setIsChatOpened(true);
  };

  const closeChat = () => {
    setIsChatOpened(false);
    setChat(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim() === "") return;

    const newMessage = {
      chatId: chat.chatId,
      senderUserId: user.id,
      messageContent: message,
      updatedAt: new Date().toISOString(),
    };
    chatStandardSocket.emit("send_message", newMessage);

    setChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, newMessage],
    }));

    setMessage("");
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (today.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return messageDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <>
      <ChatStandardSocketListener socket={chatStandardSocket} />
      {!isChatOpened && (
        <div className="absolute right-[4px] h-[500px] w-[100%] md:w-[500px] overflow-y-auto rounded-[5px] border-2 border-[#8a2be2] bg-[#fff] p-4">
          <h2 className="mb-4 font-bold text-gray-500">Chats</h2>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.chatId}
                className="mb-4 flex cursor-pointer items-center rounded-md bg-white p-2 shadow-md"
                onClick={() => openChat(chat)}
              >
                <img
                  src={chat.otherUserImage || "https://via.placeholder.com/50"}
                  alt={chat.otherUserName}
                  className="mr-4 h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-black">{chat.otherUserName}</p>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No chats available</p>
          )}
        </div>
      )}
      {isChatOpened && (
        <div className="absolute right-[4px] h-[500px] w-[100%] md:w-[500px] rounded-lg border border-[#8a2be2] bg-white p-4 shadow-lg">
          <div className="mb-4 flex cursor-pointer flex-row gap-1 font-bold text-gray-600 transition-colors ">
            <ArrowLeftOutlined className="hover:text-[#8a2be2]" onClick={closeChat} />
            <img
              src={chat.otherUserImage || "https://via.placeholder.com/50"}
              alt={chat.otherUserName}
              className="mr-4 h-12 w-12 rounded-[4px] object-cover"
            />
            <div className="flex flex-col justify-center">
              <p className="font-bold text-gray">{chat.otherUserName}</p>
            </div>
          </div>

          <div className="flex h-[60%] flex-col gap-2 overflow-y-auto rounded-md bg-gray-50 px-3 py-2 shadow-inner">
  {chat.messages
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)) 
    .map((message) => (
      <div
        key={message.id}
        className={`rounded-lg p-3 text-sm ${
          message.senderUserId === user.id
            ? "self-end bg-[#a855f7] bg-gradient-to-r text-white"
            : "self-start bg-gray-200 text-gray-800"
        }`}
      >
        <p className="mb-1">{message.messageContent}</p>
        <small className="text-xs text-gray-400">
          {formatDate(message.updatedAt)}
        </small>
      </div>
    ))}
  <div ref={messagesEndRef} />
</div>


          <form className="mt-4" onSubmit={handleSendMessage}>
            <textarea
              className="h-12 w-full rounded-md border border-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-[#8a2be2]"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 w-full rounded-md border-[3.5px] border-transparent bg-[#a855f7] px-4 py-2 font-semibold text-white transition-all hover:border-black hover:bg-[#6A369C]"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default BoxMessages;
