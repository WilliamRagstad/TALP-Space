// deno-lint-ignore-file no-unused-vars
/** ========================================================================
 *                           Helper functions
 * ========================================================================* */

/**
 * Add a new history item to the history list.
 * @param {string} command The command that was executed
 * @param {string} output The output of the command
 * @param {boolean} success Whether the command was successful
 */
function addHistory(command, output, success) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  const successIcon = success ? "✔" : "✘";
  historyItem.innerHTML =
    `<span class="history-command">${successIcon} ${command}</span>`;
  historyItem.innerHTML += `<span class="history-output">${output}</span>`;
  history.insertBefore(historyItem, history.firstChild);
  // history.appendChild(historyItem);
  updateOpacities();
}

function addNarrative(text, speak = true) {
  narrative.innerHTML = text;
  if (speak) {
    setTimeout(() => {
      narratorSpeak(text);
    }, 1000);
  }
}

function updateOpacities() {
  const minOpacity = 0.25;
  const steps = 5;
  const necessaryNr = Math.min(historyItems.length, steps);
  for (let i = 0; i < necessaryNr; i++) {
    historyItems[i].style.opacity = Math.max(minOpacity, 1 - (i / steps)); // historyItems.length);
  }
}

function clearHistory() {
  history.innerHTML = "";
}

/** ========================================================================
 *                           Narrator
 * ========================================================================* */

// deno-lint-ignore prefer-const
let narratorEnabled = true;
const narrator = new SpeechSynthesisUtterance();
const voices = speechSynthesis.getVoices().filter((v) =>
  v.lang.startsWith("en")
);
narrator.lang = "en-US";
narrator.rate = 1.3;
narrator.pitch = 0.7;
narrator.volume = 0.4;
narrator.voice = voices[0];
function narratorSpeak(text) {
  if (!narratorEnabled) return;
  narrator.text = text;
  window.speechSynthesis.speak(narrator);
}
