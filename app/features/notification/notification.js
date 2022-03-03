define([
    'shared/data', 
    'shared/functions',
    'features/chatbox/chatboxContentFunctions'
], (GLOBAL, functions, chatboxContentFunctions) => {
    const pushNotificationForMessage = (message, room) => {
        // Notification for edit message
        const editMessage = message.updated ? ' (Edited message)' : '';
        const unpinMessage = message.type === 8 ? ' (Unpinned message)' : '';
        const pinMessage = message.type === 9 ? ' (Pinned message)' : '';
        const tagPerson = message.type === 'tag' ? ' (You are tagged)' : '';

        let title;
        let text;

        if (message.type === 'tag') {
            title = message.chat.subject;
            text = `${message.sender.name} has mentioned you in "${message.chat.subject}" group`;
        } else {
            title = room.group ? room.subject : message.sender.name;
            const decodedMessage = functions.decodeStringBase64(message.message.replace(/<[^>]+>/g, ''));
            text = `${room.group ? `${message.sender.name}: ${decodedMessage}` : decodedMessage}`;
    
            // Render in case tag person
            text = chatboxContentFunctions.renderTag(text);
        }

        const notification = new Notification(
            title + editMessage + unpinMessage + pinMessage + tagPerson, 
            {
                body: text.replace(/<[^>]+>/g, ''),
                icon: '/assets/images/icon.png'
            }
        );

        const clickNotification = event => {
            // prevent the browser from focusing the Notification's tab
            event.preventDefault();
            // window.open('https://' + XM_URL + '/main.html#' + chatId, '_blank');
            notification.close();
        };

        notification.onclick = clickNotification;
    };

    return {
        onInit: () => {
            if (window.Notification) {
                if (!('Notification' in window)) {
                    return;
                }
                
                try {
                    Notification.requestPermission().then(() => {});
                } catch (error) {
                    if (error instanceof TypeError) {
                        Notification.requestPermission();
                    } else {
                        throw error;
                    }
                }  
            }
        },

        pushNotificationForMessage: (message, room) => {
            const info = GLOBAL.getInfomation();

            if (
                window.Notification
                && Notification.permission === 'granted'
                && !document.hasFocus()
                && info.id !== message.sender.id
                && !room.muted
            ) {
                pushNotificationForMessage(message, room);
            }
        }
    };
});
