// deno-lint-ignore-file no-unused-vars
/**
 * The current room.
 * @type {Room}
 */
let currentRoom = undefined;
const rooms = {};

function initializeWorld() {
  const desert_outsideBase = new Room(
    "Desert outside bar",
    "You are standing outside a bar in the desert. The hangar is empty and you can hear the wind blowing in the distance.",
    "assets/inspiration/sq2.jpg",
  );
  addRoom(desert_outsideBase);

  const desert_insideBase = new Room(
    "Desert inside bar",
    "You are standing inside. There is lively music playing and you can see people chatting by the bar.",
    "assets/inspiration/36b5.gif",
  );
  addRoom(desert_insideBase);

  desert_outsideBase.addListener(Action.Enter, (args) => {
    if ([Keyword.Building.Bar].includes(args[0])) {
      goto(desert_insideBase);
      return { status: true, message: "You enter the " + args[0] + "." };
    }
    return { status: false, message: "Unknown building." };
  });
  desert_insideBase.addListener(Action.Exit, () => {
    goto(desert_outsideBase);
    return { status: true, message: "You exit the bar." };
  });

  goto(desert_outsideBase);
}

/**
 * Add a room to the world.
 * @param {Room} room The room to add
 */
function addRoom(room) {
  rooms[room.id] = room;
}

/**
 * Go to the given room.
 * @param {Room} room The room to go to
 */
function goto(room) {
  if (currentRoom) currentRoom.notify("end", room.id);
  currentRoom = rooms[room.id];
  currentRoom.draw();
  currentRoom.notify("beginning", this.name);
}
