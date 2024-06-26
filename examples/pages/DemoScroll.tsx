//@ts-nocheck

import { defineComponent } from "vue";
import { SaScroll } from 'sa-ui'


export default defineComponent({
  setup(props) {
    return () => <div style={{ height: '198px', width: '500px' }}>
      <SaScroll>
        <div>
          {[1, 2, 3, 4, 5, 7, 8, 9].map((c, i ) => <p style={{ lineHeight: 2 }} key={i}>{ c }</p>)}
        </div>
      </SaScroll>
    </div>
  }
})
