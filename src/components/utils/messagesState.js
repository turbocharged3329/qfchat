export default class MessagesState {
    constructor(options) {
        this.Emitter = options.emitter;
        this.messages = [];
    }

    init() {

    }

    addMessage(message) {
        this.messages.push(message);

        const userMessagesCount = this.messages.filter(msg => msg.role === 'comp').length;

        if (message.role === 'user') {
            if (userMessagesCount === 2) {
                this.Emitter.emit('answer');
            } else if (userMessagesCount === 3) {
                this.Emitter.emit('form');
            }
        }
    }
}