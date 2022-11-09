import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaSlider.scss'

import { useModel, useStyles } from "src/hooks";
import SaTooltip from '../SaTooltip/SaTooltip'

export const SaSlider = designComponent({
  name: 'SaSlider',

  props: {
    modelValue: { type: [String, Number] },
    showTip: { type: Boolean, default: true }
  },

  emits: {
    onUpdataModelValue: (val?: any) => true
  },

  setup({ props, event: { emit } }) {

    const model = useModel(() => props.modelValue, emit.onUpdataModelValue)

    const innerBarStyles = useStyles(style => {
      style.width = `${model.value}%`
    })

    const buttonStyle = useStyles(style => {
      style.left = `${model.value}%`
    })

    const handle = {
      btnMouseLeave: () => {
        console.log('离开了');

        methods.removeListenWindowEvent()
      },

      btnMouseLeve: (e: MouseEvent) => {

      },

      btnTouchStart: (e: MouseEvent) => {
        e.stopPropagation()
        console.log('child', e);
        
        methods.addListenWindowEvent()
      }
    }

    const methods = {
      drogging: (e: MouseEvent) => {
        e.preventDefault()

        console.log(e);
        
      },

      addListenWindowEvent: () => {
        window.addEventListener('mousemove', methods.drogging)
      },

      removeListenWindowEvent: () => {
        window.removeEventListener('mousemove', methods.drogging)
      }
    }

    return {
      render: () => (
        <div class="sa-slider">
          <div class="sa-slider-bar sa-slider--hover">
            <div class="sa-slider-bar--wrapper sa-slider--hover" style={innerBarStyles.value}></div>
            <div 
              class="sa-slider-button" 
              style={buttonStyle.value} 
              onMousedown={ handle.btnTouchStart } 
              onMouseleave={ handle.btnMouseLeave }
              onMouseup={ handle.btnMouseLeve }
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