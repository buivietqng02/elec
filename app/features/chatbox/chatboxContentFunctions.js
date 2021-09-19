define([
    'moment',
    'app/constant',
    'shared/alert',
    'shared/data',
    'shared/functions',
    'features/chatbox/chatboxContentTemplate'
], (
    moment,
    constant,
    ALERT,
    GLOBAL,
    functions,
    template
) => {
    const ob = {};
    const {
        render,
        getAvatar,
        convertMessagetime,
        humanFileSize,
        transformLinkTextToHTML,
        highlightText,
        htmlEncode,
        decodeStringBase64
    } = functions;
    const { API_URL } = constant;

    const timeConvert = (time) => {
        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(time / 60);
        let currentSeconds = Math.floor(time - currentMinutes * 60);
        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
        if (currentMinutes < 10) { currentMinutes = `0${currentMinutes}`; }
        return `${currentMinutes}:${currentSeconds}`;
    };

    const handleMessCointainFile = (file) => {
        const { type } = file;
        const data = {};
        let messageTemp = '';
        switch (type) {
            case 2:
                data.src = `${API_URL}/image?id=${file.id}&small=1`;
                messageTemp = render(template.image, data);
                break;
            case 3:
                data.src = `${API_URL}/audio?id=${file.id}`;
                data.audioId = `audio-${file.id}`;
                data.buttonId = `btn-${file.id}`;
                data.duration = file.filename;
                data.durationTime = timeConvert(parseFloat(file.filename));
                messageTemp = render(template.audio, data);
                console.log(file);
                break;
            case 4:
                data.src = `${API_URL}/stream?id=${file.id}`;
                messageTemp = render(template.video, data);
                break;
            default:
                data.src = `${API_URL}/file?id=${file.id}`;
                data.fileName = file.filename;
                data.fileSize = humanFileSize(file.size);
                messageTemp = render(template.file, data);
        }
        return messageTemp;
    };

    const renderComment = (quotedMessage) => {
        const {
            sender,
            message,
            file
        } = quotedMessage;
        const roomEdited = GLOBAL.getRoomInfoWasEdited();
        const name = htmlEncode(roomEdited[sender?.id]?.user_name || sender?.name);
        let text = transformLinkTextToHTML(htmlEncode(decodeStringBase64(message)));

        if (file) {
            text = handleMessCointainFile(file);
        }

        return `<div class="comment-box-inline" style="margin-left: 0;">${name}: ${text}</div>`;
    };

    ob.onHandleRoomWasDeleted = () => {
        const id = GLOBAL.getCurrentRoomId();
        const rooms = GLOBAL.getRooms().filter((room) => (room.id !== id));

        $('.js_caption').show();
        $('.js_wrap_mess').hide();
        $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${id}"]`).remove();
        GLOBAL.setRooms(rooms);
        GLOBAL.setCurrentRoomId(null);
        ALERT.show('This chat room no longer exists');
    };

    ob.onErrNetWork = (err) => {
        console.log(err);
        ALERT.show(GLOBAL.getLangJson().UNABLE_TO_CONNECT);
        GLOBAL.setCurrentRoomId(null);
        $('.js_caption').show();
        $('.js_wrap_mess').hide();
        $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`).removeClass('active');
    };

    ob.renderUnread = (mess) => {
        if (mess.posUnread) {
            // eslint-disable-next-line no-param-reassign
            mess.posUnread = false;
            return render(template.unread, {});
        }

        return '';
    };

    ob.renderRangeDate = (mess, i, messArr, isLoadMore) => {
        const momentMessDate = moment(mess.msgDate);
        const data = {};
        let mementPreviousMessDate = {};

        if (i === 0 && isLoadMore !== 'up') {
            data.date = momentMessDate.format('MMMM DD, YYYY');
            data.dateCode = momentMessDate.format('MMDDYYYY');
            return render(template.rangeDate, data);
        }

        if (i === 0 && isLoadMore === 'up') {
            mementPreviousMessDate = moment(messArr[messArr.length - 1].msgDate);
            if (!mementPreviousMessDate.isSame(momentMessDate, 'date')) {
                data.date = momentMessDate.format('MMMM DD, YYYY');
                data.dateCode = momentMessDate.format('MMDDYYYY');
                return render(template.rangeDate, data);
            }

            return '';
        }

        mementPreviousMessDate = moment(messArr[i - 1].msgDate);

        if (i === messArr.length - 1 && isLoadMore === 'down') {
            const momentNextMessDate = moment(messArr[0].msgDate);
            if (momentNextMessDate.isSame(momentMessDate, 'date')) {
                $(`[data-mess-date-code='${momentMessDate.format('MMDDYYYY')}']`).remove();
            }
        }

        if (!mementPreviousMessDate.isSame(momentMessDate, 'date')) {
            data.date = momentMessDate.format('MMMM DD, YYYY');
            data.dateCode = momentMessDate.format('MMDDYYYY');
            return render(template.rangeDate, data);
        }

        return '';
    };

    ob.renderMessage = (messObject, search) => {
        try {
            const info = GLOBAL.getInfomation();
            const roomEdited = GLOBAL.getRoomInfoWasEdited();
            const {
                sender,
                id,
                type,
                idLocal,
                message,
                quotedMessage,
                msgDate,
                internal,
                forwarded,
                file,
                updated,
                deleted,
                readByAllPartners
            } = messObject;
            const data = {
                id: id?.messageId,
                chatType: type,
                idLocal
            };
            let text = htmlEncode(decodeStringBase64(message));

            // check add local
            if (idLocal) {
                data.classLocal = 'js_li_mess_local';
            }

            // render in case of user was added to the room
            if (type === 5) {
                const lastComma = text.lastIndexOf(',');
                if (lastComma > 0) {
                    text = `${text.substring(0, lastComma)} and ${text.substring(lastComma + 1)}`;
                }
                data.who = `${sender.name} <b>added</b> ${text}`;
                return render(template.joinGroup, data);
            }

            // render in case user left the room
            if (type === 6) {
                data.who = `${sender.name} <b>left</b>`;
                return render(template.leftGroup, data);
            }

            // render in case user was removed from room
            if (type === 7) {
                if (sender.name === text) {
                    data.who = `${sender.name} <b>left</b>`;
                } else {
                    const lastComma = text.lastIndexOf(',');
                    if (lastComma > 0) {
                        text = `${text.substring(0, lastComma)} and ${text.substring(lastComma + 1)}`;
                    }
                    data.who = `${sender.name} <b>removed</b> ${text}`;
                }
                return render(template.leftGroup, data);
            }

            // render with calling
            if (type === 21 || type === 24) {
                data.mess = text;
                return render(template.call, data);
            }

            // highlight text if search exist
            if (search) {
                text = highlightText(text, decodeStringBase64(search));
            }

            data.src = getAvatar(sender?.id);
            data.name = htmlEncode(roomEdited[sender?.id]?.user_name || sender?.name);
            data.officially_name = htmlEncode(sender?.name);
            data.userId = sender?.id;
            data.show_internal = internal ? '' : 'hidden';
            data.who = info.id === sender?.id ? 'you' : '';
            data.date = convertMessagetime(msgDate, GLOBAL.getLangJson(), !!search);
            data.dateTimestamp = msgDate;
            data.forward = forwarded && !deleted ? 'fwme' : '';
            data.show_edited = updated && !deleted ? '' : 'hidden';
            data.class_removed = deleted ? '--message-removed' : '';
            data.hide_when_removed = deleted ? 'hidden' : '';
            data.hide_for_partner = (data.who !== 'you' || deleted) ? 'hidden' : '';
            data.class_read_by_partners = readByAllPartners ? '--read' : '';

            // render with case of comment
            if (quotedMessage && !deleted) {
                data.comment = renderComment(quotedMessage);
            }

            data.mess = transformLinkTextToHTML(text);

            // render with case of file
            if (file && !deleted) {
                data.isFile = 'have-file';
                data.mess = handleMessCointainFile(file);
            }

            return render(template.mess, data);
        } catch (e) {
            console.log(e);
            return '';
        }
    };

    return Object.freeze(ob);
});
