const commandHistory = [];
let commandHistoryOffset = 0;
function initializeCommands() {
  inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      execute(e.target.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0 && commandHistoryOffset > 0) {
        commandHistoryOffset--;
        inputBox.value =
          commandHistory[commandHistory.length - 1 - commandHistoryOffset];
      }
    } else if (e.key === "ArrowDown") {
      // Move up the command history/down the list
      e.preventDefault();
      if (
        commandHistory.length > 0 &&
        commandHistoryOffset < commandHistory.length - 1
      ) {
        commandHistoryOffset++;
        inputBox.value =
          commandHistory[commandHistory.length - 1 - commandHistoryOffset];
      }
    }
  });
}

function execute(command) {
  const parts = command.trim().toLowerCase().split(" ");
  const action = parts[0];
  const args = parts.slice(1);

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
  commandHistory.push(command);
  commandHistoryOffset = -1;
  inputBox.value = "";
}

/** ========================================================================
 *                           Commands
 * ========================================================================* */

function showHelp(command) {
  const commands = Object.keys(Action).map((key) => Action[key]);
  addHistory(
    command,
    "Available commands: " + commands.sort().join(", "),
    true,
  );
}

function inventory(command) {
  addHistory(command, "You have nothing in your inventory", true);
}
