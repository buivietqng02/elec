define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions',
    'features/chatbox/chatboxContentChatList',
    'features/chatbox/chatboxContentFunctions'
], (
    constant,
    API,
    GLOBAL,
    functions,
    chatboxContentChatListComp,
    contentFunc
) => {
    let reviewMarkdownContainer;
    let reviewMDText;
    let textMarkdown = '';
    let closeMarkDown;
    let switchSendWithMDbtn;
    let howToUseMDBtn;
    let isChooseHideMD = false;

    const {
        renderTag
    } = contentFunc;

    const {
        getRoomById
    } = chatboxContentChatListComp;

    const {
        markDown,
        transformLinkTextToHTML,
        htmlEncode,
        decodeStringBase64,
        markDownCodeBlock
        // stripTags
    } = functions;

    const onOpenMD = () => {
        reviewMarkdownContainer.classList.add('show');
        closeMarkDown.disabled = false;
        switchSendWithMDbtn.disabled = false;
    };

    const onCloseMD = () => {
        reviewMarkdownContainer.classList.remove('show');
        closeMarkDown.disabled = true;
        switchSendWithMDbtn.disabled = true;
        textMarkdown = '';
        switchSendWithMDbtn.checked = false;
    };

    const onHideMDwhenSend = () => {
        isChooseHideMD = false;
        onCloseMD();
    };
 
    const onClickHideMD = () => {
        isChooseHideMD = true;
        onCloseMD();
    };

    const howToUseTemp = () => `
        <div class="modal fade" id="md-how-to-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>Style your message</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Syntax</th>
                                    <th scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>**Bold text**</td>
                                    <td><b>Bold text</b></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>*italic text*</td>
                                    <td><i>italic text</i></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>~~Strikethrough~~</td>
                                    <td><del>Strikethrough</del></td>
                                </tr>
                                <tr>
                                    <th scope="row">4</th>
                                    <td>Line break with &#8726; <br>some text</td>
                                    <td>Line break with<br><br>some text</td>
                                </tr>
                                <tr>
                                    <th scope="row">5</th>
                                    <td>&#96;Inline Code&#96;</td>
                                    <td><code style="color: #e83e8c">inline Code</code></td>
                                </tr>
                                <tr>
                                    <th scope="row">6</th>
                                    <td>
                                        &#96;&#96;&#96; <br>Block <br> Code <br>&#96;&#96;&#96;
                                        <br>
                                        <small>Note: you need a line break after and before the &#96;&#96;&#96;</small>
                                    </td>
                                    <td>
                                        <pre style="border: 1px dotted gray; background: lightgray; width: max-content;"><code>Block<br>Code</code></pre>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">7</th>
                                    <td>* List with +, -, or *</td>
                                    <td><li>List with +, -, or *</li></td>
                                </tr>
                                <tr>
                                    <th scope="row">8</th>
                                    <td>##### Emphasis</td>
                                    <td><h5>Emphasis</h5></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    const openModalHowToUse = () => {
        const $modal = $('#md-how-to-modal');
        if (!$modal.length) {
            $('body').append(howToUseTemp());
        }
        $('#md-how-to-modal').modal('show');
    };

    const onToggleReviewMarkdownBox = (value) => {
        // textMarkdown = stripTags(value);
        if (value.length === 0) {
            isChooseHideMD = false;
            onCloseMD();
        } 

        textMarkdown = markDown(value);
        textMarkdown = markDownCodeBlock(textMarkdown);
        const removedPTag = textMarkdown.replace(/<(\/|)p>/g, '');
        const tagRegex = /(<([^>]+)>)/gi;
        if (removedPTag.match(tagRegex) && !isChooseHideMD) {
            reviewMDText.innerHTML = textMarkdown;
            onOpenMD();
        } else {
            onCloseMD();
        }
    };

    // Markdown
    const onToggleMarkdown = (e) => {
        const linkMarkdownBtn = e.currentTarget;
        const message = e.currentTarget.closest('.js_li_list_mess');
        const chatId = message.getAttribute('data-chat-id');
        const roomId = GLOBAL.getCurrentRoomId();
        const chatListByRoom = getRoomById(roomId);
        let textMessage = '';

        const selectedMessObj = chatListByRoom.filter(item => item.id.messageId === chatId);
        if (!selectedMessObj[0].markdown) return;
        
        textMessage = htmlEncode(decodeStringBase64(selectedMessObj[0].message));

        if (message.classList.contains('markdown')) {
            linkMarkdownBtn.textContent = GLOBAL.getLangJson().SHOW_MARKDOWN;
        } else {
            linkMarkdownBtn.textContent = GLOBAL.getLangJson().SHOW_ORIGIN;
            textMessage = markDown(textMessage);
            textMessage = markDownCodeBlock(textMessage);
        }

        // TranformTextToLink
        textMessage = transformLinkTextToHTML(textMessage);

        // Render in case message includes tag person
        textMessage = renderTag(textMessage, selectedMessObj[0].taggedUsers, true);

        message.querySelector('.--mess').innerHTML = textMessage;
        message.classList.toggle('markdown');
    };

    return {
        onInit: () => {
            isChooseHideMD = false;
            reviewMarkdownContainer = document.querySelector('.js-view-markdown');
            reviewMDText = document.querySelector('.js-view-markdown-text');
            closeMarkDown = reviewMarkdownContainer.querySelector('.close-markdown');
            switchSendWithMDbtn = document.querySelector('#sendWithMarkdown');
            howToUseMDBtn = document.querySelector('.how-use-md');

            closeMarkDown.addEventListener('click', onClickHideMD);
            howToUseMDBtn.addEventListener('click', openModalHowToUse);
        },

        onToggleReviewMarkdownBox,

        onHideMDwhenSend,

        onToggleMarkdown
    };
});
