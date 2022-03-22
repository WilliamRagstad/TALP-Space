// deno-lint-ignore-file no-unused-vars
let currentRoom = undefined;
const rooms = {};

function initializeWorld() {
  const desert_outsideBase = new Room(
    "Desert outside bar",
    "assets/inspiration/sq2.jpg",
  );
  addRoom(desert_outsideBase);

  const desert_insideBase = new Room(
    "Desert inside bar",
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

function addRoom(room) {
  rooms[room.id] = room;
}

function goto(room) {
  if (currentRoom) currentRoom.notify("end", room.id);
  currentRoom = rooms[room.id];
  currentRoom.draw();
  currentRoom.notify("beginning", this.name);
}
