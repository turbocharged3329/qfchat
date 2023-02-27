import Dom from "./utils/dom.js";

export default class ChatInput extends Dom {
    constructor() {
        super()
    }

    init() {
        this.$root = null;
        this.$sendBtn = null;
        this.$input = null;
    }

    createChatInput() {
        this.$root = this.createElement('div', 'qfchat-chat-input');

        const inputWrapper = this.createElement('div', 'qfchat-chat-input__input-wrapper');
        this.$input = this.createElement('textarea', 'qfchat-chat-input__input')

        const sendBtnWrapper = this.createElement('div', 'qfchat-chat-input__send-btn-wrapper');
        this.$sendBtn = this.createElement('button', 'qfchat-chat-input__send-btn');

        this.$input.setAttribute('placeholder', 'Введие сообщение')
        this.$input.setAttribute('rows', '1')
        this.$input.setAttribute('autocomplete', 'false')
        this.$input.addEventListener('input', this.setInputHeight.bind(this)) 

        this.$sendBtn.setAttribute('type', 'button');
        sendBtnWrapper.append(this.$sendBtn);
        inputWrapper.append(this.$input);

        this.$root.append(inputWrapper);
        this.$root.append(sendBtnWrapper);

        return this.$root;
    }

    setInputHeight(event) {
        const lineHeight = getComputedStyle(event.target)['line-height'].replace('px', ''); 

        if (event.target.rows < 4 && !event.inputType !== 'deleteContentBackward') {
            event.target.rows = event.target.scrollHeight / lineHeight
        } 

        // if (event.inputType === 'deleteContentBackward') {
        //     const rowsInFact = Math.ceil(event.target.value.length / symbolsInRow);
        //     const symbolsInRow = 21;
        //     console.log(rowsInFact);
        //     event.target.rows = rowsInFact < 4 ? rowsInFact : 4;
        // }
    }
}