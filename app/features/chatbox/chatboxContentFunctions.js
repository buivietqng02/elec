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

    const handleMessCointainFile = (file) => {
        const { type } = file;
        const data = {};

        switch (type) {
            case 2:
                data.src = `${API_URL}/image?id=${file.id}&small=1`;
                return render(template.image, data);
            case 3:
                data.src = `${API_URL}/audio?id=${file.id}`;
                return render(template.audio, data);
            case 4:
                data.src = `${API_URL}/stream?id=${file.id}`;
                return render(template.video, data);
            default:
                data.src = `${API_URL}/file?id=${file.id}`;
                data.fileName = file.filename;
                data.fileSize = humanFileSize(file.size);
                return render(template.file, data);
        }
    };

    const renderComment = (quotedMessage) => {
        const {
            sender,
            message,
            file
        } = quotedMessage;
        const roomEdited = GLOBAL.getRoomInfoWasEdited();
        const name = htmlEncode(roomEdited[sender?.id]?.user_name || sender?.name);
        let text = transformLinkTextToHTML(decodeStringBase64(message));

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
                file
            } = messObject;
            const data = {
                id: id?.messageId,
                chatType: type,
                idLocal
            };
            let text = decodeStringBase64(message);

            // check add local
            if (idLocal) {
                data.classLocal = 'js_li_mess_local';
            }

            // render with case of join the room
            if (type === 5) {
                data.who = text;
                return render(template.joinGroup, data);
            }

            // render with case of left the room
            if (type === 7) {
                data.who = text;
                return render(template.leftGroup, data);
            }

            // render with calling
            if (type === 21 || type === 24) {
                data.mess = text;
                return render(template.call, data);
            }

            // highlight text if search exist
            if (search && search.id && search.id === id?.messageId) {
                text = highlightText(text, decodeStringBase64(search.value));
            }

            data.src = getAvatar(sender?.id);
            data.name = htmlEncode(roomEdited[sender?.id]?.user_name || sender?.name);
            data.officially_name = htmlEncode(sender?.name);
            data.userId = sender?.id;
            data.show_internal = internal ? '' : 'hidden';
            data.who = info.id === sender?.id ? 'you' : '';
            data.date = convertMessagetime(msgDate, GLOBAL.getLangJson());
            data.forward = forwarded ? 'fwme' : '';

            // render with case of comment
            if (
                text.indexOf('"></c>') > -1 
                && text.indexOf('<div class="col-xs-12 comment-box-inline" style="margin-left: 0;">') === -1 
                && !quotedMessage
            ) {
                try {
                    const splitMess = text.split('<c style="display:none" ob="');
                    const commentInfo = JSON.parse(splitMess[1].replace('"></c>', ''));
                    data.comment = `<div class="comment-box-inline" style="margin-left: 0;">${htmlEncode(roomEdited[commentInfo?.userId]?.user_name || commentInfo?.name)}: ${commentInfo.mess}</div>`;
                    data.mess = transformLinkTextToHTML(splitMess[0]);
                } catch (e) {
                    data.mess = transformLinkTextToHTML(text);
                }
            } else {
                if (quotedMessage) {
                    data.comment = renderComment(quotedMessage);
                }

                data.mess = transformLinkTextToHTML(text);
            }

            // render with case of file
            if (file) {
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
