import Dom from "./utils/dom.js";

export default class StatusBar extends Dom {
    constructor() {
        super()
    }

    init() {
        this.$root = null;
        this.$avatarWrapper = null;
        this.$statusInfoWrapper = null;
    }

    createStatusBar() {
        this.$root = this.createElement('div', 'qfchat-status-bar');

        this.$root.append(this.createAvatar());
        this.$root.append(this.createStatusInfo());

        return this.$root;
    }

    createAvatar() {
        this.$avatarWrapper = this.createElement('div', 'qfchat-status-bar__avatar-wrapper');
        const $avatarImage = this.createElement('img', ['qfchat-status-bar__avatar-img', 'qfchat-status-bar__avatar-img-online']);
        const $avatarStatus = this.createElement('i', ['qfchat-status-bar__avatar-status', 'qfchat-status-bar__avatar-status-online']);

        // $avatarImage.src = '/src/assets/evgeniy.png';
        $avatarImage.src = 'https://i.ibb.co/fX36b1W/evgeniy.png';

        this.$avatarWrapper.append($avatarImage);
        this.$avatarWrapper.append($avatarStatus);

        return this.$avatarWrapper;
    }

    createStatusInfo() {
        this.$statusInfoWrapper = this.createElement('div', 'qfchat-status-bar__status-info-wrapper')

        const name = this.createElement('span', 'qfchat-status-bar__status-info-name')
        const status = this.createElement('span', 'qfchat-status-bar__status-info-status')

        name.innerHTML = 'Евгений';
        status.innerHTML = 'Онлайн';

        this.$statusInfoWrapper.append(name)
        this.$statusInfoWrapper.append(status)

        return this.$statusInfoWrapper;
    }
}