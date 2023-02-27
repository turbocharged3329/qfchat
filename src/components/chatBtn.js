import Dom from "./utils/dom.js";
import ChatWelcomeMsg from "./chatWelcomeMsg";
import ChatWindow from "./chatWindow.js";

export default class ChatBtn extends Dom {
    constructor() {
        super()
    }

    init() {
        this.$wrapper = null;
        this.$chatBtnWrapper = null;
        this.$chatBtn = null;

        this.chatWindow = null;
        this.welcomeMessage = null;

        this.addChatBtn();
        this.showWelcomeMessage();
        this.addChatWindow();

        this.$chatBtn.addEventListener('click', this.openChatWindow.bind(this))
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

    async showWelcomeMessage() {        
        this.welcomeMessage = new ChatWelcomeMsg();
        this.welcomeMessage.init()
        this.$chatBtnWrapper.append(this.welcomeMessage.createMessage())

        const timeout = setTimeout(() => {
            this.welcomeMessage.toggleMessageVisibility(true)
            clearTimeout(timeout);
        }, 1500)
    }

    openChatWindow() {
        this.welcomeMessage.toggleMessageVisibility()
        this.chatWindow?.toggleWindowVisibility(!this.chatWindow?.isWindowShown)
    }

    addChatWindow() {
        this.chatWindow = new ChatWindow();

        this.chatWindow.init();
        this.$wrapper.append(this.chatWindow.createChatWindow());
    }
}