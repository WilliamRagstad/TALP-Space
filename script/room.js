let uniqueWorldId = 0;

const Direction = {
	NORTH: 'north',
	SOUTH: 'south',
	EAST: 'east',
	WEST: 'west',
}

class Room {
	constructor(name, image) {
		this.id = uniqueWorldId++;
		this.name = name;
		this.image = image;
		this.listeners = {};
		this.neighbors = {};
	}

	addListener(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	notify(event, command, ...args) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(listener => listener(command, ...args));
		}
	}

	addNeighbor(direction, room) {
		if (this.neighbors[direction]) {
			throw new Error(`Room ${this.name} already has a neighbor in direction ${direction}`);
		}
		if (!Object.values(Direction).includes(direction)) {
			throw new Error(`Direction ${direction} is not a valid direction`);
		}
		this.neighbors[direction] = room;
	}

	draw() {
		view.src = this.image;
	}
}