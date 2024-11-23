import {  createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatStandardSocketContext = createContext();

// Hook personalizado para usar el contexto de el chat standard
export const useChatStandardSocket = () => {
    return useContext(ChatStandardSocketContext);
}

const ChatStandardSocketProvider = ({children}) => {
    const [ socket, setSocket ] = useState(null);

    useEffect(()=>{
        // ('https://back-prueba.app.esturio.com/chat');
        const newSocket = io('http://localhost:4005/chat');
        setSocket(newSocket);
        return () =>{
            newSocket.close();
        }    
    },[]);
    return(
        <ChatStandardSocketContext.Provider value={socket}>
        {children}
        </ChatStandardSocketContext.Provider>
    )
}

export default ChatStandardSocketProvider;