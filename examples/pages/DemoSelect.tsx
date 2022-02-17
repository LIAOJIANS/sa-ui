// @ts-nocheck

import { defineComponent, ref, shallowReactive,reactive } from "vue";
import { SaSelect, SaSelectOption,  } from 'sa-ui'


export default defineComponent({
  setup() {

    const list = [
      { name: '春节', val: 'Chun' },
      { name: '万圣节', val: 'WanSheng' },
      { name: '青年节', val: 'QinNian' },
      { name: '中年节', val: 'ZhongNian', isDisabled: true, },
      { name: '国庆节', val: 'GuoQing', isDisabled: true, },
      { name: '中秋节', val: 'ZhongQiu', isDisabled: true, },
      { name: '劳动节', val: 'LaoDong', isDisabled: true, },
      { name: '圣诞节', val: 'ShengDan' },
      { name: '儿童节', val: 'ErTong' },
      { name: '妇女节', val: 'FuNv' },
      { name: '教师节', val: 'JiaoShi' },
      { name: '清明节', val: 'QingMing' },
    ]

    
    const val = reactive({val: {} as any}).val

    return () => <div>
      <SaSelect
       v-model={val[3]}
       multiple
      > {list.map(item => <SaSelectOption key={item.name} val={item.val} label={item.name}/>)}
      </SaSelect>
    </div>
  }
})