//@ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaTag } from 'sa-ui'

export default defineComponent({

  setup() {

    const state = reactive({
      tags: [
        { label: 'primary', type: 'primary' },
        { label: 'success', type: 'success', plain: true },
        { label: 'warn', type: 'warn' },
        { label: 'info', type: 'info' },
        { label: 'error', type: 'error' }
      ]
    })

    const handler = {
      close(type) {
        state.tags = state.tags.filter(c => c.type !== type)
      },

      click() {
        console.log('click');
        
      }
    }

    return () => <div>
      
      {
        state.tags.map(c => <SaTag 
          style={{ marginLeft: '10px' }} 
          status={ c.type } 
          key={c.type}
          plain={ c.plain }
          onClose={ () => handler.close(c.type) }
          onClick={ handler.click }
        >{ c.label }</SaTag>)
      }

      
    </div>
  }
})