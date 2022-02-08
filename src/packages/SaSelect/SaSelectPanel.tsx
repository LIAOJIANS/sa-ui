import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useNumber, useRefs } from "src/hooks";
import { PropType } from "vue";
import { SaScroll } from "../SaScroll/SaScroll";

export const SaSelectPanel = designComponent({

  name: 'sa-select-panel',

  props: {
    modelValue: { type: [Number, Array, String] },

    multiple: { type: Array },
    multipleMaxLimit: { type: [Number, String] },                     // 多选最多选择个数
    multipleMinLimit: { type: [Number, String] },                     // 多选最少选择个数

    noMatchText: { type: String, defalut: '暂无匹配数据' },
    noDataText: { type: String, defalue: '暂无数据' },

    filterMethod: { type: Function as PropType<(option: { val: string | number, label: string | number, disabled?: boolean }) => boolean> },// 筛选过滤函数

    content: { type: [Object, Function] },
    height: { type: Number },

    showDebug: { type: Boolean }
  },

  provideRefer: true,
  slots: ['defalut'],

  setup({ props, slots, event: { emit } }) {

    const { numberState } = useNumber(props, ['multipleMaxLimit', 'multipleMinLimit'])
    
    const {} = useRefs({ scroll: SaScroll })

    return {
      render: () => <div>
        1
      </div>
    }
  }
})