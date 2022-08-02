import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './time-range-panel.scss'
import { TimePanelProps, TimePublicProps, TimeRangePanelType } from './SaTimePicker.utils'
import { computed, PropType } from "vue";
import { VueNode } from "src/advancedComponentionsApi/designComponent.utils";
import { useModel } from "src/hooks";
import { delay } from "js-hodgepodge";
import SaTimeBasePanel from './SaTimeBasePanel'
import SaTimeRangePanel from './SaTimeRangePanel'


export const SaTimePanel = designComponent({
  name: 'sa-time-panel',
  props: {
    ...TimePanelProps,
    foot: { type: Function as PropType<() => VueNode> },
  },

  emits: {
    onUpdateModelValue: (val: string | undefined, type: TimeRangePanelType) => true,
    onUpdateStart: (val?: string) => true,
    onUpdateEnd: (val?: string) => true,

    onMousedownBasePanel: (e: MouseEvent) => true,
    onMousedownStartPanel: (e: MouseEvent) => true,
    onMousedownEndPanel: (e: MouseEvent) => true,
  },

  setup({ props, event: { emit } }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue as any)
    const start = useModel(() => props.start, emit.onUpdateStart)
    const end = useModel(() => props.end, emit.onUpdateEnd)

    const handler = {
      onBaseChange: async (val?: string) => {
        await delay()
        model.value = val
      },

      onRangeChange: async (
        val: string | undefined,
        type: TimeRangePanelType
      ) => {
        await delay()
        if (TimeRangePanelType.start) {
          start.value = val
        } else if (TimeRangePanelType.end) {
          end.value = val
        }

        emit.onUpdateModelValue(val, type)
      }
    }

    const binding = computed(() => {
      const publicProps = Object.keys(TimePublicProps).reduce((ret: any, key) => {
        ret[key] = (props as any)[key]
        return ret
      }, {})
      return {
        base: {
          ...publicProps,
          modelValue: model.value,

          onChange: handler.onBaseChange,
          onMousedown: emit.onMousedownBasePanel,
        },
        range: {
          ...publicProps,
          start: start.value,
          end: end.value,
          onChange: handler.onRangeChange,
          onMousedownStartPanel: emit.onMousedownStartPanel,
          onMousedownEndPanel: emit.onMousedownEndPanel,
        }
      }
    })

    return {
      render: () => <>
        {
          props.range ? <SaTimeBasePanel class="sa-time-panel" {...binding.value.base} key="base" /> :
            <SaTimeRangePanel class="sa-time-panel" {...binding.value.range} key="range" />}

        {!!props.foot && <div class="sa-time-panel-foot" onMousedown={emit.onMousedownBasePanel}>
          {props.foot()}
        </div>}
      </>
    }
  }
})

export default SaTimePanel