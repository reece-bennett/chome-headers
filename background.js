chrome.runtime.onInstalled.addListener(() => {
  let headers = []

  chrome.storage.sync.get('headers', data => {
    if (data.headers)  {
      headers = data.headers
    } else {
      chrome.storage.sync.set({ headers })
    }
  })

  chrome.storage.onChanged.addListener(changes => {
    if (changes.headers) {
      headers = changes.headers.newValue
    }
  })

  chrome.webRequest.onBeforeSendHeaders.addListener(
    details => {
      for (const header of headers) {
        if (header.isEnabled && header.name) {
          details.requestHeaders.push({
            name: header.name,
            value: header.value
          })
        }
      }

      return { requestHeaders: details.requestHeaders }
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
  )
})
