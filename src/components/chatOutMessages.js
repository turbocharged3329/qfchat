import Dom from "./utils/dom.js";

export default  class OutMessages extends Dom {
    constructor(options) {
        super()

        this.Emitter = options.emitter;
        this.messagesState = options.messagesState;
    }

    init() {
        this.$root = null;
        this.isOpen = false;

        this.Emitter.subscribe('hideOutMessages', this.toggleOutMessagesVisibility.bind(this, false))
    }

    createOutMessagesWrapper() {
        this.$root = this.createElement('div', ['qfchat-out-messages__wrapper', 'qfchat__hidden']);

        return this.$root;
    }

    createOutMessage(text) {
        const $message = this.createElement('div', 'qfchat-out-messages__message');
        $message.innerHTML = text;
        $message.addEventListener('mouseenter', this.openChatWindow.bind(this))
        $message.addEventListener('touchstart', this.openChatWindow.bind(this))

        return $message;
    }

    addOutMessage(message) {
        this.toggleOutMessagesVisibility(true);
        this.$root.append(this.createOutMessage(message.text));
        this.Emitter.emit('playMessageSound', message.id);
    }

    toggleOutMessagesVisibility(isVisible) {
        this.isOpen = isVisible;
        this.$root.classList[isVisible ? 'remove' : 'add']('qfchat__hidden')

        if (!isVisible) {
            this.$root.innerHTML = ''
        }
    }

    openChatWindow() {
        this.toggleOutMessagesVisibility(false);
        this.Emitter.emit('showChat');
    }
}