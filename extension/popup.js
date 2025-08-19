(function(){
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  function postActionToPage(action) {
    const scriptCode = `window.postMessage({ source: 'timetrackpro-extension', action: '${action}' }, '*');`;
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs && tabs[0] && tabs[0].id;
      if (!tabId) return;
      if (browserAPI.scripting && browserAPI.scripting.executeScript) {
        browserAPI.scripting.executeScript({
          target: { tabId },
          func: (code) => { try { eval(code); } catch(e) {} },
          args: [scriptCode]
        });
      } else if (browserAPI.tabs && browserAPI.tabs.executeScript) {
        browserAPI.tabs.executeScript(tabId, { code: scriptCode });
      }
    });
  }

  function sendAction(action) { postActionToPage(action); }

  document.getElementById('clock_in').addEventListener('click', () => sendAction('clock_in'));
  document.getElementById('break_start').addEventListener('click', () => sendAction('break_start'));
  document.getElementById('break_end').addEventListener('click', () => sendAction('break_end'));
  document.getElementById('clock_out').addEventListener('click', () => sendAction('clock_out'));
})();


