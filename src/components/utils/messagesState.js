export default class MessagesState {
    constructor(options) {
        this.Emitter = options.emitter;
        this.welcomeMessagesCount = options.welcomeMessagesCount;
        this.messages = [];
    }

    init() {
        // window.onunload = () => this.saveMessagesToLocalStorage();
        this.Emitter.subscribe('resetChat', this.clearMessages.bind(this));
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
            if (compMessagesCount === this.welcomeMessagesCount) {
                // this.Emitter.emit('answer');
                return 
            } else if (compMessagesCount === 3) {
                this.Emitter.emit('answer2');
            }
        }
    }

    clearMessages() {
        this.messages = [];
    }
}