chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ headers: [] }, function() {
    console.log("Chrome-Headers has been installed")
  })
})
