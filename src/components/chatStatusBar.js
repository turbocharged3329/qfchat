import Dom from "./utils/dom.js";

export default class StatusBar extends Dom {
    constructor(options) {
        super();

        this.Emitter = options?.emitter;
    }

    init() {
        this.$root = null;
        this.$avatarWrapper = null;
        this.$statusInfoWrapper = null;
        this.$mobileCloseBtn = null;
    }

    createStatusBar(avatarSettings) {
        this.$root = this.createElement('div', 'qfchat-status-bar');

        this.$root.append(this.createAvatar(avatarSettings.avatar_img));
        this.$root.append(this.createStatusInfo(avatarSettings.manager));
        this.$root.append(this.createMobileCloseBtn());

        return this.$root;
    }

    createAvatar(avatarSrc) {
        this.$avatarWrapper = this.createElement('div', 'qfchat-status-bar__avatar-wrapper');
        const $avatarImage = this.createElement('img', ['qfchat-status-bar__avatar-img', 'qfchat-status-bar__avatar-img-online']);
        const $avatarStatus = this.createElement('i', ['qfchat-status-bar__avatar-status', 'qfchat-status-bar__avatar-status-online']);

        // $avatarImage.src = '/src/assets/evgeniy.png';
        $avatarImage.src = avatarSrc;

        this.$avatarWrapper.append($avatarImage);
        this.$avatarWrapper.append($avatarStatus);

        return this.$avatarWrapper;
    }

    createStatusInfo(managerName) {
        this.$statusInfoWrapper = this.createElement('div', 'qfchat-status-bar__status-info-wrapper')

        const name = this.createElement('span', 'qfchat-status-bar__status-info-name')
        const status = this.createElement('span', 'qfchat-status-bar__status-info-status')

        name.innerHTML = managerName;
        status.innerHTML = 'Онлайн';

        this.$statusInfoWrapper.append(name)
        this.$statusInfoWrapper.append(status)

        return this.$statusInfoWrapper;
    }

    createMobileCloseBtn() {
        this.$mobileCloseBtn = this.createElement('button', 'qfchat-status-bar__close-btn')
        this.$mobileCloseBtn.setAttribute('type', 'button');
        this.$mobileCloseBtn.addEventListener('click', this.emitClose.bind(this))

        return this.$mobileCloseBtn;
    }

    emitClose() {
        this.Emitter.emit('closeChat');
    }
}