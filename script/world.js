let currentRoom = undefined;
const rooms = {};

function initializeWorld() {
	const desert_outsideBase = new Room('Desert outside hangar', 'assets/inspiration/sq2.jpg');
	addRoom(desert_outsideBase);
	const desert_insideBase = new Room('Desert inside hangar', 'assets/inspiration/36b5.gif');
	addRoom(desert_insideBase);
	desert_outsideBase.addNeighbor(Direction.EAST, desert_insideBase);
	desert_insideBase.addNeighbor(Direction.WEST, desert_outsideBase);

	goto(desert_outsideBase.id);
}

function addRoom(room) {
	rooms[room.id] = room;
}

function goto(roomId) {
	if (currentRoom) currentRoom.notify('exit', roomId);
	currentRoom = rooms[roomId];
	currentRoom.draw();
	currentRoom.notify('enter', this.name);
}