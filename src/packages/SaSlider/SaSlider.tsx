import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaSlider.scss'

import { classname, useModel, useRefs, useStyles } from "src/hooks";
import SaTooltip from '../SaTooltip/SaTooltip'
import { computed } from "vue";
import { typeOf } from "js-hodgepodge";

export const SaSlider = designComponent({
  name: 'SaSlider',

  props: {
    modelValue: { type: [String, Number], default: 0 },                   // 双向绑定值
    showTip: { type: Boolean, default: true },                            // 是否显示提示
    setp: { type: Number },                                               // 滑动固定区间
    range: { type: Boolean },                                             // 是否开启区间范围
    max: { type: Number, default: 100 },                                  // 范围最大值
    min: { type: Number, default: 0 },                                    // 范围最小值
    disabled: { type: Boolean, default: false },                          // 是否禁用
    marks: { type: Object }                                               // 接收自定义提示，key是值，value是一个返回元素
  },

  emits: {
    onUpdateModelValue: (val?: any) => true,
    onChange: (opt: { max: number, min: number, value: number }) => true
  },

  setup({ props, event: { emit } }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const { onRef, refs } = useRefs({
      bar: HTMLDivElement
    })
    // const tooltip = SaTooltip.use.inject(null)

    const innerBarStyles = useStyles(style => {
      style.width = `${Number(model.value) * 100 / props.max}%`
      
      if (props.disabled) {
        style.background = '#36cfc9'
      }
    })

    const buttonStyle = useStyles(style => {
      style.left = `${Number(model.value) * 100 / props.max}%`
    })

    const buttonClasses = computed(() => classname([
      'sa-slider-button',
      {
        ['sa-slider-button__disabled']: props.disabled
      }
    ]))

    const stepMedian = computed(() => (Math.floor(100 / props.setp! / 2)))

    const handle = {
      barClick: (e: MouseEvent) => methods.drogging(e),

      btnMouseLeve: (e: MouseEvent) => {

        methods.removeListenWindowEvent()
      },

      btnTouchStart: (e: MouseEvent) => {
        e.stopPropagation()

        if (!props.disabled) {
          methods.addListenWindowEvent()
        }
      }
    }

    const methods = {
      drogging: (e: MouseEvent) => {
        e.preventDefault()

        const pageX = e.pageX - refs.bar?.offsetLeft!
        const barWidth = (refs.bar?.offsetWidth!)

        const val = Math.floor((pageX / barWidth) * props.max)

        model.value = val >= props.max ? props.max : val <= props.min ? props.min : (
          !!props.setp ? val % props.setp > stepMedian.value ? Math.ceil(val / 10) * 10 : Math.floor(val / 10) * 10 : val
        )

        emit.onChange({
          max: props.max,
          min: props.min,
          value: model.value
        })
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
          <div class="sa-slider-bar sa-slider--hover" ref={onRef.bar} onClick={ handle.barClick }>
            <div class="sa-slider-bar--wrapper sa-slider--hover" style={innerBarStyles.value}></div>
            {
              !!props.setp &&
              new Array(props.setp)
                .fill('')
                .map((c, i) => {
                  const step = Math.floor(props.max / props.setp!) * i
                  return step > model.value ? <div key={i} class='sa-slider-stop' style={{ left: `${step}%` }}></div> : null
                })
            }
            <div
              class={buttonClasses.value}
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

            {
              !!props.marks && Object
                .entries(props.marks)
                .map(([k, c]) => (
                  <div class="sa-slider-tip" style={{ left: `${Number(k) * 100 / props.max}%` }}>
                    { typeOf(c) === 'function' && c() }
                  </div>
                ))
            }
          </div>
        </div>
      )
    }
  }
})

export default SaSlider