import Dom from "./utils/dom.js";

export default class ChatMessages extends Dom {
    constructor(options) {
        super()

        this.Emitter = options?.emitter;
        this.messagesState = options.messagesState;
    }

    init() {
        this.$root = null;

        this.Emitter.subscribe('addMessage', (role, text) => {
            let message = {id: Math.random().toString(16).slice(2), role, text, alerted: true};

            this.addMessage(message);
            this.messagesState.addMessage(message);
        })
        this.Emitter.subscribe('hasWelcomeMessages', (messageData, isChatWindowShown) => this.addMessage(messageData, isChatWindowShown))
        this.Emitter.subscribe('answer', () => {
            let message = {id: Math.random().toString(16).slice(2), role: 'comp', text: 'Отлично, мы занимаемся разработкой сайтов. Какой Вас интересует?', alerted: false};

            this.addMessage(message);
            this.messagesState.addMessage(message);
        })
        this.Emitter.subscribe('answer2', () => {
            let message = {id: Math.random().toString(16).slice(2), role: 'comp', text: 'Отлично мы делаем сайты доставки. Я передам ваше сообщение старжему менеджеру, оставте пожалуйста свои контакты', alerted: false};

            this.addMessage(message);
            this.messagesState.addMessage(message);
            setTimeout(() => this.addLeadMessage(), 3000)
        })
        this.Emitter.subscribe('form', this.addLeadMessage.bind(this))
    }

    createChatMessagesSection() {
        this.$root = this.createElement('div', 'qfchat-chat-messages');

        return this.$root;
    }

    createMessage(messageData, silent = false) {
        const message = this.createElement('div',[
            'qfchat-chat-messages__message',
            `qfchat-chat-messages__message-${messageData.role}`,
            'qfchat-chat-messages__message-writing'
        ]);
        
        if (messageData.role !== 'user') {
            const loaderIcon = this.createElement('i', 'qfchat-chat-messages__message-writing-icon');
            message.append(loaderIcon)

            if (!silent) {
                setTimeout(() => {
                    message.innerHTML = messageData.text.replace(/\n/g, '<br>').trim();
                    this.Emitter.emit('scrollToBottom');
                    if (!messageData.alerted) {
                        this.Emitter.emit('playMessageSound', messageData.id);
                    }
    
                }, 1500)
            } else {
                message.innerHTML = messageData.text.replace(/\n/g, '<br>').trim();
            }
        } else {
            message.innerHTML = messageData.text.replace(/\n/g, '<br>').trim();
        }

        return message;
    }

    addMessage(message, silent = false) {
        this.$root.append(this.createMessage(message, silent));
        this.Emitter.emit('scrollToBottom');
    }

    addLeadMessage() {
        this.addMessage(
            {
                id:Math.random().toString(16).slice(2),
                role: 'system',
                text: document.location.host === 'chat.web-str3.ru' 
                ? '<div data-formid="form_FiSLhstcMeH-93CsZGIdmPCTEGySibKl"></div>' 
                : '<div data-formid="form_zsjlpxeLIZf6klEyM6u4uNE-x5GI-Yxm"></div>',
                alerted: true,  
            }, 
            true
        )
        window.QFormOrganizer._rebuildForms()
        this.Emitter.emit('disableInput');
    }
}