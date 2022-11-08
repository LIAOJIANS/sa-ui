// @ts-nocheck
import { defineComponent, ref } from "vue"
import { SaIcon, useMessage, clipboard } from 'sa-ui'
import './scss/DemoIcon.scss'

export default defineComponent({
  setup() {

    const iconFile = require.context('sa-ui/SaIcon/icons', false, /\.json$/)
    const $message = useMessage()

    const icons = ref([])

    iconFile.keys().forEach(c => {
      const icon = c.split('/')[1].split('.')[0]
      if (icon.indexOf('el-') === 0) {
        icons.value.push(icon)
      }
    })

    const copyIconName = (iconName: string) => { // 复制文本内容
      clipboard({ text: iconName})
    }

    return () => (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: '#333' }}>Icon 图标</h1>
          <span style={{ color: '#666', fontSize: '14px' }}>常用的操作按钮，点击图表即复制到剪贴板</span>
        </div>
        <div class="demo-icon" style={{ marginBottom: '20px' }}>
          {
            icons.value.map(c => (
              <div class="icon-item" onClick={_ => copyIconName(c)}>
                <SaIcon icon={c} size={42} color="#3C64A0" />
                <p>{c}</p>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
})