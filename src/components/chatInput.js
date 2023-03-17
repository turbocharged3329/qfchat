import Dom from "./utils/dom.js";
export default class ChatInput extends Dom {
    constructor(options) {
        super()

        this.Emitter = options?.emitter;
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
        this.$input.addEventListener('keydown', this.onInputKeydown.bind(this))

        this.$sendBtn.setAttribute('type', 'button');
        this.$sendBtn.addEventListener('click', this.onClickSend.bind(this))
        sendBtnWrapper.append(this.$sendBtn);
        inputWrapper.append(this.$input);

        this.$root.append(inputWrapper);
        this.$root.append(sendBtnWrapper);

        return this.$root;
    }

    onClickSend(event) {
        event.stopPropagation();
        this.Emitter.emit('addMessage', 'user', this.$input.value);
        this.Emitter.emit('scrollToBottom');
        this.resetInput();
    }

    onInputKeydown(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.stopPropagation();
            event.preventDefault();
            this.Emitter.emit('addMessage', 'user', event.target.value);
            this.Emitter.emit('scrollToBottom');
            this.resetInput();
        }
    }

    resetInput() {
        this.$input.value = '';
        this.$input.rows = 1;
    }

    setInputHeight(event) {
        const lineHeight = getComputedStyle(event.target)['line-height'].replace('px', ''); 
        const paddingTop = getComputedStyle(event.target)['padding-top'].replace('px', ''); 
        const paddingBottom = getComputedStyle(event.target)['padding-top'].replace('px', ''); 
        
        if (event.target.rows < 10 && !event.inputType !== 'deleteContentBackward') {
            event.target.rows = (event.target.scrollHeight - paddingTop - paddingBottom) / +lineHeight
        } 
    
        if (!event.target.value) {
            event.target.rows = 1;
        }
    }
}