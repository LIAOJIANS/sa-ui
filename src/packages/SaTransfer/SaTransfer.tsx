import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, PropType, reactive } from "vue";
import './SaTransfer.scss'
import SaTransferInner from "../SaTransferInner/SaTransferInner";
import SaButton from "../SaButton/SaButton";

export type TransferData = {
  key: string | number,
  label: string,
  disabled: boolean
}

export const SaTransfer = designComponent({
  name: 'sa-transfer',

  props: {
    btnTexts: { type: Array as PropType<string[]> },
    titles: { type: Array },
    leftDefaultChecked: { type: Array },
    rightDefaultChecked: { type: Array },
    data: { type: Array as PropType<TransferData[]> }
  },

  slots: ['leftFun', 'rightFun', 'content'],

  setup({ props, slots }) {

    const state = reactive({
      btnIcons:  ['el-icon-arrow-left', 'el-icon-arrow-right']
    })

    const btnTitles = computed(() => {
      return props.btnTexts && props.btnTexts.length > 1 ? props.btnTexts : state.btnIcons
    }) 

    const handler = {
      btnIcon(tit: string, index: number) {
        if(utils.hasBtnTitles(tit)) {
          return tit
        }
        return state.btnIcons[index]
      }
    }

    const utils = {
      hasBtnTitles: (tit: string) => state.btnIcons.indexOf(tit) > -1
    }

    return {
      render: () => <div>
        <div>
          <SaTransferInner />
        </div>

        <div class="sa-transfer-direction-button">
          {
            btnTitles.value.map((t, index) => <SaButton icon={ handler.btnIcon(t, index) }>{ utils.hasBtnTitles(t) ? null : t }</SaButton>)
          }
        </div>

        <div>
          <SaTransferInner />
        </div>
      </div>
    }
  }
})


export default SaTransfer