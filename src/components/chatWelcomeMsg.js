import Dom from "./utils/dom.js";

export default class ChatWelcomeMsg extends Dom {
    constructor() {
        super();
    }

    init() {
        this.$message = null;
        this.$messageWrapper = null;
    }

    createMessage() {
        this.$messageWrapper = this.createElement('DIV', ['qfchat-welcome-msg__wrapper', 'qfchat__transparent'])
        this.$message = this.createElement('DIV', 'qfchat-welcome-msg');

        const messageText = this.createElement('P', 'qfchat-welcome-msg__text');
        messageText.innerHTML = 'Здравствуйте! Чем могу помочь?'

        this.$message.append(messageText)
        this.$messageWrapper.append(this.$message);

        return this.$messageWrapper;
    }

    toggleMessageVisibility(show) {
        this.$messageWrapper.classList[show ? 'remove' : 'add']('qfchat__transparent')
    }
} 