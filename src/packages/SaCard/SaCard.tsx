import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, PropType } from "vue";
import './SaCard.scss'

import { classname, unit, useRefs, useStyles } from "src/hooks";

const SaCard = designComponent({

  name: 'SaCard',

  props: {
    width: { type: [Number, String], default: '300' },
    noPadding: { type: Boolean },
    mini: { type: Boolean },
    pointer: { type: Boolean },
    shadow: { type: String as PropType<'normal' | 'hover'> },
    title: { type: String },
  },

  slots: [
    'head',
    'desc',
    'default',
    'operator',
    'poster',
    'foot',
  ],

  setup({ props, slots }) {

    const classes = computed(() => classname([
      'sa-card',
      {
        'sa-card-mini': props.mini,
        'sa-card-no-padding': props.noPadding,
        'sa-card-pointer': props.pointer,
        [`sa-card-shadow-${props.shadow}`]: !!props.shadow,
      }
    ]))

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })

    const styles = useStyles(style => {
      !!props.width && (style.width = unit(props.width))
    })

    return {
      refer: {
        refs
      },
      render: () => (
        <div class={classes.value} style={styles.value} ref={onRef.el}>
          {slots.poster.isExist() && <div class="sa-card-poster">
            {slots.poster()}
          </div>}
          {(props.title || slots.head.isExist() || slots.desc.isExist() || slots.operator.isExist()) && (
            <div class="sa-card-head">
              <div class="sa-card-head-content">
                {(props.title || slots.head.isExist()) && <div class="sa-card-title">
                  {slots.head(props.title)}
                </div>}
                {(slots.desc.isExist()) && <div class="sa-card-desc">
                  {slots.desc()}
                </div>}
              </div>
              {slots.operator.isExist() && <div class="sa-card-head-operator">
                {slots.operator()}
              </div>}
            </div>
          )}
          {slots.default.isExist() && <div class="sa-card-content">
            {slots.default()}
          </div>}
          {slots.foot.isExist() && <div class="sa-card-foot">
            {slots.foot()}
          </div>}
        </div>
      )
    }
  }
})


export default SaCard