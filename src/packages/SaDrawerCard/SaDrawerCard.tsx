import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname } from "src/hooks";
import { computed, PropType, reactive, VNodeChild } from "vue";
import './SaDrawerCard.scss'
import SaIcon from '../SaIcon/SaIcon'

const SaDrawerCard = designComponent({
  name: 'sa-drawer-card',

  props: {
    mode: { type: String as PropType<'card' | 'none'>, default: 'none' },
    animation: { type: [Boolean, Object] },
    blockIcon: { type: String, default: 'el-icon-caret-bottom' },
    hiddenIcon: { type: String, default: 'el-icon-caret-top' },

    showContent: { type: Boolean },
    title: { type: String },
    prefixContent: { type: [String, Function] },
    suffixContent: { type: [String, Function] }
  },

  slots: ['default'],

  emits: {
    onClickBclokTitle: (showContent: boolean) => true
  },

  setup({ props, event: { emit } ,slots }) {

    // const state = reactive({
    //   showContent: false
    // })

    const classes = computed(() => classname([
      {
        'sa-drawer-card-animation': typeof props.animation === 'boolean' && props.animation,
      }
    ]))

    const handel = {
      onClickBclokTitle: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        emit.onClickBclokTitle(props.showContent)
      }
    }

    return {
      render: () => {
        const {
          showContent,
          hiddenIcon,
          blockIcon,
          prefixContent,
          animation,
          suffixContent
        } = props
        return (
          <div class={'sa-drawer-card ' + classes.value}>

            {
              slots.default.isExist() && (slots.default() as VNodeChild[]).map((dom: any) => {
                return (
                  <div>
                    {
                      dom.props?.slot === 'title' && <div class="sa-drawer-card-title">{dom}</div>
                    }
                    {
                      dom.props?.slot === 'content' && <div class="sa-drawer-card-content">{dom}</div>
                    }
                  </div>
                )
              })
            }

            <div class={ 'sa-drawer-card-block-control ' + `${  typeof props.animation === 'boolean' && props.animation && 'sa-drawer-card-block-control-animation' }`  } onClick={ handel.onClickBclokTitle }>
              {
                !!prefixContent && (
                  <div class="sa-drawer-card-prefix">
                    {
                      typeof prefixContent === 'function' ? prefixContent() : <span>{prefixContent}</span>
                    }

                  </div>
                )
              }

              <div class={ 'sa-drawer-card-block-title' }>
                <span><SaIcon icon={showContent ? hiddenIcon : blockIcon} color='#08979c' size={ 15 } /></span>
                <span class={ props.animation && 'opacity-none' }>{props.title}</span>
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