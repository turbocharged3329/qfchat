import Dom from "./utils/dom.js";

export default class ChatMessages extends Dom {
    constructor(options) {
        super()

        this.Emitter = options?.emitter;
        this.messagesState = options.messagesState;
    }

    init() {
        this.$root = null;

        this.Emitter.subscribe('addMessage', this.addMessage.bind(this))
        this.Emitter.subscribe('hasWelcomeMessages', this.addWelcomeMessagesInDialog.bind(this))

        // setTimeout(() => {
        //     this.addLeadMessage()
        // }, 3000)
    }

    createChatMessagesSection() {
        this.$root = this.createElement('div', 'qfchat-chat-messages');

        return this.$root;
    }

    createMessage(role, text) {
        const message = this.createElement('div',[
            'qfchat-chat-messages__message',
            `qfchat-chat-messages__message-${role}`,
            'qfchat-chat-messages__message-writing'
        ]);
        
        if (role === 'comp') {
            const loaderIcon = this.createElement('i', 'qfchat-chat-messages__message-writing-icon');
            message.append(loaderIcon)
            
            setTimeout(() => {
                message.innerHTML = text.replace(/\n/g, '<br>').trim();
            }, 1500)
        } else {
            message.innerHTML = text.replace(/\n/g, '<br>').trim();
        } 

        return message;
    }

    addMessage(role, text) {
        this.$root.append(this.createMessage(role, text));

        if (!this.messagesState.messages.length) {
            this.Emitter.emit('hidePlaceholder');
        }

        this.Emitter.emit('playMessageSound');

        this.messagesState.addMessage({role, text})
    }

    addWelcomeMessagesInDialog(messages) {
        messages.forEach((message) => this.addMessage('comp', message))
    }

    addLeadMessage() {
        this.addMessage('system', '<div data-formid="form_zsjlpxeLIZf6klEyM6u4uNE-x5GI-Yxm"></div>')
        window.QFormOrganizer._rebuildForms()
    }
}