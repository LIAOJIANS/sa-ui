import { createApp } from 'vue'

import SaUi from '../src/packages'
import { dirHeighLight } from './directives/highlight'
import App from './App'

const app = createApp(App)

// 自定义代码高亮指令
dirHeighLight(app)

app.mount('#app')

app.use(SaUi)