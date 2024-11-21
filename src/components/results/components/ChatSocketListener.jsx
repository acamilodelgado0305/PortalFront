import { useEffect } from "react";
import { events } from "../../../enums/standardChatsEvents";

function ChatSocketListener({ socket, chat, setChat, scrollToBottom, fetchGetChats }) {
  useEffect(() => {
    if (chat.chatId) {
      socket.emit(events.JOIN_CHAT, chat.chatId);
    }

    const handleMessageReceived = async(newMessage) => {
      if (newMessage.chatId === chat.chatId) {
        setChat((prevChat) => {
          const updatedMessages = [...prevChat.messages, newMessage];
          return { ...prevChat, messages: updatedMessages };
        });
        scrollToBottom();
        await fetchGetChats();
      }
    };

    socket.on(events.RECEIVE_MESSAGE, handleMessageReceived);

    return () => {
      socket.off(events.RECEIVE_MESSAGE, handleMessageReceived);
      socket.emit(events.LEAVE_CHAT, chat.chatId);
    };
  }, [chat, socket, setChat, scrollToBottom]);

  return null; // Este componente no tiene representación visual.
}

export default ChatSocketListener;
