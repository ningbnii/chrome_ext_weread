console.log('background is running')

// 中间件，监听消息，使用 chrome.storage.local
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'sessionStorageSave') {
    chrome.storage.local.get('temporaryDataKeys', (result) => {
      let keys = result.temporaryDataKeys || []
      if (!keys.includes(message.key)) {
        keys.push(message.key)
      }
      chrome.storage.local.set({ [message.key]: message.value, temporaryDataKeys: keys }, () => {
        sendResponse({ status: 'Data saved' })
      })
    })
    return true // 保持响应通道以便异步响应
  } else if (message.type === 'sessionStorageGet') {
    chrome.storage.local.get([message.key], (result) => {
      sendResponse({ data: result[message.key] })
    })
    return true // 保持响应通道以便异步响应
  }
})

// 在浏览器关闭或插件卸载时清除特定数据
chrome.runtime.onSuspend.addListener(() => {
  chrome.storage.local.get('temporaryDataKeys', (result) => {
    const keys = result.temporaryDataKeys || []
    if (keys.length > 0) {
      chrome.storage.local.remove(keys, () => {
        chrome.storage.local.remove('temporaryDataKeys', () => {
          console.log('Session data cleared')
        })
      })
    }
  })
})
