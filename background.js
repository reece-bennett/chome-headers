chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ headers: [] }, () => {
    console.log("Chrome-Headers has been installed")

    chrome.storage.onChanged.addListener(changes => {
      console.log(changes)
    })
  })
}) 
