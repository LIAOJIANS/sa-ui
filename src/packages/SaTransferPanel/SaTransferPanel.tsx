import { computed, PropType, onMounted, watch } from "vue";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, useModel, useRefs } from "src/hooks";
import SaTransfer, { TransferData } from "../SaTransfer/SaTransfer";
import SaCheckboxGroup from '../SaCheckboxGroup/SaCheckboxGroup'
import SaCheckbox from '../SaCheckbox/SaCheckbox'
import SaScroll from "../SaScroll/SaScroll";
import SaInput from '../SaInput/SaInput'

export const SaTransferPanel = designComponent({

  name: 'sa-transfer-panel',

  props: {
    modelValue: { type: Array as PropType<string[]>, defalut: [] },
    isWithFooter: { type: Boolean },
    title: { type: String },
    type: { type: String as PropType<'left' | 'right'>, required: true },
    data: { type: Array as PropType<TransferData[]>, defalut: [], required: true },
    checkeds: { type: Array as PropType<string[]>, defalut: []  }
  },

  emits: {
    onCheckedChange: ( keys: any ) => true,
    onUpdateModelValue: (val?:any) => true
  },

  setup({ props, event: { emit } }) {

    const { refs, onRef } = useRefs({ scroll: SaScroll })

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const transfer = SaTransfer.use.inject(null)!
    
    const panelBodyClasses = computed(() => classname([
      'sa-transfer-panel__body',
      {
        'is-with-footer': props.isWithFooter
      }
    ]))

    const checkedForAll = computed(() => `${ model.value!.length }/${ props.data.length }`)

    const utils = {
      onCheckChange: (keys: string[]) => {
        // console.log(keys);
        
        emit.onCheckedChange(keys)
      }
    }

    const handler = {
      filters: ({ val }: { val: string }) => transfer.handler.filterData({ val, type: props.type }),

      filterReduction: () => transfer.handler.filterData({ val: '', type: props.type })
    }

    onMounted(() => {
      model.value = !!props.checkeds ?  props.checkeds : []
    })

    watch(() => model.value, val => {
      // console.log('内部', model.value);
      
      utils.onCheckChange(val!)
    })


    return {

      refer: {
        refs
      },
      render: () => <div class="sa-transfer-panel">
        <SaCheckboxGroup v-model={ model.value} >
          <p class="sa-transfer-panel__header">
            <SaCheckbox
              checkboxForAll
              label={props.title}
            />
            <span class="sa-transfer-panel-checked_size">{ checkedForAll.value }</span>
          </p>
          <div class={panelBodyClasses.value}>

            {
              transfer.props.filterable && <SaInput
                class="sa-transfer-panel__filter"
                clearIcon
                onInputChange={ handler.filters }
                onClickClearIcon={ handler.filterReduction }
              />
            }

            <div class='sa-transfer-panel__scroll'>
              <SaScroll fitHostWidth ref={onRef.scroll}>
                <div class="sa-transfer-panel__list" >
                  {
                  !!props.data && props.data.length > 0 ? 
                  props.data.map((c, i) => <div class="sa-transfer-panel-checked_item"><SaCheckbox label={c.label} value={c.key} key={i} disabled={ c.disabled } /></div>)
                  : <p class="sa-transfer-panel__noData">{ transfer.utils.filterText(props.type) ? transfer.props.noMatchText : transfer.props.noDataText }</p>
                  }
                </div>
              </SaScroll>
            </div>

            
          </div>
          {
            // @ts-ignore
            props.isWithFooter && <p class="sa-transfer-panel__footer">{transfer.slots[`${props.type!}Fun`]()}</p>
          }
        </SaCheckboxGroup>
      </div>
    }
  }
})

export default SaTransferPanel