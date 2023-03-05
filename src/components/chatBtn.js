import Dom from "./utils/dom.js";
import ChatOutMessages from "./chatOutMessages.js";
import ChatWindow from "./chatWindow.js";

export default class ChatBtn extends Dom {
    constructor(options) {
        super()
        
        this.Emitter = options?.emitter;
    }

    init() {
        this.$wrapper = null;
        this.$chatBtnWrapper = null;
        this.$chatBtn = null;

        this.chatWindow = null;
        this.chatOutMessages = null;
        this.welcomeMessage = null;

        this.addChatBtn();
        this.addChatWindow();
        this.addOutMessages();

        setTimeout(() => {
            if (!this.chatWindow.isWindowShown) {
                this.chatOutMessages.addOutMessage('Привет, меня зовут Евгений');
            }
            this.Emitter.emit('hasWelcomeMessages', ['Привет, меня зовут Евгений'])
        }, 1000)
        setTimeout(() => {
            if (!this.chatWindow.isWindowShown) {
                this.chatOutMessages.addOutMessage('Чем могу помочь ?')
            }
            this.Emitter.emit('hasWelcomeMessages', ['Чем могу помочь ?'])
        }, 2000)

        this.$chatBtn.addEventListener('click', this.openChatWindow.bind(this))

        this.Emitter.subscribe('showChat', this.openChatWindow.bind(this))
    }

    createChatBtn() {
        //создаем основнуб обертку 
        this.$wrapper = this.createElement('DIV', 'qfchat__main-wrapper')
        //создаем обертку для кнопки чата
        this.$chatBtnWrapper = this.createElement('DIV', 'qfchat-btn__wrapper')
        //создаем кнопку чата
        this.$chatBtn = this.createElement('BUTTON', 'qfchat-btn')

        this.$chatBtnWrapper.append(this.$chatBtn);
        this.$wrapper.append(this.$chatBtnWrapper)

        return this.$wrapper;
    }

    addChatBtn() {
        document.body.append(this.createChatBtn());
    }

    addOutMessages() {
        this.chatOutMessages = new ChatOutMessages({emitter: this.Emitter});
        this.chatOutMessages.init();

        this.$wrapper.append(this.chatOutMessages.createOutMessagesWrapper())
    }

    openChatWindow() {
        if (!this.chatWindow.isOpenedOnce) {
            this.chatWindow.isOpenedOnce = true;
        }
        
        this.chatWindow?.toggleWindowVisibility(!this.chatWindow?.isWindowShown)
    }

    addChatWindow() {
        this.chatWindow = new ChatWindow({emitter: this.Emitter});

        this.chatWindow.init();
        this.$wrapper.append(this.chatWindow.createChatWindow());
    }
}