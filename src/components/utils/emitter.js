export default class Emitter {
    constructor() {
        this.events = {}
    }

    emit(eventName, ...args) {
        const eventToFire = this.events.hasOwnProperty(eventName);
        
        if (eventToFire) {
            this.events[eventName].forEach(callback => callback.call(this, ...args))
        }
    }

    subscribe(eventName, fn) {
        if (!this.events.hasOwnProperty(eventName)) {
            this.events[eventName] = [];
            this.events[eventName].push(fn);
        } else {
            this.events[eventName].push(fn);
        }
    }
}