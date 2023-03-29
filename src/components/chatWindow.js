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
        this.$audioPlayer = null;
        this.isWindowShown = false;

        this.statusBar = null;
        this.chatInput = null;
        this.chatMessagesSection = null;
        this.$bodyPlaceholder = null;

        this.isOpenedOnce = false;

        this.Emitter.subscribe('scrollToBottom', this.scrollToBottom.bind(this))
        this.Emitter.subscribe('hidePlaceholder', this.hidePlaceholder.bind(this))
        this.Emitter.subscribe('closeChat', this.toggleWindowVisibility.bind(this, false))

        document.documentElement.addEventListener('click', this.onChatMissclick.bind(this))
    }

    createChatWindow() {
        this.$root = this.createElement('div', ['qfchat-chat-window', 'qfchat-chat-window__hidden']);
        this.$header = this.createElement('div', 'qfchat-chat-window__header');
        this.$body = this.createElement('div', ['qfchat-chat-window__body', 'qfchat-body-empty']);
        this.$footer = this.createElement('div', 'qfchat-chat-window__footer');
        //добавляем статусбар
        this.statusBar = new StatusBar({emitter: this.Emitter});
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

        this.$root.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'width' && (event.target.clientWidth === +window.visualViewport.width.toFixed(0))) {
                document.documentElement.addEventListener('touchmove', this.preventTouchmove.bind(this), { passive: false })
            }

            if (!this.isWindowShown) {       
                document.documentElement.removeEventListener('touchmove', this.preventTouchmove.bind(this))
            }
        })

        window.visualViewport.addEventListener('resize', event => {
            this.$root.style.height = event.target.height + 'px'
            document.body.style.height = event.target.height + 'px'
        });

        return this.$root;
    }

    preventTouchmove(event) {
        if (
            !event.target.closest('.qfchat-chat-window__body')
        ) {
            event.preventDefault()
            event.stopPropagation()
        }
    }

    toggleWindowVisibility(show) {
        this.$root.classList[show ? 'remove' : 'add']('qfchat-chat-window__hidden')
        this.isWindowShown = show;
        
        if (!show) {
            this.Emitter.emit('hideChat');
        }
    }

    scrollToBottom() {
        window.b = this.$body;
        this.$body.scrollTo({
            top: this.$body.scrollHeight
        })
    }

    hidePlaceholder() {
        this.$body.classList.remove('qfchat-body-empty');
        this.$bodyPlaceholder.classList.add('qfchat__hidden');
    }

    onChatMissclick(event) {
        if (
            !event.target.className.includes('qfchat') 
            && !event.target.className.includes('qfchat-btn')
            && !event.target.closest('.qfchat-chat-messages__message-system')
        ) {
            this.Emitter.emit('hideChat');
            this.toggleWindowVisibility(false);
        }
    }

    addQformScript() {
        const script = this.createElement('script');
        script.type = 'text/javascript'
        script.defer = 'defer';
        script.src = '//dev-cdn.qform.io/forms.js?v='; 

        document.head.append(script);
    }
}