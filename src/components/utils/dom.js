export default class Dom {
    constructor() {}

    createElement(tagName, classes) {
        try {
            const el = document.createElement(tagName);
            
            if (classes) {
                if (Array.isArray(classes)) {
                    el.classList.add(...classes)
                } else {
                    el.classList.add(classes);
                }
            }

            return el;
        } catch (e) {
            console.log('Invalid name of DOM element');
        }
    }
}