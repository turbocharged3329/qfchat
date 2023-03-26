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
        this.Emitter.subscribe('answer', this.addMessage.bind(this, 'comp', 'Отлично, мы занимаемся разработкой сайтов. Какой Вас интересует?'))
        this.Emitter.subscribe('answer2', this.addMessage.bind(this, 'comp', 'Отлично мы делаем сайты доставки. Я передам ваше сообщение старжему менеджеру, оставте пожалуйста свои контакты'))
        this.Emitter.subscribe('form', this.addLeadMessage.bind(this))

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
        
        if (role !== 'user') {
            const loaderIcon = this.createElement('i', 'qfchat-chat-messages__message-writing-icon');
            message.append(loaderIcon)
            
            setTimeout(() => {
                message.innerHTML = text.replace(/\n/g, '<br>').trim();
                this.Emitter.emit('playMessageSound');

                if (role === 'system') {
                    window.QFormOrganizer._rebuildForms()
                }
            }, 1500)
        } else {
            message.innerHTML = text.replace(/\n/g, '<br>').trim();
        } 

        return message;
    }

    addMessage(role, text) {
        this.messagesState.addMessage({role, text, alerted: false})
        this.$root.append(this.createMessage(role, text));

        if (!this.messagesState.messages.length) {
            this.Emitter.emit('hidePlaceholder');
        }
    }

    addWelcomeMessagesInDialog(messages) {
        messages.forEach((message) => this.addMessage('comp', message, 0))
    }

    addLeadMessage() {
        this.addMessage(
            'system',
             document.location.host === 'chat.web-str3.ru' 
             ? '<div data-formid="form_FiSLhstcMeH-93CsZGIdmPCTEGySibKl"></div>' 
             : '<div data-formid="form_zsjlpxeLIZf6klEyM6u4uNE-x5GI-Yxm"></div>'
        )
    }
}