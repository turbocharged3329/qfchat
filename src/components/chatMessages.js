import Dom from "./utils/dom.js";

export default class ChatMessages extends Dom {
    constructor(options) {
        super()

        this.Emitter = options?.emitter;
    }

    init() {
        this.$root = null;
        this.messages = [];

        this.Emitter.subscribe('addMessage', this.addMessage.bind(this))
    }

    createChatMessagesSection() {
        this.$root = this.createElement('div', 'qfchat-chat-messages');

        return this.$root;
    }

    createMessage(role, text) {
        const message = this.createElement('div',[
            'qfchat-chat-messages__message',
            `qfchat-chat-messages__message-${role}` 
        ]);
        
        message.innerHTML = text.replace(/\n/g, '<br>').trim();

        return message;
    }

    addMessage(role, text) {
        this.$root.append(this.createMessage(role, text));
        
        if (!this.messages.length) {
            this.Emitter.emit('hidePlaceholder');
        }

        this.messages.push({
            role,
            text
        })
        this.$root.append(this.createMessage('comp', '123'));
    }
}