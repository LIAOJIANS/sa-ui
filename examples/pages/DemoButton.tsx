// @ts-nocheck

import { computed, defineComponent, reactive, watch } from "vue";
import { SaButton, SaDrawerCard } from 'sa-ui'
import { useRefs } from "src/hooks";
import { clipboard } from "src/hooks/utils/clipboard";
import { onMounted } from "vue";

export default defineComponent({
  setup() {
    const { onRef, refs } = useRefs({
      initBtn: HTMLElement
    })

    const state = reactive({
      showContent: false,
      initBtnText: `
      <SaButton> 默认按钮 </SaButton>
      <SaButton status="success"> 成功按钮 </SaButton>
      <SaButton status="warn"> 警告按钮 </SaButton>
      <SaButton status="info"> 信息按钮 </SaButton>
      <SaButton status="error"> 错误按钮 </SaButton>

      <SaButton mode="plain"> 空屡按钮 </SaButton>
      <SaButton mode="plain" status="success" > 成功按钮 </SaButton>
      <SaButton mode="plain" status="warn" > 警告按钮 </SaButton>
      <SaButton mode="plain" status="info" > 信息按钮 </SaButton>
      <SaButton mode="plain" status="error" > 错误按钮 </SaButton>
      `
    })

    return () => <div>
      <SaDrawerCard
        v-model={state.showContent}
        animation
        title={['收起代码', '展开代码']}
      >
        <div slot="title">
          <SaButton> 默认按钮 </SaButton>
          <SaButton status="success" style={{ marginLeft: '10px' }}> 成功按钮 </SaButton>
          <SaButton status="warn" style={{ marginLeft: '10px' }}> 警告按钮 </SaButton>
          <SaButton status="info" style={{ marginLeft: '10px' }}> 信息按钮 </SaButton>
          <SaButton status="error" style={{ marginLeft: '10px' }}> 错误按钮 </SaButton>
          <p style={{margin: '10px 0'}}></p>
          <SaButton mode="plain"> 空屡按钮 </SaButton>
          <SaButton mode="plain" status="success" style={{ marginLeft: '10px' }}> 成功按钮 </SaButton>
          <SaButton mode="plain" status="warn" style={{ marginLeft: '10px' }}> 警告按钮 </SaButton>
          <SaButton mode="plain" status="info" style={{ marginLeft: '10px' }}> 信息按钮 </SaButton>
          <SaButton mode="plain" status="error" style={{ marginLeft: '10px' }}> 错误按钮 </SaButton>
        </div>

        <div slot="content" v-highlight style={{ padding: '20px', position: 'relative' }}>
          <SaButton mode="text" style={{ position: 'absolute', right: '1%', top: '1%' }} onClick={ e => clipboard(state.initBtnText, refs.initBtn) }>复制</SaButton>
          <pre ref={onRef.initBtn}>
            <code class="language-html" v-text={state.initBtnText}>
            </code>
          </pre>
        </div>
      </SaDrawerCard>
    </div>
  }
})