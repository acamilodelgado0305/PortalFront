import { useEffect, useState, useRef } from "react";
import { getStandarMessageChatsByUser } from "../../services/standardMessages.services.js";
import { useAuth } from "../../Context/AuthContext.jsx";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useChatStandardSocket } from "../results/ChatStandardSocketProvider.jsx";
import { formatDate, formattedChatInfo } from "../../helpers";
import { events } from "../../enums/standardChatsEvents.js";
import ChatSocketListener from "./ChatSocketListener";
import "./BoxMessages.css";

function BoxMessages({ isOpen, setIsOpenMessageBox, chats, setChats }) {
  const { user } = useAuth();

  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isChatOpened, setIsChatOpened] = useState(false);
  const chatStandardSocket = useChatStandardSocket();
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    window.addEventListener("sendMessage", fetchGetChats);
    window.addEventListener("chatExist", openExistingChat);
    window.addEventListener("openConversation",openExistingChat )
    fetchGetChats();
    return () => {
      window.removeEventListener("sendMessage", fetchGetChats);
      window.removeEventListener("chatExist", openExistingChat);
      window.addEventListener("openConversation",openExistingChat );
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsChatOpened(false);
        setIsOpenMessageBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchGetChats();
  }, [user.id]);

  useEffect(() => {}, [chats.length]);

  const fetchGetChats = async () => {
    try {
      const response = await getStandarMessageChatsByUser(user.id);
      if (response?.success) {
        const formattedChats = formattedChatInfo(response.data);
        setChats(formattedChats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const openExistingChat = async (e) => {
    const chat = e?.detail?.chat;
    if (chat) {
      window.scrollTo(0, 0);
      openChat(chat);
      setIsOpenMessageBox(true);
    }
  };

  const openChat = (chat) => {
    setChat(chat);
    setIsChatOpened(true);
  };

  if (!isOpen || !user) return null;

  return (
    <div ref={messagesRef}>
      {!isChatOpened && <ChatList chats={chats} openChat={openChat} />}
      {isChatOpened && (
        <ChatOpened
          chat={chat}
          user={user}
          setIsChatOpened={setIsChatOpened}
          setChat={setChat}
          formatDate={formatDate}
          messagesEndRef={messagesEndRef}
          setMessage={setMessage}
          message={message}
          chatStandardSocket={chatStandardSocket}
          setChats={setChats}
        />
      )}
    </div>
  );
}

export default BoxMessages;

function ChatList({ chats, openChat }) {
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    if (chats.length > 0) {
      setIsLoading(false);
    } else {
      const timeout = setTimeout(() => {
        setTimeoutReached(true);
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [chats]);

  return (
    <div className="absolute right-[4px] z-[999999] h-[500px] w-[100%] overflow-y-auto rounded-[5px] border-2 border-[#8a2be2] bg-white p-4 md:w-[500px]">
      <h2 className="mb-4 font-bold text-gray-500">Chats</h2>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : chats.length > 0 ? (
        chats.map((conversation) => {
          return (
            <div
              key={conversation.chatIndex}
              className="mb-4 flex cursor-pointer items-center rounded-md bg-white p-2 shadow-md"
              onClick={() => openChat(conversation)}
            >
              <img
                src={
                  conversation.otherUserImage ||
                  "https://via.placeholder.com/50"
                }
                alt={conversation.otherUserName}
                className="mr-4 h-12 w-12 rounded-full object-contain"
              />

              <div>
                <p className="font-bold text-black">
                  {conversation.otherUserName}
                </p>
                <p className="text-sm text-gray-500">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          );
        })
      ) : timeoutReached ? (
        <p className="text-gray-500">No chats available</p>
      ) : null}
    </div>
  );
}

const ChatOpened = (props) => {
  const {
    chat,
    setIsChatOpened,
    setChat,
    formatDate,
    chatStandardSocket,
    user,
    message,
    setMessage,
    messagesEndRef,
    setChats,
  } = props;

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        const scrollHeight = messagesEndRef.current.scrollHeight;
        const clientHeight = messagesEndRef.current.clientHeight;
        messagesEndRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }, 100);
  };
  scrollToBottom();
  const closeChat = async () => {
    setIsChatOpened(false);
    setChat(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      chatId: chat.chatId,
      recipientId: chat.otherUserID,
      senderUserId: user.id,
      messageContent: message,
      updatedAt: new Date().toISOString(),
    };

    chatStandardSocket.emit(events.SEND_MESSAGE, newMessage);

    setChat((prevChat) => {
      const updatedMessages = [...prevChat.messages, newMessage];
      return {
        ...prevChat,
        messages: updatedMessages,
        lastMessage: newMessage,
      };
    });

    setChats((prevChats) => {
      return prevChats.map((chatItem) =>
        chatItem.chatId === chat.chatId
          ? {
              ...chatItem,
              lastMessage: newMessage.messageContent,
              updatedAt: newMessage.updatedAt,
              messages: [...chatItem.messages, newMessage],
            }
          : chatItem,
      );
    });

    scrollToBottom();
    setMessage("");
  };

  return (
    <div className="absolute right-[4px] z-[999999] h-[500px] w-[100%] rounded-lg border border-[#8a2be2] bg-white p-4 shadow-lg md:w-[500px]">
      <ChatSocketListener
        socket={chatStandardSocket}
        chat={chat}
        setChat={setChat}
        scrollToBottom={scrollToBottom}
      />
      <div className="mb-4 flex cursor-pointer flex-row gap-1 font-bold text-gray-600 transition-colors">
        <ArrowLeftOutlined
          className="hover:text-[#8a2be2]"
          onClick={closeChat}
        />
        <img
          src={chat.otherUserImage || "https://via.placeholder.com/50"}
          alt={chat.otherUserName}
          className="mr-4 h-12 w-12 rounded-[4px] object-contain"
        />
        <div className="flex flex-col justify-center">
          <p className="text-gray font-bold">{chat.otherUserName}</p>
        </div>
      </div>

      <div
        ref={messagesEndRef}
        className="flex flex-col gap-2 overflow-y-auto rounded-md bg-gray-50 px-3 py-2 shadow-inner"
        style={{ height: "60%", overflowY: "auto", scrollBehavior: "smooth" }}
      >
        {chat.messages
          .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
          .map((message, index) => (
            <div
              key={index}
              className={`min-w-[55%] rounded-lg px-4 py-2 text-sm ${
                message.senderUserId === user.id
                  ? "message-outgoing self-end"
                  : "message-incoming self-start"
              }`}
            >
              <p className="mb-1">{message.messageContent}</p>
              <small
                className={`text-xs ${
                  message.senderUserId === user.id
                    ? "text-black"
                    : "text-[#8a2be2]"
                }`}
              >
                {formatDate(message.updatedAt)}
              </small>
            </div>
          ))}
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
  );
};
