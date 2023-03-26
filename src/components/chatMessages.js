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
        this.Emitter.subscribe('hasWelcomeMessages', this.addMessage.bind(this))
        this.Emitter.subscribe('answer', this.addMessage.bind(this, 'comp', 'Отлично, мы занимаемся разработкой сайтов. Какой Вас интересует?'))
        this.Emitter.subscribe('answer2', this.addMessage.bind(this, 'comp', 'Отлично мы делаем сайты доставки. Я передам ваше сообщение старжему менеджеру, оставте пожалуйста свои контакты'))
        this.Emitter.subscribe('form', this.addLeadMessage.bind(this))

    }

    createChatMessagesSection() {
        this.$root = this.createElement('div', 'qfchat-chat-messages');

        return this.$root;
    }

    createMessage(messageData) {
        const message = this.createElement('div',[
            'qfchat-chat-messages__message',
            `qfchat-chat-messages__message-${messageData.role}`,
            'qfchat-chat-messages__message-writing'
        ]);
        
        if (messageData.role !== 'user') {
            const loaderIcon = this.createElement('i', 'qfchat-chat-messages__message-writing-icon');
            message.append(loaderIcon)
            
            setTimeout(() => {
                message.innerHTML = messageData.text.replace(/\n/g, '<br>').trim();
                this.Emitter.emit('playMessageSound');

                if (messageData.role === 'system') {
                    window.QFormOrganizer._rebuildForms()
                }
            }, 1500)
        } else {
            message.innerHTML = text.replace(/\n/g, '<br>').trim();
        } 

        return message;
    }

    addMessage(message) {
        this.messagesState.addMessage({role: message.role, text: message.text, alerted: false})
        this.$root.append(this.createMessage(message));

        if (!this.messagesState.messages.length) {
            this.Emitter.emit('hidePlaceholder');
        }
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