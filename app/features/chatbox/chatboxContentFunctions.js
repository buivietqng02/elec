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
        decodeStringBase64,
        stripTags
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
        // console.log(file);
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
                // console.log(file);
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

    // const handleQuotedMessFile = (file) => {
    //     const { type } = file;
    //     const data = {};
    //     let messageTemp = '';
    //     // console.log(file);
    //     switch (type) {
    //         case 2:
    //             data.src = `${API_URL}/image?id=${file.id}&small=1`;
    //             messageTemp = render(template.quotedImage, data);
    //             break;
    //         case 3:
    //             data.durationTime = timeConvert(parseFloat(file.filename));
    //             messageTemp = render(template.quotedAudio, data);
    //             break;
    //         case 4:
    //             data.src = `${API_URL}/stream?id=${file.id}`;
    //             messageTemp = render(template.video, data);
    //             break;
    //         default:
    //             data.fileName = file.filename;
    //             data.fileSize = humanFileSize(file.size);
    //             messageTemp = render(template.quotedFile, data);
    //     }
    //     return messageTemp;
    // };

    ob.renderTag = (message, tagArrs, isMessContent) => {
        let newTextTag = message;
        const regex = /@\[user:[a-z0-9]{12}]/g;

        if (regex.test(newTextTag)) {
            const tagArrInMessage = newTextTag.match(regex) || [];
            
            tagArrInMessage.forEach((item) => {
                const userid = item.substring(7, item.length - 1);
                if (!tagArrs) return;
                if (tagArrs.length > 0) {
                    const [cloneArr] = tagArrs;
                    if (!cloneArr) return;
                }
                tagArrs.forEach(ite => {
                    const userName = stripTags(ite.name);
                    if (ite.id === userid) {
                        if (isMessContent) {
                            newTextTag = newTextTag.replace(item, `<span class="tagged-person-js tagged-person" userid="${userid}"><img src="${getAvatar(userid)}" class="--img avatar">${userName}</span>`) || newTextTag;
                        } else {
                            newTextTag = newTextTag.replace(item, `<span class="tagged-person" userid="${userid}"><img src="${getAvatar(userid)}" class="--img avatar">${userName}</span>`) || newTextTag;
                        }
                    }
                });
            }); 
        }

        return newTextTag;
    };

    const renderComment = (quotedMessage) => {
        const {
            sender,
            message,
            file,
            sequence,
            taggedUsers
        } = quotedMessage;
        let shorternText;
        const roomEdited = GLOBAL.getRoomInfoWasEdited();
        const name = htmlEncode(roomEdited[sender?.id]?.user_name || sender?.name);
        let text = transformLinkTextToHTML(htmlEncode(decodeStringBase64(message)));
        text = ob.renderTag(text, taggedUsers);

        if (file) {
            text = handleMessCointainFile(file);
            shorternText = '';
        } else {
            shorternText = 'comment-text-shortern';
        }

        // console.log(text);

        return `<div class="comment-box-inline ${shorternText}" style="margin-left: 0;" quoted-original-id="origin-${quotedMessage.id.messageId}" quoted-original-sequence="${sequence}">${name}: ${text}</div>`;
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
                readByAllPartners,
                starred,
                sequence,
                pinned,
                taggedUsers,
                colorGroupUser,
                currentSenderId,
                previousSenderId
            } = messObject;
            const data = {
                id: id?.messageId,
                chatType: type,
                idLocal
            };
            sender.name = stripTags(sender?.name);

            let text = htmlEncode(decodeStringBase64(message));
            // Render in case message includes tag person
           
            text = ob.renderTag(text, taggedUsers, true);

            let isConferenceLink = false;
            let conferenceLink = '';

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

            // unpin message
            if (type === 8) {
                const lastComma = text.lastIndexOf(',');
                text = `${text.substring(0, lastComma)} ${text.substring(lastComma + 1)}`;
                    
                data.who = `<span class="unpin">${sender.name} <b>unpinned: </b> <span class="text">${text}</span></span>`;
                return render(template.pinMessage, data);
            }

            // pin message
            if (type === 9) {
                const lastComma = text.lastIndexOf(',');
                text = `${text.substring(0, lastComma)} ${text.substring(lastComma + 1)}`;
                
                data.who = `<span class="pin">${sender.name} <b>pinned: </b> <span class="text">${text}</span></span>`;
                return render(template.pinMessage, data);
            }

            // render with calling
            if (type === 21 || type === 22 || type === 24 
                || type === 25 || type === 27 || type === 23) {
                data.mess = text;
                return render(template.call, data);
            }

            // highlight text if search exist
            if (search) {
                text = highlightText(text, decodeStringBase64(search));
            }

            // Change text in case send code
            if (text.includes('::code::')) {
                text = text.replace(/(::code::\n|::code::)(.+)(\n::code::|::code::)/gs, '<code>$2</code>');
            } 

            // Render in case share conference link
            const enviroment = process.env.NODE_ENV === 'production' ? `https://${window.location.hostname}` : 'https://xm.iptp.dev';

            const confLink = `${enviroment}${constant.ROUTE.meeting}`;

            if (text.includes(`${enviroment}${constant.ROUTE.meeting}`) && text.length > 30) {
                isConferenceLink = true;
                const positionOfLinkConf = text.search(`${enviroment}${constant.ROUTE.meeting}`);
                const startIndexRoomId = positionOfLinkConf + confLink.length + 1;
                const endIndexRoomId = positionOfLinkConf + confLink.length + 12;
                conferenceLink = text.substring(startIndexRoomId, endIndexRoomId);
            } else {
                isConferenceLink = false;
            }

            data.src = getAvatar(sender?.id);
            data.name = htmlEncode(stripTags(roomEdited[sender?.id]?.user_name || sender?.name));
            data.officially_name = htmlEncode(stripTags(sender?.name));
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
            data.bookmark = starred ? 'bookmark' : '';
            data.is_conference_link = isConferenceLink && !deleted ? 'is_conference' : 'hidden';
            data.confRoom_chat_Id = conferenceLink;
            data.Invite_conference_call = GLOBAL.getLangJson().INVITE_CONFERENCE;
            data.JOIN = GLOBAL.getLangJson().JOIN;
            data.messSequence = sequence;
            data.pinned = pinned ? 'pinned' : '';
            data.beginChat = currentSenderId !== previousSenderId ? 'beginChat' : '';
            data.colorGroupUser = colorGroupUser ? `${colorGroupUser}` : '';

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
