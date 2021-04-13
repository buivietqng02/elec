define(['shared/data', 'shared/functions'], (GLOBAL, functions) => {
    const pushNotificationForMessage = message => {
        const text = functions.decodeStringBase64(message.message.replace(/<[^>]+>/g, ''));

        const notification = new Notification(message.sender.name, {
            body: text.replace(/<[^>]+>/g, ''),
            icon: '/assets/images/icon.png'
        });

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

        pushNotificationForMessage: message => {
            const info = GLOBAL.getInfomation();
            const obRoomEdited = GLOBAL.getRoomInfoWasEdited();

            if (
                window.Notification
                && Notification.permission === 'granted'
                && !document.hasFocus()
                && info.id !== message.sender.id
                && obRoomEdited[message.id.chatId]?.notification_mess !== false
            ) {
                pushNotificationForMessage(message);
            }
        }
    };
});
