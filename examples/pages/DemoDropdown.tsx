// @ts-nocheck

import { defineComponent, reactive, watch } from "vue";
import { SaDropdown, SaDropdownMenu, SaDropdowmOption, SaButton } from 'sa-ui'


export default defineComponent({
  setup() {
    const state = reactive({
      flag: false
    })
    
    return () => (
      <div>
        <SaDropdown
          v-model={state.flag}
          v-slots={{
            default: () => <SaButton>Dropdowm</SaButton>,
            popper: () => (
              <SaDropdownMenu
                onClickOption={ (e: MouseEvent, val) => console.log(val)}
              >
                <SaDropdowmOption label="芒果" value="1"></SaDropdowmOption>
                <SaDropdowmOption label="苹果" value="2"></SaDropdowmOption>
                <SaDropdowmOption label="李" value="3"></SaDropdowmOption>
                <SaDropdowmOption label="鸡腿" value="4"></SaDropdowmOption>
                <SaDropdowmOption label="人" value="5"></SaDropdowmOption>
              </SaDropdownMenu>
            )
          }}
        />
      </div>
    )
  }
})

