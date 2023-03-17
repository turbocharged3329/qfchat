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
        this.$root.addEventListener('mouseenter', this.openChatWindow.bind(this))

        return this.$root;
    }

    createOutMessage(text) {
        const $message = this.createElement('div', 'qfchat-out-messages__message');
        $message.innerHTML = text;

        return $message;
    }

    addOutMessage(text) {
        this.toggleOutMessagesVisibility(true);
        this.$root.append(this.createOutMessage(text));
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