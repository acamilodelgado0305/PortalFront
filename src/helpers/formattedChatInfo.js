export const formattedChatInfo = (response) =>{


 return  response
          .map((chat) => {
            console.log('Otro usuario: ')
            console.log(JSON.stringify(chat.otherUser))
            const lastMessage = chat.messages[chat.messages.length - 1] || {};
            const otherUser = chat.otherUser || {};
            return {
              chatIndex: chat.chatIndex,
              lastMessage: lastMessage.messageContent,
              timestamp: new Date(lastMessage.updatedAt),
              otherUserName: `${otherUser.firstName || "Unknown"} ${
                otherUser.lastName || ""
              }`,
              otherUserID: otherUser.id,
              otherUserImage: otherUser.profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVWEVLolIV4bhei6NmC_4Q7gVdygDmvdDdRA&s',
              messages: chat.messages,
              chatId: chat.messages[0].chatId,
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp);
}