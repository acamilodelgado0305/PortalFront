import { useEffect, useState } from "react";
import { getStandarMessageChatsByUser } from "../../../services/standardMessages.services";
function BoxMessages({isOpen,onClose}) {  
  const [chats, setChats] = useState([])
  useEffect(()=>{
   const fetchGetChats = async() =>{
     const response = await getStandarMessageChatsByUser('123');
     setChats(response.data);
   }
   fetchGetChats();
 },[])
 
if(!isOpen)  return null;
  return (
    <div className='absolute w-[500px] h-[500px] bg-[#D10621] right-[0px]'>
        boxMessages</div>
  )
}

export default BoxMessages