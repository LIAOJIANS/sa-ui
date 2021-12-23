import { designComponent } from "src/advancedComponentionsApi/designComponent";
import SaDropdown from "../SaDropdown/SaDropdown";


export const SaDropdownMenu = designComponent({
  name: 'sa-dropdown-menu',

  slots: ["default"],

  emits: { 
    onClickOption: (e: MouseEvent, val: string) => true
  },
  provideRefer: true,

  setup({ slots, event: { emit } }) {
    const dropdown = SaDropdown.use.inject()

    const handler = {
      
      clickOption: (e: MouseEvent, val: any) => {
        emit.onClickOption(e, val)
        dropdown.handler.clickDropdownOption(e)
      }
    }

    return {
      refer : {
        handler
      },
      render: slots.default
    }
  }
})

export default SaDropdownMenu