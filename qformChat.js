import ChatBtnClass from "./src/components/chatBtn.js";

async function init() {
    const ChatBtn = new ChatBtnClass();
    ChatBtn.init()
}

(() => { 
    init();
})()

export default {}