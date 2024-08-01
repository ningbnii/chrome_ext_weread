<script setup lang="js">
import { ref, onMounted } from 'vue'

const systemFonts = ref([])
const userFont = ref('')
const isCustomFontActive = ref(true)

onMounted(() => {
  chrome.storage.sync.get(['weread_user_font', 'weread_font_active'], (result) => {
    if (result.weread_user_font) {
      userFont.value = result.weread_user_font
      isCustomFontActive.value = result.weread_font_active !== false
      // if (isCustomFontActive.value) {
      //   applyFontToCurrentTab(userFont.value)
      // }
    }
  })

  chrome.fontSettings.getFontList((fonts) => {
    systemFonts.value = fonts
  })
})

function handleFontChange() {
  if (userFont.value) {
    chrome.storage.sync.set(
      {
        weread_user_font: userFont.value,
        weread_font_active: true,
      },
      () => {
        console.log('Font saved and activated')
      },
    )
    applyFontToCurrentTab(userFont.value)
    isCustomFontActive.value = true
  }
}

function toggleCustomFont() {
  isCustomFontActive.value = !isCustomFontActive.value
  chrome.storage.sync.set({ weread_font_active: isCustomFontActive.value }, () => {
    console.log('Font activation toggled')
  })
  if (isCustomFontActive.value && userFont.value) {
    applyFontToCurrentTab(userFont.value)
  } else {
    applyFontToCurrentTab('') // 空字符串表示恢复默认字体
  }
}

function applyFontToCurrentTab(fontId) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0]
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'changeFont',
        fontId: fontId,
      })
    }
  })
}
</script>

<template>
  <div class="w-80 bg-gray-100 flex flex-col items-center justify-center min-h-screen p-4">
    <div class="bg-white p-8 rounded shadow-md max-w-lg text-center mb-4">
      <h1 class="text-2xl font-bold mb-4">插件介绍</h1>
      <p class="text-gray-700 text-xl text-justify">这个插件可以让你微信读书网页端自定义字体。</p>
    </div>

    <!-- 选择系统字体 -->
    <div class="w-full mb-4">
      <label for="font-select" class="block text-sm font-medium text-gray-700 mb-2"
        >选择系统字体</label
      >
      <select
        id="font-select"
        v-model="userFont"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        @change="handleFontChange"
      >
        <option value="">请选择字体</option>
        <option v-for="font in systemFonts" :key="font.fontId" :value="font.fontId">
          {{ font.displayName }}
        </option>
      </select>
    </div>

    <!-- 显示选中的字体 -->
    <p v-if="userFont" class="text-sm text-gray-600 mb-4">
      当前选中字体: {{ systemFonts.find((f) => f.fontId === userFont)?.displayName }}
    </p>

    <!-- 切换按钮 -->
    <button
      @click="toggleCustomFont"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      {{ isCustomFontActive ? '使用默认字体' : '使用自定义字体' }}
    </button>
  </div>
</template>
