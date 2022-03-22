// deno-lint-ignore-file no-unused-vars
let uniqueWorldId = 0;

const Direction = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west",
};

class Room {
  /**
   * Create a new room
   * @param {string} name The name of the room
   * @param {string} narrative The narrative to display when the room is entered
   * @param {string} image The image to use for the room
   * @param {string[]} interactable The names of the interactable objects in the room
   * @param {object} initialData The initial shared data used within the room
   */
  constructor(name, narrative, image, interactables = [], initialData = {}) {
    this.id = uniqueWorldId++;
    this.name = name;
	this.narrative = narrative;
    this.image = image;
    this.listeners = {};
    this.interactables = interactables;
    this.data = initialData;
	this.visited = false;

	this.addListener(InternalAction.RoomStart, () => {
		addNarrative(narrative, !this.visited);
		this.visited = true;
	});
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
      return this.listeners[event].call(this, args);
    }
	const errorMessages = [
		"You can't do that here.",
		`You cannot ${event} here.`,
		"You cannot do that here."
	]
    return { status: false, message: errorMessages[Math.floor(Math.random() * errorMessages.length)] };
  }

  draw() {
    view.src = this.image;
  }
}
