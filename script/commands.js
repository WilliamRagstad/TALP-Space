function initializeCommands() {
  inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      execute(e.target.value);
    }
  });
}

function execute(command) {
  const parts = command.trim().toLowerCase().split(" ");
  const action = parts[0];
  const args = parts.shift();

  if (action === "help") showHelp(command);
  else if (action === "clear") clearHistory();
  else if (action === "inventory") inventory(command);
  else if (
    ["enter", "exit", "walk", "take", "drop", "use", "open", "close", "attack"]
      .includes(action)
  ) {
    const result = currentRoom.notify(action, args);
    addHistory(command, result.message, result.status);
  } else {
    let altAction = action;
    let found = false;
    for (let i = 0; i < args.length; i++) {
      altAction += " " + args[i];
      if (currentRoom.hasAction(altAction)) {
        const result = currentRoom.notify(altAction, args.slice(i + 1));
        addHistory(command, result.message, result.status);
        found = true;
        break;
      }
    }
    if (!found) {
      addHistory(command, `Unknown action '${action}'`, false);
    }
  }

  inputBox.value = "";
}

/** ========================================================================
 *                           Commands
 * ========================================================================* */

function showHelp(command) {
  let commands = Object.keys(Event).map((key) => Event[key]);
  addHistory(
    command,
    "Available commands: " + commands.sort().join(", "),
    true,
  );
}

function inventory(command) {
  addHistory(command, "You have nothing in your inventory", true);
}
