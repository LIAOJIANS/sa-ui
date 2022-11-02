import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTimeLineItem.scss'

import { computed, PropType, VNode } from "vue";
import { classname, StyleProps, useStyles } from "src/hooks";
import { dateFormat, typeOf } from "js-hodgepodge";
import SaIcon from '../SaIcon/SaIcon'

export const SaTimeLineItem = designComponent({

  name: 'SaTimeLineItem',

  props: {
    timestamp: { type: [String, Number], required: true },                                                                               // 时间戳
    hideTimestamp: { type: Boolean },                                                                                                    // 是否隐藏时间戳
    timestampFormat: { type: String },                                                                                                   // 时间戳格式
    placement: { type: String as PropType<'top' | 'bottom'>, default: 'top' },                                                           // 时间戳位置
    type: StyleProps.status,                                                                                                             // 节点类型
    size: { ...StyleProps.size, default: 'mini' },                                                                                       // 节点Size
    color: { type: String, default: '#455a64' },                                                                                         // 节点颜色
    icon: { type: [String, Function] as PropType<String | ((option: { color: string, iconSize: number | string }) => VNode)> },          // 自定义节点icon
    iconColor: { type: String, default: '#fff' }                                                                                         // 自定义icon颜色
  },

  slots: ['default'],

  setup({ props, slots }) {

    const timestampFormat = computed(() => {
      if (!props.timestampFormat) {
        return props.timestamp
      }

      if (props.timestampFormat === 'timestamp') {
        return new Date(props.timestamp)
      }
      
      return dateFormat(props.timestamp, props.timestampFormat)
    })

    const classes = computed(() => classname([
      'sa-timestamp-item-icon',
      {
        [`sa-timestamp-item-size-${props.size}`]: !!props.size
      }
    ]))

    const iconSize = computed(() => ({
      mini: 12,
      large: 16,
      normal: 14
    }[props.size]))

    const styles = useStyles(style => {
      style.backgroundColor = props.color
    })

    return {
      refer: {
        props
      },
      render: () => (
        <div class="sa-timestamp-item">
          <div class="sa-timestamp-item-dot" />
          <div class={classes.value} style={styles.value}>
            {props.icon && (
              typeof props.icon === 'function' ? props.icon({
                color: props.iconColor,
                iconSize: iconSize.value
              })
                : <SaIcon icon={props.icon} color={props.iconColor} size={iconSize.value} />
            )}
          </div>
          <div class="sa-timestamp-item-content">
            {props.placement === 'top' && <div class="sa-timestamp-item-time is-top">{timestampFormat.value}</div>}
            <div>{slots.default()}</div>
            {props.placement === 'bottom' && <div class="sa-timestamp-item-time is-bottom">{timestampFormat.value}</div>}
          </div>
        </div>
      )
    }
  }
})


export default SaTimeLineItem