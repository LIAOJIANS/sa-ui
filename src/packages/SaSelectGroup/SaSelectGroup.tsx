import { designComponent } from "src/advancedComponentionsApi/designComponent"
import { computed } from "vue"
import { SaSelectPanel } from "../SaSelect/SaSelectPanel"
import SaSelectOption, { SelectOption } from "../SaSelectOption/SaSelectOption"
import { useCollect } from 'src/hooks'

export const SaSelectGroup = designComponent({
  name: 'sa-select-group',
  props: {
    label: { type: String },
  },
  slots: ['title', 'default'],
  setup({ props, slots }) {

    const options = (SelectGroupCollector as any).parent() as SelectOption[]
    const panel = SaSelectPanel.use.inject(null)
    const isShow = computed(() => !panel || options.filter((option) => !option.props.group).filter(o => panel.utils.isShow(o.props)).length > 0)

    return {
      render: () => {
        return (
          <>
            {isShow.value && (props.label || slots.title.isExist()) && (
              <SaSelectOption class="sa-select-group" group label="" val="">
                {slots.title(props.label)}
              </SaSelectOption>
            )}
            {slots.default()}
          </>
        )
      }
    }
  },
})

export const SelectGroupCollector = useCollect(() => ({
  parent: SaSelectGroup,
  child: SaSelectOption,
}))

export default SaSelectGroup
