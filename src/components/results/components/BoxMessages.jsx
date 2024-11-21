import { useEffect, useState, useRef } from "react";
import { getStandarMessageChatsByUser } from "../../../services/standardMessages.services";
import { useAuth } from "../../../Context/AuthContext";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useChatStandardSocket } from "../ChatStandardSocketProvider";
import ChatSocketListener from "./ChatSocketListener";
import { formatDate, formattedChatInfo } from "../../../helpers";
import { events } from "../../../enums/standardChatsEvents";


function BoxMessages({ isOpen }) { 
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isChatOpened, setIsChatOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const chatStandardSocket = useChatStandardSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchGetChats();
  }, [user.id, chat]);

  const fetchGetChats = async () => {
    setIsLoading(true); 
    try {
      const response = await getStandarMessageChatsByUser(user.id);
      if (response?.success) {
        const formattedChats = formattedChatInfo(response.data);
        setChats(formattedChats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const openChat = (chat) => {
    setChat(chat);
    setIsChatOpened(true);
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <ChatSocketListener socket={chatStandardSocket} />
      {!isChatOpened && (
        <div className="absolute right-[4px] h-[500px] w-[100%] md:w-[500px] overflow-y-auto rounded-[5px] border-2 border-[#8a2be2] bg-[#fff] p-4">
          <h2 className="mb-4 font-bold text-gray-500">Chats</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-[#8a2be2] border-t-transparent rounded-full" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.chatIndex}
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
            )
          )}
        </div>
      )}
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
          fetchGetChats={fetchGetChats}
        />
      )}
    </>
  );
}



export default BoxMessages;


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
    fetchGetChats
  } = props;

  useEffect(() => {
      if (chat.chatId) {
      chatStandardSocket.emit(events.JOIN_CHAT, chat.chatId);  
    }

   
    chatStandardSocket.on(events.RECEIVE_MESSAGE, (newMessage) => {
      if (newMessage.chatId === chat.chatId) {
        setChat((prevChat) => {
          const updatedMessages = [...prevChat.messages, newMessage];
          return { ...prevChat, messages: updatedMessages };
        });
        scrollToBottom(); 
      }
    });
    return () => {
      chatStandardSocket.off(events.RECEIVE_MESSAGE);
      chatStandardSocket.emit(events.LEAVE_CHAT, chat.chatId);  
    };
  }, [chat, chatStandardSocket, setChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        const scrollHeight = messagesEndRef.current.scrollHeight;
        const clientHeight = messagesEndRef.current.clientHeight;
        messagesEndRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }, 100);
  };

  const closeChat = async() => {
    setIsChatOpened(false);
    setChat(null); 
    await fetchGetChats();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      chatId: chat.chatId,
      recipientId:  chat.otherUserID,
      senderUserId: user.id,
      messageContent: message,
      updatedAt: new Date().toISOString(),
    };

    chatStandardSocket.emit(events.SEND_MESSAGE, newMessage);

    setChat((prevChat) => {
      const updatedMessages = [...prevChat.messages, newMessage];
      return { ...prevChat, messages: updatedMessages };
    });

    scrollToBottom(); 
    setMessage("");
  };

  return (
    <div className="absolute right-[4px] h-[500px] w-[100%] md:w-[500px] rounded-lg border border-[#8a2be2] bg-white p-4 shadow-lg">
      <div className="mb-4 flex cursor-pointer flex-row gap-1 font-bold text-gray-600 transition-colors">
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

      <div
        ref={messagesEndRef} 
        className="flex flex-col gap-2 overflow-y-auto rounded-md bg-gray-50 px-3 py-2 shadow-inner"
        style={{ height: '60%', overflowY: 'auto', scrollBehavior: 'smooth', }} 
      >
        {chat.messages
          .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
          .map((message, index) => (
            <div
            key={index}
            className={`rounded-lg py-2 px-4 text-sm min-w-[55%] ${
              message.senderUserId === user.id
                ? "self-end bg-[#a855f7] bg-gradient-to-r text-white text-right"
                : "self-start bg-gray-200 text-[#8a2be2] text-left"
            }`}
          >
                    
              <p className="mb-1">{message.messageContent}</p>
              <small className={`text-xs ${
                message.senderUserId === user.id
                  ? "text-[#fff] "
                  : "text-[#8a2be2]"
              }`}>{formatDate(message.updatedAt)}</small>
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






