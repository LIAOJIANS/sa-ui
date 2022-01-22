import { designComponent } from "src/advancedComponentionsApi/designComponent"
import { VueNode } from "src/advancedComponentionsApi/designComponent.utils"


export function createDefaultService<Option extends Record<string, any>, Refer extends {
  isShow: { value: boolean },
  isOpen: { value: boolean },
  service: (optoin: Option) => void
}>
  (
    {
      name,
      setup,
    }: {
      name: string,
      setup: (option: Option) => {
        refer: Refer,
        render: () => VueNode,
      },
    }
  ) {
  return designComponent({
    name: `sa-${name}-service`,
    props: {
      option: { type: Object, required: true }
    },
    setup({ props }) {
      const option = props.option as Option
      const { render, refer } = setup(option)
      refer.service(option)
      return {
        render, refer
      }
    },
  })
}
