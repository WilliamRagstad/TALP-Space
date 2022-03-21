function initializeCommands() {
	inputBox.addEventListener('keydown', e => {
		if (e.key === 'Enter') {

			execute(e.target.value);
		}
	})
}

function execute(command) {
	const parts = command.toLowerCase().split(' ');
	const action = parts[0];
	const args = parts.shift();

	switch (action) {
		case 'help':
			showHelp(command);
			break;
		case 'clear':
			clearHistory();
			break;
		default:
			addHistory(command);
			break;
	}
	inputBox.value = '';
}

/**========================================================================
 *                           Commands
 *========================================================================**/

function showHelp(command) {
	addHistory(command, 'Available commands: help, clear');
}