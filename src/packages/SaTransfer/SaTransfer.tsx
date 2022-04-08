import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, PropType, reactive } from "vue";
import './SaTransfer.scss'
import SaTransferPanel from "../SaTransferPanel/SaTransferPanel";
import SaButton from "../SaButton/SaButton";
import { useModel } from "src/hooks";

export type TransferData = {
  key: string,
  label: string,
  disabled: boolean
}

export const SaTransfer = designComponent({
  name: 'sa-transfer',

  props: {
    modelValue: { type: Array as PropType<string[]>, default: [] },        // 右边绑定选中后的数组
    btnTexts: { type: Array as PropType<string[]> },                       // 按钮文字数组
    titles: { type: Array as PropType<string[]> },
    leftDefaultChecked: { type: Array },                                   // 左边默认选中数组
    rightDefaultChecked: { type: Array },                                  // 右边默认选中数组
    data: { type: Array as PropType<TransferData[]>, default: [] },        // 总数据
    filterable: { type: Boolean },                                         // 是否查询数据
    noMatchText: { type: String, default: '暂无匹配数据' },
    noDataText: { type: String, default: '暂无数据' },
  },

  slots: ['leftFun', 'rightFun'],

  provideRefer: true,

  emits: {
    onUpdateModelValue: (val?: string[]) => true,
    onTransferChange: (key: any) => true,
    onLeftChange: (key: any) => true,
    onRightChange: (key: any) => true
  },

  setup({ props, slots, event: { emit } }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const state = reactive({
      btnIcons: ['el-icon-arrow-left', 'el-icon-arrow-right'],
      leftChecked: [],
      rightChecked: [],
      lefeFilterCondition: '',
      rightFilterCondition: ''
    }) as any

    const btnTitles = computed(() => {
      return props.btnTexts && props.btnTexts.length > 1 ? props.btnTexts : state.btnIcons
    })

    const titles = computed(() => {
      if (!!props.titles && props.titles.length > 1) {
        return props.titles
      }

      return ['列表1', '列表2']
    })

    const leftFilterData = computed(() => {
      if (!!model.value && model.value.length > 0) {
        const data = utils.leftFilter()

        return utils.filterData(data)
      }

      return utils.filterData(props.data)
    })

    const rightFilterData = computed(() => !!model.value ?
      props.data
        .filter(c => !!props.filterable && state.rightFilterCondition ?
          model.value.indexOf(c.key) > -1 && c.label.indexOf(state.rightFilterCondition) > -1 :
          model.value.indexOf(c.key) > -1) : [])

    const handler = {
      btnIcon(tit: string, index: number) {
        if (utils.hasBtnTitles(tit)) {
          return tit
        }
        return state.btnIcons[index]
      },

      dirMove: (index: number) => {
        const type = index == 0 ? 'right' : 'left'

        emit.onTransferChange(state[`${type}Checked`])

        if (type === 'right') {
          model.value = model.value.filter(c => state.rightChecked.indexOf(c) === -1)
          state.rightChecked = []
        } else {
          model.value = [
            ...model.value,
            ...state.leftChecked
          ]

          state.leftChecked = []
        }

      },

      leftChecked: (keys: string[]) => {
        emit.onLeftChange(keys)
      },

      rightChecked: (keys: string[]) => {
        emit.onRightChange(keys)
      },

      filterData: ({ val, type }: { val: string, type: 'left' | 'right' }) => state[`${type}FilterCondition`] = val
    }

    const utils = {
      hasBtnTitles: (tit: string) => state.btnIcons.indexOf(tit) > -1,

      leftFilter: () => props.data?.filter(c => model.value?.indexOf(c.key) === -1),

      filterText: (type: string) => !!props.filterable && state[`${type}FilterCondition`],

      filterData: (data: TransferData[]) => !!props.filterable && state.leftFilterCondition ? data.filter(c => c.label.indexOf(state.leftFilterCondition) > -1) : data
    }

    return {

      refer: {
        props,
        slots,
        handler,
        utils
      },

      render: () => <div class="sa-transfer">
        <div>
          <SaTransferPanel
            v-model={state.leftChecked}
            type="left"
            filterable
            checkeds={props.leftDefaultChecked}
            title={titles.value[0]}
            isWithFooter={slots.leftFun.isExist()}
            data={leftFilterData.value}
            onCheckedChange={handler.leftChecked}
          />
        </div>

        <div class="sa-transfer-direction-buttons">
          {
            btnTitles.value.map((t: string, index: number) => <SaButton
              size="mini"
              icon={handler.btnIcon(t, index)}
              onClick={() => handler.dirMove(index)}
            >{utils.hasBtnTitles(t) ? null : t}
            </SaButton>)
          }
        </div>

        <div>
          <SaTransferPanel
            v-model={state.rightChecked}
            type="right"
            filterable
            checkeds={props.rightDefaultChecked}
            title={titles.value[1]}
            isWithFooter={slots.rightFun.isExist()}
            data={rightFilterData.value}
            onCheckedChange={handler.rightChecked}
          />
        </div>
      </div>
    }
  }
})


export default SaTransfer