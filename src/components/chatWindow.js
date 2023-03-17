import Dom from "./utils/dom.js";
import StatusBar from "./chatStatusBar.js";
import ChatInput from "./chatInput.js";
import ChatMessages from "./chatMessages.js";

export default class ChatWindow extends Dom {
    constructor(options) {
        super();

        this.Emitter = options?.emitter;
        this.messagesState = options?.messagesState;
    }

    init() {
        this.addQformScript()
        
        this.$root = null;
        this.$header = null;
        this.$body = null;
        this.$footer = null;
        this.isWindowShown = false;

        this.statusBar = null;
        this.chatInput = null;
        this.chatMessagesSection = null;
        this.$bodyPlaceholder = null;

        this.isOpenedOnce = false;

        this.Emitter.subscribe('scrollToBottom', this.scrollToBottom.bind(this))
        this.Emitter.subscribe('hidePlaceholder', this.hidePlaceholder.bind(this))
    }

    createChatWindow() {
        this.$root = this.createElement('div', ['qfchat-chat-window', 'qfchat-chat-window__hidden']);
        this.$header = this.createElement('div', 'qfchat-chat-window__header');
        this.$body = this.createElement('div', ['qfchat-chat-window__body', 'qfchat-body-empty']);
        this.$footer = this.createElement('div', 'qfchat-chat-window__footer');
        //добавляем статусбар
        this.statusBar = new StatusBar();
        this.statusBar.init();
        this.$header.append(this.statusBar.createStatusBar())
        //добавляем секцию с сообщениями
        this.chatMessagesSection = new ChatMessages({emitter: this.Emitter, messagesState: this.messagesState});
        this.chatMessagesSection.init();
        this.$body.append(this.chatMessagesSection.createChatMessagesSection())
        //добавляем надпись к чату без сообщений 
        this.$bodyPlaceholder = this.createElement('span', 'qfchat-chat-window__body-placeholder');
        this.$bodyPlaceholder.innerHTML = 'Пока нет сообщений'
        this.$body.append(this.$bodyPlaceholder)
        //добавляем секцию с полем ввода
        this.chatInput = new ChatInput({emitter: this.Emitter});
        this.chatInput.init();
        this.$footer.append(this.chatInput.createChatInput())
        //добавляем составные части к окну чата
        this.$root.append(this.$header)
        this.$root.append(this.$body)
        this.$root.append(this.$footer)

        return this.$root;
    }

    toggleWindowVisibility(show) {
        this.$root.classList[show ? 'remove' : 'add']('qfchat-chat-window__hidden')
        this.isWindowShown = !this.isWindowShown;
    }

    scrollToBottom() {
        this.$body.scrollTo({
            top: this.$body.scrollHeight
        })
    }

    hidePlaceholder() {
        this.$body.classList.remove('qfchat-body-empty');
        this.$bodyPlaceholder.classList.add('qfchat__hidden');
    }

    addQformScript() {
        const script = this.createElement('script');
        script.type = 'text/javascript'
        script.defer = 'defer';
        script.src = '//dev-cdn.qform.io/forms.js?v='; 

        document.head.append(script);
    }
}