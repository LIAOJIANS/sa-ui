import { classname } from "sa-ui@hooks";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed } from "vue";
import { SaTabsCollect } from '../SaTabs/SaTabs'

export const SaTabPane = designComponent({
  name: 'sa-tabpane',

  props: {
    paneKey: { type: [String, Number] },
    label: { type: String }
  },

  slots: ['default'],

  setup({ props, slots }) {

    const parent = SaTabsCollect.child()

    const isCur = computed(() => parent.model.value === props.paneKey)

    const classes = computed(() => classname([
      'sa-tabs-pane',
      {
        'sa-tabs-pane__active': isCur.value
      }
    ]))

    const handler = {
      handleClickPane: () => {
      
        parent.handler.handleActive(props.paneKey)
      }
    }

    return {
      render: () => (
        <div class={ classes.value } onClick={ handler.handleClickPane } data-pane={ props.paneKey }>
          { props.label }
        </div>
      )
    }
  }
})


export default SaTabPane