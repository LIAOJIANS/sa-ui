// @ts-nocheck

import { defineComponent } from "vue";
import { SaTitle, SaIcon } from 'sa-ui'
import './scss/DemoTitle.scss'

export default defineComponent({
  setup() {
    return () => (
      <div class="title-class">
        <p>1. vline 模式：</p>
        <span>hidden： 溢出隐藏并显示省略号</span>
        <SaTitle
          title='我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title我是title'
          direction='left'
          mode={{ type: 'vline', direction: 'left' }}
          hidden
          bgc
        />

        
        <span>direction： 方向 center | left | right</span>
        <SaTitle
          title='我是title'
          direction='center'
          mode={{ type: 'vline', direction: 'left' }}
          bgc
        />

        
        <span>bg: 自定义背景色</span>
        <SaTitle
          title='我是title'
          direction='right'
          mode={{ type: 'vline', direction: 'left' }}
          bgc='red'
        />

        <p>2. hline 模式：</p>
        <SaTitle
          direction="left"
        >
          111
        </SaTitle>

        <p>3. slot 自定义内容</p>
        <SaTitle
          direction='left'
          mode={{ type: 'vline', direction: 'left' }}
          bgc
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p>111</p>
            <SaIcon icon="el-icon-arrow-down" />
          </div>
        </SaTitle>
      </div>
    )
  }
})