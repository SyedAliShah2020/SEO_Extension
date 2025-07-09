chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchSEO") {
    fetch(`http://127.0.0.1:5000/api/seo?q=${encodeURIComponent(request.keyword)}`)
      .then(res => res.json())
      .then(data => sendResponse(data))
      .catch(err => {
        console.error("❌ Error in background fetch:", err);
        sendResponse({ error: true });
      });
    return true;
  }
});
