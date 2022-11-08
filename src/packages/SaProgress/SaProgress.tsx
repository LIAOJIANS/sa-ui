import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, reactive } from "vue";
import { typeOf } from "js-hodgepodge";
import './SaProgress.scss'

import SaIcon from "../SaIcon/SaIcon";
import ProgressSvg from './ProgressSvg'
import { classname, StatusColor, unit, useRefs, useStyles } from "src/hooks";
import { onMounted } from "vue";
import { onBeforeUnmount } from "vue";
import { progressProps, ProgressType } from "./progress.utils";
import { StyleStatus } from "src/hooks/use/useStyle";

export const SaProgress = designComponent({
  name: 'SaProgress',

  props: {
    ...progressProps
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

        return props.contentFormat(props.percentage)
      }

      return null
    })

    const classes = computed(() => classname([
      'sa-progress',
      {
        'sa-progress-bar-line': props.type === ProgressType.Line,
        'sa-progress-bar-circle': props.type !== ProgressType.Line
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
        style.paddingRight = '50px'
        style.marginRight = '-50px'
      }
    })

    const barInnerStyles = useStyles(style => {
      style.width = `${methods.getPercentage()}%`
      style.height = `${props.width}px`

      style.transition = 'width 0.6s ease 0s'
      if (
        !!props.gradients &&
        props.gradients?.length > 1
      ) {
        const [first, end] = props.gradients
        style.background = `linear-gradient(to right, ${first}, ${end})`

      } else {
        style.background = !props.status && !props.color ? StatusColor.primary : props.color
      }
    })

    const circleStyles = useStyles(style => {
      style.width = unit(props.canvWidth)
      style.height = unit(props.canvWidth)
    })

    // const barAmintStyles = useStyles(style => {
    //   style.background = `radial-gradient(ellipse closest-side, rgba(255,255,255, .8), rgba(255,255,255, .1))`
    // })

    const methods = {
      getPercentage: () => props.percentage <= 0 ? 0 : props.percentage >= 100 ? 100 : props.percentage
    }

    onMounted(() => {

      if (props.type === ProgressType.Line && props.gradientsAnimation) {
        state.animaTimer = setInterval(() => {
          const left = refs.el?.offsetLeft || 0
          const barWidth = refs.bar?.clientWidth! + 3

          refs.el!.style.left = (barWidth === (left - 20) || barWidth < (left - 20)) ? `-40px` : `${left + 3}px`
        }, 30)
      }

    })

    onBeforeUnmount(() => state.animaTimer && clearInterval(state.animaTimer))

    return {
      render: () => {

        const content = (
          <div class={textClasses.value} style={{ fontSize: `${textFontSize.value}px` }}>
            {props.showText ? !!contentFormat.value ? (
              <div class="sa-progress-bar-content--format">
                <div class="sa-progress-bar-content--wrapper">
                  { contentFormat.value }
                </div>
              </div>
            ) : (
              !!props.status && props.status !== StyleStatus.primary ?
                <SaIcon icon={`el-icon-${props.status === 'warn' ? 'warning' : props.status}`} status={props.status} size={ textFontSize.value } /> : `${methods.getPercentage()}%`
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

                      {props.gradientsAnimation && (
                        <div class="sa-progress-bar-amint" ref={onRef.el}></div>
                      )}
                    </div>

                  </div>
                </div>

              ) : (
                <div class="sa-progress-circle" style={circleStyles.value}>
                  <ProgressSvg {
                    ...{
                      ...props,
                      percentage: methods.getPercentage()
                    }
                  } />
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