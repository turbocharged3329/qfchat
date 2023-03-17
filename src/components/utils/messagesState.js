export default class MessagesState {
    constructor() {
        this.messages = [];    
    }

    init() {
        
    }

    addMessage(message) {
        this.messages.push(message);
    }
}