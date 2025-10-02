class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  // register new listeners
  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    
    // execute the handler of listeners which listening the matched event.
    this.listeners[event].forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  removeAllListeners(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

module.exports = EventEmitter;