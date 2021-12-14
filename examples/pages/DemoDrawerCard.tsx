// @ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaDrawerCard, SaInput } from 'sa-ui'


export default defineComponent({
  setup() {
    const state = reactive({
      showContent: false
    })
    return () => (
      <div>
        <SaDrawerCard 
          animation
          showContent={ state.showContent }
          onClickBclokTitle={ (showContent: boolean) => state.showContent = !showContent }
          title="我是标题拉"
          prefixContent={() => <div>1111111</div>}
          suffixContent={() => <div>1111111</div>}
        >
          <div slot="title">
            title
          </div>
          <div slot="content" style={{ padding: '20px' }}>
            11111
          </div>
        </SaDrawerCard>
      </div>
    )
  }
})