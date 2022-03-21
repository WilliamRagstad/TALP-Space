

/**========================================================================
 *                           Helper functions
 *========================================================================**/

function addHistory(command, output) {
	const historyItem = document.createElement('div');
	historyItem.classList.add('history-item');
	historyItem.innerHTML = `<span class="history-command">${command}</span>`;
	historyItem.innerHTML += `<span class="history-output">${output}</span>`;
	history.insertBefore(historyItem, history.firstChild);
	// history.appendChild(historyItem);
	updateOpacities();
}

function updateOpacities() {
	const minOpacity = 0.25;
	const steps = 8;
	const necessaryNr = Math.min(historyItems.length, steps);
	for (let i = 0; i < necessaryNr; i++) {
		historyItems[i].style.opacity = Math.max(minOpacity, 1 - (i / steps)); // historyItems.length);
	}
}

function clearHistory() {
	history.innerHTML = '';
}