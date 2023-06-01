import Dom from "./utils/dom.js";
export default class ChatInput extends Dom {
    constructor(options) {
        super()
        this.sessionUuid = options.sessionUuid;
        this.Emitter = options?.emitter;
    }

    init() {
        this.$root = null;
        this.$sendBtn = null;
        this.$input = null;

        this.Emitter.subscribe('disableInput', this.disableInput.bind(this))
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
        this.$input.addEventListener('focus', this.emitScrollTop.bind(this))

        this.$sendBtn.setAttribute('type', 'button');
        this.$sendBtn.addEventListener('click', this.onClickSend.bind(this))
        sendBtnWrapper.append(this.$sendBtn);
        inputWrapper.append(this.$input);

        this.$root.append(inputWrapper);
        this.$root.append(sendBtnWrapper);

        return this.$root;
    }

    async onClickSend(event) {
        event.stopPropagation();

        if (this.$input.value) {
            const messageText = this.$input.value;

            this.Emitter.emit('addMessage', 'user', messageText);
            this.emitScrollTop()
            this.resetInput();

            this.getAnswerFromAPI(messageText)
        }
    }

    async onInputKeydown(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            if (this.$input.value) { 
                event.stopPropagation();
                event.preventDefault();

                const messageText = this.$input.value;

                this.Emitter.emit('addMessage', 'user', messageText);
                this.resetInput();

                this.getAnswerFromAPI(messageText);

            } else {
                event.preventDefault()
                this.$input.blur()
            }
        }
    }

    async getAnswerFromAPI(messageText) {
        const answer = await this.sendMessageToAPI(messageText);
        const answerData = await answer.json();

        if (answerData.text) {
            this.Emitter.emit('answer', answerData['response_text']);
        } else if (answerData.lead_message) {
            this.Emitter.emit('lead_message', answerData);
        }
    }

    async sendMessageToAPI(messageText) {
        return fetch('http://localhost:9999/chat-gpt-api', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: 2,
                text: messageText,
                session_uuid: this.sessionUuid
            })
        })
    }

    resetInput() {
        this.$input.value = '';
        this.$input.rows = 1;
    }

    disableInput() {
        this.$input.value = '';
        this.$input.setAttribute('disabled', 'disabled');
        this.$sendBtn.classList.add('qfchat__send-btn-disabled');
        this.stratCountdownToReset(10);
    }

    enableInput() {
        this.$input.removeAttribute('disabled');
        this.$sendBtn.classList.remove('qfchat__send-btn-disabled');
    }

    stratCountdownToReset(time) {
        let timeout = setTimeout(() => {
            this.Emitter.emit('resetChat');
            this.enableInput();
            clearTimeout(timeout);
        }, time * 1000)
    }

    emitScrollTop() {
        this.Emitter.emit('scrollToBottom');
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