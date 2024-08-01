import { createApp } from 'vue'
import './../style.css'

import Content from './Content.vue'

const div = document.createElement('div')
div.id = 'vue-app'
document.body.appendChild(div)

createApp(Content).mount('#vue-app')
