import Dom from "./utils/dom.js";
import MessagesState from "./utils/messagesState.js";
import ChatOutMessages from "./chatOutMessages.js";
import ChatWindow from "./chatWindow.js";

export default class ChatBtn extends Dom {
    constructor(options) {
        super()
        this.$wrapper = null;
        this.$chatBtnWrapper = null;
        this.$chatBtn = null;

        this.chatWindow = null;
        this.chatOutMessages = null;
        this.welcomeMessage = null;

        this.Emitter = options?.emitter;
        this.messagesState = null;

        this.chatOptions = null;
    }

    async init() {
        this.chatOptions = await this.getOptionsFromAPI();

        if (this.chatOptions) {
            this.chatOptions = await this.chatOptions.json();
        }

        this.initMessagesState();
        this.addChatBtn();
        this.addChatWindow();
        this.addOutMessages();
        const storedMessages = JSON.parse(localStorage.getItem('qfchatmessages'))

        if (this.chatOptions) {
            setTimeout(() => {
                    let message = {id: Math.random().toString(16).slice(2), role: 'comp', text: this.chatOptions.greeting};
        
                    this.Emitter.emit('hasWelcomeMessages', message, !this.chatWindow.isWindowShown)
                    this.messagesState.addMessage(message);
        
                    if (!this.chatWindow.isWindowShown) {
                        this.chatOutMessages.addOutMessage(message);
                    }
                }, 3000)
            }
        // if (!storedMessages?.length) {
        //     setTimeout(() => {
        //         let message = {id: Math.random().toString(16).slice(2), role: 'comp', text: 'Привет, меня зовут Евгений'};
    
        //         this.Emitter.emit('hasWelcomeMessages', message, !this.chatWindow.isWindowShown)
        //         this.messagesState.addMessage(message);
    
        //         if (!this.chatWindow.isWindowShown) {
        //             this.chatOutMessages.addOutMessage(message);
        //         }
        //     }, 3000)
            
        //     setTimeout(() => {
        //         let message = {id: Math.random().toString(16).slice(2), role: 'comp', text: 'Чем могу помочь ?', alerted: false}
    
        //         this.Emitter.emit('hasWelcomeMessages', message, !this.chatWindow.isWindowShown)
        //         this.messagesState.addMessage(message);
    
        //         if (!this.chatWindow.isWindowShown) {
        //             this.chatOutMessages.addOutMessage(message)
        //         }
        //     }, 5000)
        // } else {
        //     storedMessages.forEach(msg => {
        //         this.Emitter.emit('addStoredMessage', msg)
        //         this.messagesState.addMessage(msg);
        //     });
        // }

        this.$chatBtn.addEventListener('click', this.openChatWindow.bind(this))

        this.Emitter.subscribe('showChat', this.openChatWindow.bind(this))
        this.Emitter.subscribe('hideChat', this.toggleOpenedBtnState.bind(this, false))
        this.Emitter.subscribe('playMessageSound', this.playMessageSound.bind(this))
        this.Emitter.subscribe('resetChat', this.resetChat.bind(this))
    }

    async getOptionsFromAPI() {
        return fetch('http://localhost:9999/chat-gpt-api/init', {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({"chat_id": 2})
            
        })
    }

    initMessagesState() {
        this.messagesState = new MessagesState({
            emitter: this.Emitter, 
            welcomeMessagesCount: 1 //this.chatOptions.greeting.length
        });
        this.messagesState.init()
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
        this.chatOutMessages = new ChatOutMessages({emitter: this.Emitter, messagesState: this.messagesState});
        this.chatOutMessages.init();

        this.$wrapper.append(this.chatOutMessages.createOutMessagesWrapper())
    }

    openChatWindow() {
        if (!this.chatWindow.isOpenedOnce) {
            this.chatWindow.isOpenedOnce = true;
            this.$chatBtn.classList.add('qfchat-btn-opened-once');
        }

        this.toggleOpenedBtnState(true);
        this.chatWindow?.toggleWindowVisibility(!this.chatWindow?.isWindowShown)
        this.Emitter.emit('hideOutMessages');
    }

    addChatWindow() {
        this.chatWindow = new ChatWindow({
            emitter: this.Emitter, 
            messagesState: this.messagesState, 
            avatarSettings: {avatar_img: this.chatOptions.avatar_img, manager: this.chatOptions.manager},
            sessionUuid: this.chatOptions.session_uuid
        });

        this.chatWindow.init();
        this.$wrapper.append(this.chatWindow.createChatWindow());
    }

    toggleOpenedBtnState(show = true) {
        this.$chatBtn.classList[show ? 'add' : 'remove']('qfchat-btn-opened');
    }

    playMessageSound(messageId) {
        this.messagesState.messages.find(msg => msg.id === messageId).alerted = true;
        this.addMessageSoundTag();
        
        this.$audioPlayer.innerHTML = '';
        this.$audioPlayer.innerHTML = '<source src="/src/assets/message.mp3" type="audio/mpeg">';
    }

    addMessageSoundTag() {
        this.$audioPlayer = this.createElement('audio');
        this.$audioPlayer.setAttribute('autoplay', true);
        this.$audioPlayer.addEventListener('ended', (event) => event.target.remove()) 
        document.body.append(this.$audioPlayer);
    }

    resetChat() {
        this.chatWindow?.toggleWindowVisibility(!this.chatWindow?.isWindowShown)
    }
}