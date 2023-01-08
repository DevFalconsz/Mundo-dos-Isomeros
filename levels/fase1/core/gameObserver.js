const gameObserver = {
  observers: [],

  subscribles(callbacks) {
    this.observers = [...this.observers, ...callbacks]
  },

  unsubscribleAll() {
    this.observers = []
  },

  notifyAll() {
    this.observers.forEach(cb => cb())
  }
}

export default gameObserver