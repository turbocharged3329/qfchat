export default class MessagesState {
    constructor(options) {
        this.Emitter = options.emitter;
        this.messages = [];
    }

    init() {
        // window.onunload = () => this.saveMessagesToLocalStorage();
    }

    saveMessagesToLocalStorage() {
        localStorage.setItem('qfchatmessages', JSON.stringify(this.messages))
    }

    addMessage(message) {
        if (!this.messages.length) {
            this.Emitter.emit('hidePlaceholder');
        }
        
        this.messages.push(message);

        const compMessagesCount = this.messages.filter(msg => msg.role === 'comp').length;

        if (message.role === 'user') {
            if (compMessagesCount === 2) {
                this.Emitter.emit('answer');
            } else if (compMessagesCount === 3) {
                this.Emitter.emit('answer2');
            }
        }
    }
}