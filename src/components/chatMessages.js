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
            this.saveMessageToLocalStorage(message);
            this.messagesState.addMessage(message);
        })
        this.Emitter.subscribe('addStoredMessage', (messageData) => this.addMessage(messageData, true))
        this.Emitter.subscribe('addStoredFormMessage', (formMessageData) => {
            this.addMessage(formMessageData, true);
            this.Emitter.emit('disableInput');

            const forms = this.$root.querySelectorAll(`div[data-formid=${formMessageData.formId}]`);
            const form = forms[forms.length - 1];
            
            this.addFormActionsListeners(form, formMessageData.formId);
        })
        this.Emitter.subscribe('hasWelcomeMessages', (messageData, isChatWindowShown) => {
            this.addMessage(messageData, isChatWindowShown)
            this.saveMessageToLocalStorage(messageData);
        })
        
        this.Emitter.subscribe('answer', this.addAnswerMessage.bind(this))
        this.Emitter.subscribe('lead_message', (settings) => {
            this.addAnswerMessage(settings.lead_message);
            setTimeout(() => this.addForm(settings.form_id), 3000)
        })
        // this.Emitter.subscribe('resetChat', this.clearMessagesList.bind(this))
    }

    addAnswerMessage(text) {
        let message = {id: Math.random().toString(16).slice(2), role: 'comp', text, alerted: false};

        this.addMessage(message);
        this.saveMessageToLocalStorage(message);
        this.messagesState.addMessage(message);
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

    saveMessageToLocalStorage(messageData) {
        const storedMessages = JSON.parse(localStorage.getItem('qfchatmessages'));
        storedMessages.push(messageData);
        localStorage.setItem('qfchatmessages', JSON.stringify(storedMessages));
    }

    addForm(formId) {
        console.log('here');

        const formMessageData = {
            id:Math.random().toString(16).slice(2),
            role: 'comp',
            text: document.location.host === 'chat.web-str3.ru' 
            ? '<div data-formid="form_FiSLhstcMeH-93CsZGIdmPCTEGySibKl"></div>' 
            : `<div data-formid="${formId}"></div>`,
            alerted: true,  
            formId,
            isFormMessage: true
        }

        this.addMessage(formMessageData, true)
        this.saveMessageToLocalStorage(formMessageData);
        this.messagesState.addMessage(formMessageData);
        window.QFormOrganizer._rebuildForms();
        
        this.Emitter.emit('disableInput');

        const forms = this.$root.querySelectorAll(`div[data-formid=${formId}]`);
        const form = forms[forms.length - 1];

        this.addFormActionsListeners(form, formId);
    }

    addFormActionsListeners($formEl, formId) {
        $formEl.addEventListener(`qform_${formId}_init`, () => this.Emitter.emit('scrollToBottom'))
        $formEl.addEventListener(`qform_${formId}_send`, (event) => {
            console.log($formEl, event);
            const storedMessages = JSON.parse(localStorage.getItem('qfchatmessages'));
            let storedFormMessage = storedMessages.find(msg => msg.isFormMessage);
            //при отправке формы заменяем разметку (div с data-formid в тексте сообщения) на сообщение об отправке, установленное в форме
            storedFormMessage.text = event.target.innerText; 
            storedFormMessage.isFormMessage = false; 
            storedMessages.splice(storedMessages.findIndex(elem => elem.isFormMessage), 1, storedFormMessage);
            localStorage.setItem('qfchatmessages', JSON.stringify(storedMessages));
            localStorage.setItem('qfchatsessionstatus', JSON.stringify('-1'))
            this.Emitter.emit('countdownToReset');
        })
    }

    clearMessagesList() {
        this.$root.innerHTML = ""
    }
}