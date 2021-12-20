// @ts-nocheck

import { defineComponent, ref } from "vue";
import { SaTitle, SaDrawerCard, SaButton } from 'sa-ui'
import { clipboard } from "src/hooks/utils/clipboard";

export default defineComponent({

  props: {
    codeText: { type: String },
    label: { type: String }
  },

  slots: ['title', 'content'],
  setup(props, { slots }) {

    const codeRef = ref(null)

    if (!slots.default || slots.default()?.length === 0) {
      console.error('children is not default!')
      return null
    }

    const childs = slots.default()

    let titleSlot = null,
      contentSlot = null

    if (childs.length > 0) {
      titleSlot = childs.find(c => c.props.slot === 'title')
      contentSlot = childs.find(c => c.props.slot === 'content')
    }
    return () => <>

      <SaTitle mode={{ type: 'vline', direction: 'left' }} style={{ margin: '30px 0' }}>{ props.label }</SaTitle>
      <p style={{ margin: '10px 0' }}></p>

      <SaDrawerCard
        animation
        title={['收起代码', '展开代码']}
      >
        <div slot="title">
          {titleSlot ? titleSlot : null}
        </div>

        <div slot="content" v-highlight style={{ padding: '20px', position: 'relative' }}>
          {contentSlot ? contentSlot : <div slot="content">
            <SaButton mode="text" style={{ position: 'absolute', right: '1%', top: '1%' }} onClick={e => clipboard(props.codeText, codeRef.value)}>复制</SaButton>
            <pre ref={codeRef.value}>
              <code class="language-html" v-text={props.codeText}>
              </code>
            </pre>
          </div>
          }
        </div>
      </SaDrawerCard>
    </>
  }
})