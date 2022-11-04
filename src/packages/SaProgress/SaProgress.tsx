import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, reactive } from "vue";
import { typeOf } from "js-hodgepodge";
import './SaProgress.scss'

import SaIcon from "../SaIcon/SaIcon";
import ProgressSvg from './ProgressSvg'
import { classname, StyleProps, useRefs, useStyles } from "src/hooks";
import { onMounted } from "vue";
import { onDeactivated } from "vue";
import { onBeforeUnmount } from "vue";

enum ProgressType {
  Line = 'line',  // 直线条
  Circle = 'circle', // 原型
  Dashboard = 'dashboard'  // 仪表板
}

export const SaProgress = designComponent({
  name: 'SaProgress',

  props: {
    percentage: { type: [Number, String], default: 0 },           // 百分比
    type: { type: String, default: ProgressType.Line },           // 进度条类型
    width: { type: [String, Number], default: 4.8 },              // 进度条的宽度，单位 px
    textInside: { type: Boolean },                                // 进度条显示文字内置在进度条内（只在 type=line 时可用）
    status: StyleProps.status,                                    // 进度条状态
    color: { type: String },                                      // 进度条背景颜色
    gradients: { type: Array },                                    // 渐变色  ---- 只作用于line
    gradientsAnimation: { type: Boolean },                        // 是否启用渐变动画  ---- 只作用于line
    contentFormat: { type: Function },                            // 自定义进度条内容  
    showText: { type: Boolean, default: true },                   // 是否显示进度条文字
    canvWidth: { type: [Number, String], default: 126 }           // 容器大小
  },

  setup({ props }) {
    const { refs, onRef } = useRefs({
      el: HTMLDivElement,
      bar: HTMLDivElement
    })

    let state = reactive({
      animaTimer: null
    } as {
      animaTimer: any
    })

    const contentFormat = computed(() => {
      if (!!props.contentFormat) {
        if (typeOf(props.contentFormat) !== 'function') {
          console.error('contentFormat must be a function ！')
        }

        return props.contentFormat
      }

      return () => null
    })

    const classes = computed(() => classname([
      'sa-progress',
      {
        'sa-progress-bar-line': props.type === ProgressType.Line
      }
    ]))

    const textClasses = computed(() => classname([{
      'sa-progress-text': !props.textInside,
      'sa-progress-innertext': props.textInside,
      'sa-progress-circletext': props.type !== ProgressType.Line
    }]))

    const barInnerClasses = computed(() => classname([
      'sa-progress-bar-inner',
      {
        [`sa-progress-bar-inner-status-${props.status}`]: !!props.status
      }
    ]))

    const textFontSize = computed(() => props.type === ProgressType.Line ? 12 + Number(props.width) * 0.4 : Number(props.canvWidth) * 0.111111 + 2)

    const barOuterStyles = useStyles(style => {
      style.height = `${props.width}px`
    })

    const barStyles = useStyles(style => {
      if (props.showText) {
        style.paddingRight = '30px'
        style.marginRight = '-30px'
      }
    })

    const barInnerStyles = useStyles(style => {
      style.width = `${props.percentage}%`
      style.height = `${props.width}px`

      if (
        !!props.gradients &&
        props.gradients?.length > 1
      ) {
        const [first, end] = props.gradients
        style.background = `linear-gradient(to right, ${first}, ${end})`

      } else {
        style.background = !props.status && !props.color ? '#3C64A0' : props.color
      }
    })

    onMounted(() => {
      state.animaTimer = setInterval(() => {
        const left = refs.el?.offsetLeft || 0
        const barWidth = refs.bar?.clientWidth! + 3
        
        refs.el!.style.left = (barWidth === (left - 20) || barWidth < (left - 20)) ? `-40px` : `${left + 3}px`
      }, 30)
    })

    onBeforeUnmount(() => clearInterval(state.animaTimer))

    return {
      render: () => {

        const content = (
          <div class={textClasses.value} style={{ fontSize: `${textFontSize.value}px` }}>
            {props.showText ? !!contentFormat.value() ? contentFormat.value() : (
              !!props.status ? <SaIcon icon={`el-icon-${props.status}`} status={props.status} /> : `${props.percentage || 0}%`
            ) : null}
          </div>
        )

        return (
          <div class={classes.value}>
            {
              props.type === ProgressType.Line ? (
                <div class="sa-progress-bar" style={barStyles.value}>
                  <div class="sa-progress-bar-outer" style={barOuterStyles.value}>
                    <div class={barInnerClasses.value} style={barInnerStyles.value} ref={onRef.bar}>
                      {props.textInside && content}

                      {props.gradientsAnimation && !!props.gradients && props.gradients?.length > 1 && (
                      <div class="sa-progress-bar-amint" ref={onRef.el}></div>
                    )}
                    </div>
                    
                  </div>
                </div>

              ) : (
                <div class="sa-progress-circle">
                  <ProgressSvg
                    percentage={props.percentage}
                    color={props.color}
                    width={props.width}
                  />
                </div>
              )
            }
            {
              (
                (
                  props.type === ProgressType.Line &&
                  !props.textInside
                ) || props.type !== ProgressType.Line
              ) && content
            }

          </div>
        )
      }
    }
  }
})

export default SaProgress