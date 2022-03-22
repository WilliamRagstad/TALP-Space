// deno-lint-ignore-file no-unused-vars
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
  else if (action + " " + args[0] === "look around") lookAround(command);
  else {
    let altAction = "";
    let found = false;
    for (let i = 0; i < parts.length; i++) {
      if (altAction.length > 0) {
        altAction += " " + parts[i];
      } else {
        altAction = parts[i];
      }
      if (Object.values(Action).includes(altAction)) {
        const altArgs = parts.slice(i + 1);
        const result = currentRoom.notify(altAction, altArgs);
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
  const formatCommand = (command) =>
    `<span class="help-command">${command}</span>`;
  const commands = Object.keys(Action).map((key) => Action[key]);
  const lastCommand = commands.pop();
  addHistory(
    command,
    "Available commands: " + formatList(commands.sort(), formatCommand) + ".",
    true,
  );
}

function inventory(command) {
  addHistory(
    command,
    "You have " + formatList([]) + " in your inventory",
    true,
  );
}

function lookAround(command) {
  addHistory(command, "You see " + formatList(currentRoom.interactables), true);
}

/** ========================================================================
 *                           Helper Functions
 * ========================================================================* */

/**
 * Format a list of items into a string.
 * @param {any[]} list The list to format
 * @param {(e: string) => string} [formatter=e=>e] The formatter function
 * @param {string} [separator="and"] The separator to use between items
 * @param {string} [defaults="nothing"] The default string to use if the list is empty
 */
function formatList(
  list,
  formatter = (e) => e,
  separator = "and",
  defaults = "nothing",
) {
  if (list.length === 0) return defaults;
  if (list.length === 1) return formatter(list[0]);
  return list.slice(0, -1).map(formatter).join(", ") + " " + separator + " " +
    formatter(list[list.length - 1]);
}
