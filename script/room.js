// deno-lint-ignore-file no-unused-vars
let uniqueWorldId = 0;

const Direction = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west",
};

class Room {
  constructor(name, image, initialData = {}) {
    this.id = uniqueWorldId++;
    this.name = name;
    this.image = image;
    this.listeners = {};
    this.data = initialData;
  }

  /**
   * Adds a listener for the given event.
   * @param {Action} event The action event to listen for
   * @param {(args: string[]) => { status: boolean, message: string }} callback The callback to call when the event is triggered
   */
  addListener(event, callback) {
    if (this.listeners[event]) {
      throw new Error(
        `Room ${this.name} already has a listener for event ${event}`,
      );
    }
    this.listeners[event] = callback;
  }

  /**
   * @param {Action} event The action event to trigger
   * @param {string} command The command that triggered the event
   * @param {string[]} args The arguments to the command
   * @returns {{ status: boolean, message: string }} Whether the event was handled and successful
   */
  notify(event, args) {
    if (this.listeners[event]) {
      return this.listeners[event](args);
    }
    return { status: false, message: "You cannot do that here" };
  }

  hasAction(action) {
    return this.listeners[action] !== undefined;
  }

  draw() {
    view.src = this.image;
  }
}
