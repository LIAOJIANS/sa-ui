// @ts-nocheck

import { defineComponent, ref } from "vue"
import { SaIcon } from 'sa-ui'
import './scss/DemoIcon.scss'

export default defineComponent({
  setup() {

    const iconFile = require.context('sa-ui/SaIcon/icons', false, /\.json$/)

    const icons = ref([])
    const inputRef = ref(null) as any

    iconFile.keys().forEach(c => {
      const icon = c.split('/')[1].split('.')[0]
      if (icon.indexOf('el-') === 0) {
        icons.value.push(icon)
      }
    })

    const copyIconName = (iconName: string) => { // 复制文本内容
      inputRef.value.value = iconName
      inputRef.value.select()
      document.execCommand('copy')
    }

    return () => (
      <div class="demo-icon">
        <input ref={inputRef} style={ { position: 'absolute', top: '-999em' } } />
        {
          icons.value.map(c => (
            <div class="icon-item" onClick={ _ => copyIconName(c) }>
              <SaIcon icon={c} size={22} color="#08979c" />
              <p>{c}</p>
            </div>
          ))
        }
      </div>
    )
  }
})