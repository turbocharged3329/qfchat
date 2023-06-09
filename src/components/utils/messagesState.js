export default class MessagesState {
    constructor(options) {
        this.Emitter = options.emitter;
        this.welcomeMessagesCount = options.welcomeMessagesCount;
        this.messages = [];
    }

    init() {
        this.Emitter.subscribe('resetChat', this.clearMessages.bind(this));
    }

    addMessage(message) {
        if (!this.messages.length) {
            this.Emitter.emit('hidePlaceholder');
        }
        
        this.messages.push(message);
    }

    clearMessages() {
        this.messages = [];
    }
}