import { useEffect, useState } from "react";
import { getStandarMessageChatsByUser } from "../../../services/standardMessages.services";
import { useAuth } from "../../../Context/AuthContext";

function BoxMessages({ isOpen, onClose }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [isChatOpened, setIsChatOpened] = useState(false);

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
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
      
        setChats(formattedChats);
      }
    };
    fetchGetChats();
  }, [user.id]);

  if (!isOpen || !user) return null;

  const openChat = (chat) => {
    setChat(chat);
    setIsChatOpened(true);
  }

  return (<>
    { !isChatOpened &&
    <div className="absolute w-[500px] h-[500px] bg-[#fff] right-[4px] p-4 overflow-y-auto border-2 border-[#8a2be2] rounded-[5px]">
      <h2 className="text-gray-500 font-bold mb-4">Chats</h2>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.chatId}
            className="flex items-center bg-white rounded-md shadow-md p-2 mb-4"
            onClick={()=>openChat(chat)}
          >
            <img
              src={chat.otherUserImage || "https://via.placeholder.com/50"}
              alt={chat.otherUserName}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <p className="text-black font-bold">{chat.otherUserName}</p>
              <p className="text-gray-500 text-sm">{chat.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">No chats available</p>
      )}
    </div>}
    {isChatOpened &&
    <div className="absolute w-[500px] h-[500px] bg-[#fff] right-[4px] p-4 overflow-y-auto border-2 border-[#8a2be2] rounded-[5px]">
    <h2 className="text-gray-500 font-bold mb-4 pointer" onClick={()=>{ setIsChatOpened(false);  setChat(null);} }>Volver</h2>
    </div>
    }
    </>
  );
}

export default BoxMessages;
