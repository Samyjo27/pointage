function sendAction(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;
    chrome.scripting.executeScript({
      target: { tabId },
      func: (action) => {
        window.postMessage({ source: 'timetrackpro-extension', action }, '*');
      },
      args: [action]
    });
  });
}

document.getElementById('clock_in').addEventListener('click', () => sendAction('clock_in'));
document.getElementById('break_start').addEventListener('click', () => sendAction('break_start'));
document.getElementById('break_end').addEventListener('click', () => sendAction('break_end'));
document.getElementById('clock_out').addEventListener('click', () => sendAction('clock_out'));


