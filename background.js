chrome.runtime.onInstalled.addListener(() => {
  let headers = [{ id: 0, name: '', value: '', isEnabled: true }]

  chrome.storage.sync.set({ headers }, () => {
    console.log('Chrome-Headers has been installed')
  })

  chrome.storage.onChanged.addListener(changes => {
    headers = changes.headers.newValue
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
