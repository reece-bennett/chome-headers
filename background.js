const DISABLED_ICON_PATHS = {
  16: 'images/cloud_disabled_16.png',
  32: 'images/cloud_disabled_32.png',
  48: 'images/cloud_disabled_48.png',
  128: 'images/cloud_disabled_128.png'
}
const ENABLED_ICON_PATHS = {
  16: 'images/cloud_enabled_16.png',
  32: 'images/cloud_enabled_32.png',
  48: 'images/cloud_enabled_48.png',
  128: 'images/cloud_enabled_128.png'
}
const BADGE_COLOUR = '#db4343'

chrome.runtime.onInstalled.addListener(() => {
  let headers = []
  
  chrome.browserAction.setBadgeBackgroundColor({ color: BADGE_COLOUR })
  
  chrome.storage.sync.get('headers', data => {
    if (data.headers)  {
      headers = data.headers
    } else {
      chrome.storage.sync.set({ headers })
    }
    updateIcon(headers)
  })

  chrome.storage.onChanged.addListener(changes => {
    if (changes.headers) {
      headers = changes.headers.newValue
    }
    updateIcon(headers)
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

function updateIcon(headers) {
  const numEnabled = headers.filter(h => h.isEnabled).length
  chrome.browserAction.setBadgeText({
    text: numEnabled ? `${numEnabled}` : ''
  })
  chrome.browserAction.setIcon({
    path: numEnabled ? ENABLED_ICON_PATHS : DISABLED_ICON_PATHS
  })
}
