export const formattedChatInfo = (response) =>{
// https://img.freepik.com/vector-premium/circulo-morado-icono-persona-blanca_876006-6.jpg   violeta
// https://st3.depositphotos.com/7541698/32515/v/450/depositphotos_325154520-stock-illustration-talking-people-vector-icon-isolated.jpg // gris
// mulitcolot https://cdn-icons-png.flaticon.com/512/7153/7153150.png
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
              otherUserImage: otherUser.profileImageUrl || 'https://img.freepik.com/vector-premium/circulo-morado-icono-persona-blanca_876006-6.jpg',
              messages: chat.messages,
              chatId: chat.messages[0].chatId,
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp);
}