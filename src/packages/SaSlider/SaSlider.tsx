import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaSlider.scss'

import { classname, useModel, useRefs, useStyles } from "src/hooks";
import SaTooltip from '../SaTooltip/SaTooltip'
import { computed } from "vue";

export const SaSlider = designComponent({
  name: 'SaSlider',

  props: {
    modelValue: { type: [String, Number], default: 0 },                   // 双向绑定值
    showTip: { type: Boolean, default: true },                            // 是否显示提示
    setp: { type: Number }                                                // 滑动固定区间
  },

  emits: {
    onUpdateModelValue: (val?: any) => true
  },

  setup({ props, event: { emit } }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const { onRef, refs } = useRefs({
      bar: HTMLDivElement
    })
    // const tooltip = SaTooltip.use.inject(null)

    const innerBarStyles = useStyles(style => {
      style.width = `${model.value}%`
    })

    const buttonStyle = useStyles(style => {
      style.left = `${model.value}%`
    })

    const stepMedian = computed(() => (Math.floor(100 / props.setp! / 2) ))

    const handle = {
      btnMouseLeave: () => {
      },

      btnMouseLeve: (e: MouseEvent) => {

        methods.removeListenWindowEvent()
      },

      btnTouchStart: (e: MouseEvent) => {
        e.stopPropagation()

        methods.addListenWindowEvent()
      }
    }

    const methods = {
      drogging: (e: MouseEvent) => {
        e.preventDefault()

        const pageX = e.pageX - refs.bar?.offsetLeft!
        const barWidth = refs.bar?.offsetWidth!

        const val = Math.floor((pageX / barWidth) * 100)

        model.value = val >= 100 ? 100 : val <= 0 ? 0 : (
          !!props.setp ? val % props.setp > stepMedian.value ? Math.ceil(val / 10) * 10 :  Math.floor(val / 10) * 10 : val
        )
      },

      addListenWindowEvent: () => {
        window.addEventListener('mousemove', methods.drogging)
        window.addEventListener('mouseup', handle.btnMouseLeve)
      },

      removeListenWindowEvent: () => {
        window.removeEventListener('mousemove', methods.drogging)
        window.removeEventListener('mouseup', handle.btnMouseLeve)
      }
    }

    return {
      render: () => (
        <div class="sa-slider">
          <div class="sa-slider-bar sa-slider--hover" ref={onRef.bar}>
            <div class="sa-slider-bar--wrapper sa-slider--hover" style={innerBarStyles.value}></div>
            {
              !!props.setp &&
              new Array(props.setp)
                .fill('')
                .map((c, i) => {
                  const step = Math.floor(100 / props.setp!) * i
                  return step > model.value ? <div key={i} class='sa-slider-stop' style={{ left: `${step}%` }}></div> : null
                })
            }
            <div
              class="sa-slider-button"
              style={buttonStyle.value}
              onMousedown={handle.btnTouchStart}
              // onMouseleave={ handle.btnMouseLeave }
              onMouseup={handle.btnMouseLeve}
            >
              {
                props.showTip ? (
                  <SaTooltip
                    tooltip={`${model.value}`}
                  >
                    <div class="sa-slider-button--wrapper" />
                  </SaTooltip>
                ) : <div class="sa-slider-button--wrapper" />
              }
            </div>
          </div>
        </div>
      )
    }
  }
})

export default SaSlider