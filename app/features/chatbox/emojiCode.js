define([
    'features/chatbox/chatboxInput',
    'features/chatbox/emojis.json'
], (
    chatboxInputComp,
    emojis
) => {
    let $input;
    let $wrapper;
    let $header;
    let $list;
    let render;
    const maxEmojisInList = 5;
    const shortcodeForCodeField = '::code::';
    let selectedId = 0;

    // Get word on position
    const findWord = (str, pos) => {
        let i = 0;
        const strLen = str.length;
        let start = 0;

        if (str.substring(pos, pos + 1).search(/\s/i) !== -1) return false;
        for (i = pos; i > -1; i -= 1) {
            if (str.substring(i, pos).search(/\s/i) !== -1) break;
        }
        if (i) start = i + 1;
        for (i = pos; i <= strLen; i += 1) {
            if (str.substring(i, pos).search(/\s/i) !== -1) break;
        }
        let end = strLen - 1;
        if (i) end = i - 1;
        return str.substring(start, end);
    };

    // Change shortcode caret is on to emoji
    const changeWord = (pos, emoji) => {
        const str = $input.val();
        let i = 0;
        const strLen = str.length;
        let start = 0;
        const a = 0;
        const b = str.length;

        if (str.substring(pos, pos + 1).search(/\s/i) !== -1) return false;
        for (i = pos; i > -1; i -= 1) {
            if (str.substring(i, pos).search(/::/i) !== -1) break;
        }
        if (i) start = i;
        for (i = pos; i <= strLen; i += 1) {
            if (str.substring(i, pos).search(/\s/i) !== -1) break;
        }
        let end = strLen - 1;
        if (i) end = i;
        $input.val(`${str.substring(a, start)} ${emoji} ${str.substring(end, b)}`);
        return 0;
    };

    // Get caret position in input
    const getCaretPos = (el) => {
        if (el.selectionStart) { 
            return el.selectionStart; 
        } 
        if (document.selection) {
            el.focus(); 
            const range = document.selection.createRange(); 
            if (range == null) { return 0; } 
            const textRange = el.createTextRange();
            const textRangeCopy = textRange.duplicate(); 
            textRange.moveToBookmark(range.getBookmark()); 
            textRangeCopy.setEndPoint('EndToStart', textRange); 
            return textRangeCopy.text.length; 
        }  
        return 0; 
    };

    // Get indexes of repeated codes
    const getIdRepeat = (code) => {
        const indexes = [];
        const lowerCaseTextString = $input.val().toLowerCase();
        const lowerCaseWord = code.toLowerCase();
        let index = 0;

        while (index !== -1) {
            index = lowerCaseTextString.indexOf(lowerCaseWord, index);
            if (index !== -1) {
                indexes.push(index);
                index += 1;
            }
        }
        return indexes;
    };

    // Get emoji matching shortcode
    const getEmoji = (code) => {
        const emojisFind = {};
        Object.keys(emojis.emojis).forEach((key) => {
            if (Object.keys(emojisFind).length < maxEmojisInList) {
                if (key.indexOf(code.replace(/::/g, '').toLowerCase()) > -1) {
                    emojisFind[key] = emojis.emojis[key].emoji;
                    $header.html(code);
                }
            }
        });
        return emojisFind;
    };

    // Hide selected on hover
    const onHover = () => {
        $list.find('.btn-em-code.selected').removeClass('selected');
        selectedId = false;
    };
    
    // Change shortocde to emoji in input
    const addEmojiToInput = (e) => {
        const $this = $(e.currentTarget);
        const { emCode } = $this.data();
        const caretPos = getCaretPos($input[0]) - 1;
        changeWord(caretPos, emCode);
        $wrapper.hide();
        $input.focus();
    };

    // Events on keydown
    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedId < e.data.strLen - 1) {
                selectedId += 1;
            } else {
                selectedId = 0;
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedId !== 0) {
                selectedId -= 1;
            } else {
                selectedId = e.data.strLen - 1;
            }
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            addEmojiToInput({ currentTarget: $list.find('.btn-em-code.selected') });
        }
    };

    // Clean and hide wrapper
    const cleanWrapper = () => {
        $list.html('');
        $header.html('');
        $wrapper.hide();
        $input.off('keydown', onKeyDown);
    };

    // Render wrapper emoji
    const renderWrapper = (data) => {
        if (Object.keys(data).length > 0) {
            $wrapper.show();
            $wrapper.off('hover', onHover).hover(onHover);
            render = '';
            Object.keys(data).forEach((key, id) => {
                render += `
                    <button class="btn-em-code ${id === selectedId ? 'selected' : ''}" data-em-id="${id}" data-em-code="${data[key]}">${data[key]} ::${key}::</button>
                `;
            });
            $list.html(render);
            console.log($wrapper);
            $input.off('keydown', onKeyDown).keydown({ strLen: Object.keys(data).length }, onKeyDown);
        } else {
            cleanWrapper();
        }
    };

    // Change shortcode to emoji
    const changeCode = () => {
        if ($input.val().match(/::[A-z0-9]+::/)) {
            const codes = $input.val().match(/::[A-z0-9]+::/g);
            let change = false;
            codes.forEach((code, id) => {
                if (code === '::code::') {
                    // Set true on first shortcode for code field
                    // and false on second
                    if (change === false) {
                        change = true;
                    } else {
                        change = false;
                    }
                }
                if (!change) {
                    if (emojis.emojis[code.replace(/::/g, '')]) {
                        if (id < codes.length - 1) {
                            // Change before code field
                            $input.val($input.val().replace(new RegExp(`^${code}`), emojis.emojis[code.replace(/::/g, '')].emoji, ''));
                        } else {
                            // Change after code field
                            $input.val($input.val().replace(new RegExp(`${code}$`), emojis.emojis[code.replace(/::/g, '')].emoji, ''));
                        }
                        cleanWrapper();
                    }
                }
            });
        }
    };

    const codesHelper = () => {
        const caretPos = getCaretPos($input[0]) - 1;
        const word = findWord($input.val(), caretPos);
        try {
            const code = word.match(/::[A-z0-9]+/g)[0];
            const codeFieldRange = getIdRepeat(shortcodeForCodeField);

            // Check word is not shortcode for code field
            if (word === '::code') {
                cleanWrapper();
                return;
            }

            // Check caret pos is not in code field
            for (let i = 0; i <= codeFieldRange.length; i += 2) {
                if (codeFieldRange[i + 1]) {
                    if (codeFieldRange[i] < caretPos && codeFieldRange[i + 1] > caretPos) {
                        cleanWrapper();
                        return;
                    }
                } else if (codeFieldRange[i] < caretPos) {
                        cleanWrapper();
                        return;
                }
            }
            renderWrapper(getEmoji(code));
        } catch {
            cleanWrapper();
        }
    };

    const onChange = () => {
        codesHelper();
        changeCode();
    };

    return {
        onInit: () => {
            $input = $('.js_endter_mess');
            $wrapper = $('.wrap-emoji-codes');
            $header = $wrapper.find('.emoji-code');
            $list = $wrapper.find('.--list');
            $input.off('input change keyup click').on('input change keyup click', onChange);
            $(document).off('.emojiCode').on('click.emojiCode', '[data-em-code]', addEmojiToInput);
        }
    };
});
