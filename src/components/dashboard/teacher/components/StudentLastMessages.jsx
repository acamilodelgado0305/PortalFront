import { useEffect, useState } from 'react'
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { getStandarMessageChatsByUser } from '../../../../services/standardMessages.services';
import { formattedChatInfo } from "../../../../helpers";

function StudentLastMessages({user}) {
    const [chats, setChats] = useState([]);
    useEffect(() => {
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
          fetchGetChats();
    }, [user.id]);

    const handleOpenMessagesBox =()=>{
        const event = new Event("openBoxMessage");
        window.dispatchEvent(event);
    }


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-purple-600 mb-4">Chat con Estudiantes</h2>
    <div className="space-y-4">
        {/* Solo quiero que se vean los ultimos tres chats de la lista de chats */}
        {chats.slice(0,3).map((conversation, index) => (
            <div key={index} className="flex items-center space-x-4">
                <MessageOutlined className="text-purple-600 w-6 h-6" />
                <span className="text-lg font-semibold">{conversation.otherUserName}</span>
                <p className="text-gray-500">
                {conversation.lastMessage}
                </p>
            </div>
        ))}
    </div>
    <Button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all" onClick={handleOpenMessagesBox}>
        Enviar Mensaje
    </Button>
</div>
  )
}

export default StudentLastMessages