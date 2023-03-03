import Dom from "./utils/dom.js";
import StatusBar from "./chatStatusBar.js";
import ChatInput from "./chatInput.js";
import ChatMessages from "./chatMessages.js";

export default class ChatWindow extends Dom {
    constructor(options) {
        super();

        this.Emitter = options?.emitter;
    }

    init() {
        this.$root = null;
        this.$header = null;
        this.$body = null;
        this.$footer = null;
        this.isWindowShown = false;

        this.statusBar = null;
        this.chatInput = null;
        this.chatMessagesSection = null;

        this.Emitter.subscribe('scrollToBottom', this.scrollToBottom.bind(this))
    }

    createChatWindow() {
        this.$root = this.createElement('div', ['qfchat-chat-window', 'qfchat__transparent']);
        this.$header = this.createElement('div', 'qfchat-chat-window__header');
        this.$body = this.createElement('div', 'qfchat-chat-window__body');
        this.$footer = this.createElement('div', 'qfchat-chat-window__footer');
    
        this.statusBar = new StatusBar();
        this.statusBar.init();
        this.$header.append(this.statusBar.createStatusBar())

        this.chatMessagesSection = new ChatMessages({emitter: this.Emitter});
        this.chatMessagesSection.init();
        this.$body.append(this.chatMessagesSection.createChatMessagesSection())

        this.chatInput = new ChatInput({emitter: this.Emitter});
        this.chatInput.init();
        this.$footer.append(this.chatInput.createChatInput())

        this.$root.append(this.$header)
        this.$root.append(this.$body)
        this.$root.append(this.$footer)

        return this.$root;
    }

    toggleWindowVisibility(show) {
        this.$root.classList[show ? 'remove' : 'add']('qfchat__transparent')
        this.isWindowShown = !this.isWindowShown;
    }

    scrollToBottom() {
        this.$body.scrollTo({
            top: this.$body.scrollHeight
        })
    }
}