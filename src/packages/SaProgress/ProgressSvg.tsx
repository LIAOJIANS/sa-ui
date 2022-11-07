import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useStyles, StatusColor, unit } from "src/hooks";
import { computed, reactive } from "vue";
import { progressProps, ProgressType } from "./progress.utils";

export const ProgressSvg = designComponent({
  name: 'ProgressSvg',

  props: {
    ...progressProps
  },
  setup({ props }) {

    const innerRingStyles = useStyles(style => {
      style.strokeDasharray = `${perimeter.value * methods.rate() * (Number(props.percentage) / 100)}px, ${perimeter.value}px`

      style.strokeDashoffset = strokeDashoffset.value
      style.transition = 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s'

    })

    const outerRingStyles = useStyles(style => {
      style.strokeDasharray = `${unit(perimeter.value * methods.rate())}, ${unit(perimeter.value)}`
      style.strokeDashoffset = strokeDashoffset.value
    })

    const stroke = computed(() => {
      if (!props.color && !props.status) {
        return StatusColor.primary
      }

      return !!props.color ? props.color : StatusColor[props.status!]

    })

    const trackPath = computed(() => {
      const radius = methods.radius()
      const isDashboard = props.type === ProgressType.Dashboard

      return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
        `;
    })

    const perimeter = computed(() => 2 * Math.PI * methods.radius())

    const strokeDashoffset = computed(() => unit(-1 * perimeter.value * (1 - methods.rate()) / 2))

    const methods = {
      radius: () => (props.type === ProgressType.Circle || props.type === ProgressType.Dashboard) ? 50 - parseFloat(methods.relativeStrokeWidth()) : 0,
      relativeStrokeWidth: () => (Number(props.width) / Number(props.canvWidth) * 100).toFixed(1),
      rate: () => props.type === 'dashboard' ? 0.75 : 1
    }

    return {
      render: () => (
        <svg viewBox="0 0 100 100">
          <path
            d={trackPath.value}
            stroke="#e5e9f2"
            stroke-width={props.width}
            fill="none"
            style={outerRingStyles.value}
          />
          <path
            d={trackPath.value}
            stroke={stroke.value}
            fill="none"
            stroke-linecap="round"
            stroke-width={props.width}
            style={innerRingStyles.value}
          />
        </svg>
      )

    }
  }
})

export default ProgressSvg