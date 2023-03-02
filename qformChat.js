import ChatBtnClass from "./src/components/chatBtn.js";
import Emitter from "./src/components/utils/emitter.js"

async function init() {
    const EmitterInstance = new Emitter();
    const ChatBtn = new ChatBtnClass({emitter: EmitterInstance});
    ChatBtn.init()
}

(() => { 
    init();
})()

export default {}