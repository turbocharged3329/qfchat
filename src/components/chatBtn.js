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
        await this.setChatOptions();
        this.setCustomColor('#1CA9DF');
        this.initMessagesState();
        this.addChatBtn();
        this.addChatWindow();
        this.addOutMessages();
        
        let storedMessages = JSON.parse(localStorage.getItem('qfchatmessages'));

        if (!storedMessages) {
            localStorage.setItem('qfchatmessages', JSON.stringify([]))
            storedMessages = JSON.parse(localStorage.getItem('qfchatmessages'));
        }
        
        if (!storedMessages.length) {
            this.chatOptions.greeting.forEach((msg, i) => {
                setTimeout(() => {
                let message = {id: Math.random().toString(16).slice(2), role: 'comp', text: msg.text};
    
                this.Emitter.emit('hasWelcomeMessages', message, !this.chatWindow.isWindowShown)
                this.messagesState.addMessage(message);
    
                if (!this.chatWindow.isWindowShown) {
                    this.chatOutMessages.addOutMessage(message);
                }
            }, (this.chatOptions.delay_greeting * 1000) + (2000 * i))
            })
        } else {
            storedMessages.forEach(msg => {
                if (msg.isFormMessage) {
                    this.Emitter.emit('addStoredFormMessage', msg);
                } else {
                    this.Emitter.emit('addStoredMessage', msg)
                }

                this.messagesState.addMessage(msg);
            });

            if (window.QFormOrganizer) {
                window.QFormOrganizer._rebuildForms();
            }
        }
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
            body: JSON.stringify({
                chat_id: 2,
                url: document.URL
            })
            
        })
    }

    async setChatOptions() {
        let storedOptions = JSON.parse(localStorage.getItem('qfchatsettings'));
        let sessionStatus = JSON.parse(localStorage.getItem('qfchatsessionstatus'));

        if (!storedOptions || (storedOptions && sessionStatus === '-1')) {
            this.chatOptions = await this.getOptionsFromAPI();

            if (this.chatOptions) {
                this.chatOptions = await this.chatOptions.json();
                localStorage.setItem('qfchatsettings', JSON.stringify(this.chatOptions));
                localStorage.setItem('qfchatsessionstatus', JSON.stringify("1"));
            }
        } else {
            this.chatOptions = JSON.parse(localStorage.getItem('qfchatsettings'));
        }
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

    setCustomColor(color) {
        const $style = document.createElement('style');

        $style.innerHTML = `
            .qfchat-chat-window__header, .qfchat-btn, .qfchat-chat-messages__message-user {
                background-color: ${color}; 
            }
            .qfchat-chat-input__send-btn {
                background-image: url("data:image/svg+xml,%3Csvg width='27' height='27' viewBox='0 0 27 27' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.1634 10.5412C1.58965 10.3106 1.5964 9.96748 2.20165 9.76611L23.6734 2.60886C24.2685 2.41086 24.6094 2.74386 24.4429 3.32661L18.3071 24.7984C18.1384 25.3935 17.7728 25.4205 17.5005 24.8771L12.375 14.625L2.1634 10.5412ZM7.66465 10.3162L14.0051 12.8531L17.4251 19.6954L21.4144 5.73411L7.66352 10.3162H7.66465Z' fill='${color}'/%3E%3C/svg%3E%0A");
            }
        `
        document.head.append($style) 
    }

    async resetChat() {
        // this.chatWindow?.toggleWindowVisibility(!this.chatWindow?.isWindowShown)

        this.chatOptions = await this.getOptionsFromAPI();
        this.chatOptions = await this.chatOptions.json();
        localStorage.setItem('qfchatsettings', JSON.stringify(this.chatOptions));
        localStorage.setItem('qfchatsessionstatus', JSON.stringify("1"));
        this.Emitter.emit('updateSettings', this.chatOptions)
    }
}