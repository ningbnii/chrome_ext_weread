<!-- src/content/Content.vue -->
<template></template>

<script setup>
// 存储当前字体
let currentFont = ''

chrome.storage.sync.get(['weread_user_font', 'weread_font_active'], (result) => {
  if (result.weread_user_font && result.weread_font_active !== false) {
    // 设置sessionStorage weread_font_initialized，防止重复初始化
    currentFont = result.weread_user_font
    applyFontToPage(currentFont)
    triggerCanvasRedraw()
  }
})

// 监听来自扩展的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'changeFont') {
    currentFont = request.fontId || ''
    applyFontToPage(currentFont)
    triggerCanvasRedraw()
  }
})

// 将字体应用到页面
function applyFontToPage(fontId) {
  const style = document.getElementById('custom-font-style') || document.createElement('style')
  style.id = 'custom-font-style'
  style.textContent = fontId
    ? `
    * {
      font-family: '${fontId}', sans-serif !important;
    }
  `
    : ''
  document.head.appendChild(style)
}

// 触发 Canvas 重绘的方法集合
function triggerCanvasRedraw() {
  // isNormalReader，是否有这个class的button，下面的span
  const isNormalReader = document.querySelector('.isNormalReader')

  if (isNormalReader) {
    // 模拟触发键盘事件，触发页面重绘，按下方向键前进，然后等300ms后触发后退，触发页面重绘
    const backEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 37,
    })
    document.dispatchEvent(backEvent)
    setTimeout(() => {
      const forwardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 39,
      })
      document.dispatchEvent(forwardEvent)
    }, 500)
  } else {
    window.dispatchEvent(new Event('resize'))
  }
}
</script>

<style></style>
