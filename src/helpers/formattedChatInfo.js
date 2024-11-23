export const formattedChatInfo = (response) =>{
 return  response
          .map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1] || {};
            const otherUser = chat.otherUser?.data || {};
            return {
              chatIndex: chat.chatIndex,
              lastMessage: lastMessage.messageContent,
              timestamp: new Date(lastMessage.updatedAt),
              otherUserName: `${otherUser.firstName || "Unknown"} ${
                otherUser.lastName || ""
              }`,
              otherUserID: otherUser.id,
              otherUserImage: otherUser.profileImageUrl,
              messages: chat.messages,
              chatId: chat.messages[0].chatId,
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp);
}