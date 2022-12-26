const gameEvents = {
  events: {},

  on(eventName, callback) {
    const event = gameEvents.events[eventName] || []
    gameEvents.events[eventName] = [...event, callback];
  },

  emit(eventName, ...param) {
    const event = gameEvents.events[eventName] || []
    event.forEach(callback => callback(...param))
  },
}

export default gameEvents