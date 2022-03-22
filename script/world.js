// deno-lint-ignore-file no-unused-vars
/**
 * The current room.
 * @type {Room}
 */
let currentRoom = undefined;
const rooms = {};

function initializeWorld() {
  const desert_outsideBar = new Room(
    "Desert outside bar",
    "You are standing outside a bar in the desert. There are some ships left in the hangar and you can hear the wind blowing in the distance.",
    "assets/world/desert_bar_outside.png",
    ["a bar", "space ships", "a speeder"],
  );
  addRoom(desert_outsideBar);

  const desert_insideBar = new Room(
    "Desert inside bar",
    "You are standing inside. There is lively music playing and you can see people chatting by the bar.",
    "assets/inspiration/36b5.gif",
    ["people", "bar"],
  );
  addRoom(desert_insideBar);

  desert_outsideBar.addListener(Action.Enter, function(args) {
    if ([Keyword.Building.Bar].includes(args[0])) {
      this.data.onSpeeder = false;
      goto(desert_insideBar);
      return { status: true, message: "You enter the " + args[0] + "." };
    }
    return { status: false, message: "Unknown building." };
  });
  desert_outsideBar.addListener(Action.Mount, function (args) {
    if (args[0] === "speeder") {
      this.data.onSpeeder = true;
      return { status: true, message: "You sat on the speeder." };
    }
    return { status: false, message: "You can't mount that." };
  });
  desert_outsideBar.addListener(Action.Start, function (args) {
    if (args[0] === "engine") {
      if (this.data.onSpeeder) {
        return { status: true, message: "You ignite the speeder's engine." };
      }
      return { status: false, message: "You have no vehicle to start." };
    }
    return { status: false, message: "You can't start that." };
  });

  desert_insideBar.addListener(Action.Exit, () => {
    goto(desert_outsideBar);
    return { status: true, message: "You exit the bar." };
  });

  goto(desert_outsideBar);
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
  if (currentRoom) currentRoom.notify(InternalAction.RoomEnd);
  currentRoom = rooms[room.id];
  currentRoom.draw();
  currentRoom.notify(InternalAction.RoomStart);
}
