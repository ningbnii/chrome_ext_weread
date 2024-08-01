<!-- src/content/Content.vue -->
<template></template>

<script setup>
import { onMounted } from 'vue'
// 在页面加载时应用保存的字体
// 存储当前字体
let currentFont = ''
// 监听来自扩展的消息

onMounted(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'changeFont') {
      if (currentFont !== request.fontId) {
        currentFont = request.fontId || ''
        applyFontToPage(currentFont)
        triggerCanvasRedraw()
      }
    }
  })
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
  window.dispatchEvent(new Event('resize'))
}

// 初始化：应用保存的字体并设置 MutationObserver
chrome.storage.sync.get(['weread_user_font', 'weread_font_active'], (result) => {
  if (result.weread_user_font && result.weread_font_active !== false) {
    currentFont = result.weread_user_font
    applyFontToPage(currentFont)
    triggerCanvasRedraw()
  }
})
</script>

<style></style>
