/* eslint-disable id-denylist */
/* eslint-disable @typescript-eslint/ban-types */
class Event {
  private name: string;

  callbacks: Function[];

  constructor(name: string) {
    this.name = name;
    this.callbacks = [];
  }

  on(cb: Function) {
    this.callbacks.push(cb);
  }

  off(cb: Function) {
    const idx = this.callbacks.findIndex((callback) => {
      return callback === cb;
    });
    this.callbacks.splice(idx, 1);
  }

  toString() {
    return this.name;
  }
}

class EventDispatcher {
  events: { [name: string]: Event };

  constructor() {
    this.events = {};
  }

  emit(name: string, ...args: unknown[]) {
    if (!this.events[name]) {
      return;
    }

    this?.events[name]?.callbacks.forEach((cb) => {
      cb(...args);
    });
  }

  addEventListener(name: string, cb: Function): void {
    if (!this.events[name]) {
      this.events[name] = new Event(name);
    }

    this?.events[name]?.on(cb);
  }

  removeEventListener(name: string, cb?: Function) {
    if (!cb) {
      delete this.events[name];

      return;
    }

    this?.events[name]?.off(cb);
  }
}

export default EventDispatcher;
