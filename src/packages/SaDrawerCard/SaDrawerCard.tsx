import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, unit, useStyles } from "src/hooks";
import { computed, PropType, reactive, VNodeChild } from "vue";
import './drawerCard.scss'
import SaIcon from '../SaIcon/SaIcon'

const SaDrawerCard = designComponent({
  name: 'sa-drawer-card',

  props: {
    mode: { type: String as PropType<'card' | 'none'>, default: 'none' },
    animation: { type: [Boolean, String] as PropType<'all' | 'content' | 'title'> },

    blockIcon: { type: String, default: 'el-icon-caret-bottom' },
    hiddenIcon: { type: String, default: 'el-icon-caret-top' },

    showContent: { type: Boolean },
    title: { type: String },
    prefixContent: { type: [String, Function] },
    suffixContent: { type: [String, Function] },

    contetHeight: { type: [Number, String], default: 375 },
    titleHeight: { type: [Number, String], default: 66 }
  },

  slots: ['default'],

  emits: {
    onClickBclokTitle: (showContent: boolean) => true
  },

  setup({ props, event: { emit }, slots }) {

    const classes = computed(() => classname([
      'sa-drawer-card',
      {
        'sa-drawer-card-animation-content': props.animation === 'content',
        'sa-drawer-card-animation':  (typeof props.animation === 'boolean' && props.animation) || (typeof props.animation === 'string' && props.animation === 'all'),
      }
    ]))

    const styles = useStyles(styles => {

      styles.height = unit(props.showContent ? props.contetHeight : '0')
      
      return styles
    })

    const publicProps = computed(() => ({
      style: styles.value
    } as any ))

    const handel = {
      onClickBclokTitle: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        emit.onClickBclokTitle(props.showContent)
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


        if(animation === 'content') {
          return 'sa-drawer-card-block-control-no-animation'
        }
      }
    }

    return {
      render: () => {
        const {
          showContent,
          hiddenIcon,
          blockIcon,
          prefixContent,
          suffixContent
        } = props
        return (
          <div class={classes.value}>

            {
              slots.default.isExist() && (slots.default() as VNodeChild[]).map((dom: any) => {
                return (
                  <div>
                    {
                      dom.props?.slot === 'title' && <div class="sa-drawer-card-title" style={{ minHeight: unit(props.titleHeight) as string }}>{dom}</div>
                    }
                    {
                      dom.props?.slot === 'content' && <div class="sa-drawer-card-content" { ...publicProps.value }>{dom}</div>
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
                <span><SaIcon icon={showContent ? hiddenIcon : blockIcon} color='#08979c' size={15} /></span>
                <span class={props.animation && 'opacity-none'}>{props.title}</span>
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