import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, unit, useModel, useStyle, useStyles } from "src/hooks";
import { computed, PropType, reactive, VNodeChild, watch } from "vue";
import './drawerCard.scss'
import SaIcon from '../SaIcon/SaIcon'

const SaDrawerCard = designComponent({
  name: 'sa-drawer-card',

  props: {
    modelValue: { type: Boolean },

    mode: { type: String as PropType<'card' | 'none'>, default: 'none' },
    animation: { type: [Boolean, String] as PropType<'all' | 'content' | 'title'> },

    blockIcon: { type: String, default: 'el-icon-caret-bottom' },
    hiddenIcon: { type: String, default: 'el-icon-caret-top' },
    title: { type: [String, Array] },
    prefixContent: { type: [String, Function] },
    suffixContent: { type: [String, Function] },
    width: { type: [String, Number] },

    contetHeight: { type: [Number, String], default: 375 },
    titleHeight: { type: [Number, String], default: 66 }
  },

  slots: ['default'],

  emits: {
    onClickBclokTitle: (showContent: boolean) => true,
    onUpdateModelValue: (val?: boolean) => true
  },

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue, { autoEmit: false, autoWatch: false })

    const classes = computed(() => classname([
      'sa-drawer-card',
      {
        'sa-drawer-card-animation-content': props.animation === 'content',
        'sa-drawer-card-animation': (typeof props.animation === 'boolean' && props.animation) || (typeof props.animation === 'string' && props.animation === 'all'),
      }
    ]))

    const contentstyles = useStyles(style => {
      style.maxHeight = unit(model.value ? props.contetHeight : '0')
      return style
    })

    const styles = useStyles(style => {
      if(!!props.width) {
        style.width = unit(props.width)
      }

      return style
    })

    const publicContentProps = computed(() => ({
      style: contentstyles.value
    } as any))

    const handel = {
      onClickBclokTitle: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        model.value = !model.value
        emit.onUpdateModelValue(model.value)
        emit.onClickBclokTitle(model.value)
      }
    }

    const methods = {
      blockControlAnimationClass: () => {
        const { animation } = props

        if (!animation) {
          return
        }

        const animationType = typeof animation

        if (
          animationType === 'boolean' ||
          (animationType === 'string' && ['all', 'title'].includes(animation as any as string))
        ) {
          return 'sa-drawer-card-block-control-animation'
        }


        if (animation === 'content') {
          return 'sa-drawer-card-block-control-no-animation'
        }
      },

      titleFormat: () => {
        if (!!props.title) {
          if (
            Array.isArray(props.title) &&
            props.title.length > 1
          ) {
            const [trueLable, falseLable] = props.title

            return model.value ? trueLable : falseLable
          } else {
            return props.title
          }
        } else {
          return ''
        }
      }
    }

    return {
      render: () => {
        const {
          hiddenIcon,
          blockIcon,
          prefixContent,
          suffixContent,
          title,
          animation
        } = props
        return (
          <div class={classes.value} style={{...styles.value}}>

            {
              slots.default.isExist() && (slots.default() as VNodeChild[]).map((dom: any) => {
                return (
                  <div>
                    {
                      dom.props?.slot === 'title' && <div class="sa-drawer-card-title" style={{ minHeight: unit(props.titleHeight) as string }}>{dom}</div>
                    }
                    {
                      dom.props?.slot === 'content' && (<div class="sa-drawer-card-content" {...publicContentProps.value}>
                        <div>{dom}</div>
                      </div>)
                    }
                  </div>
                )
              })
            }

            <div class={'sa-drawer-card-block-control ' + `${methods.blockControlAnimationClass()}`} onClick={handel.onClickBclokTitle}>
              {
                !!prefixContent && (
                  <div class="sa-drawer-card-prefix">
                    {
                      typeof prefixContent === 'function' ? prefixContent() : <span>{prefixContent}</span>
                    }

                  </div>
                )
              }

              <div class={'sa-drawer-card-block-title'}>
                <span><SaIcon icon={model.value ? hiddenIcon : blockIcon} color='#08979c' size={15} /></span>
                <span class={animation && 'opacity-none'}>{methods.titleFormat()}</span>
              </div>

              {
                !!suffixContent && (
                  <div class="sa-drawer-card-suffix">
                    {
                      typeof suffixContent === 'function' ? suffixContent() : <span>{suffixContent}</span>
                    }
                  </div>
                )
              }

            </div>
          </div>
        )
      }
    }
  }
})


export default SaDrawerCard