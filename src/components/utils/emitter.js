export default class Emitter {
    constructor() {
        this.events = []
    }

    emit(eventName, ...args) {
        const eventToFire = this.events.find(event => event.name === eventName);
 
        if (eventToFire) {
            eventToFire.callback.call(this, ...args)
        }
    }

    subscribe(eventName, fn) {
        this.events.push({
            name: eventName,
            callback: fn
        });
    }
}