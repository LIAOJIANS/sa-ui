// @ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaCollapse, SaCollapseGroup  } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      val: ['1']
    })

    return () => <div>
      <SaCollapseGroup
      v-model={ state.val }
      >
        {
          ['1', '2', '3', '4', '5', '6', '7', '8'].map(c => <SaCollapse
            title={c}
            content={c}
            value={c}
            key={c}
          />)
        }
      </SaCollapseGroup>
    </div>
  }
})