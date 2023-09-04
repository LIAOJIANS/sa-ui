import { designComponent } from "src/advancedComponentionsApi/designComponent";

const SaTbody = designComponent({
  props: {
    layout: { type: Object }
  },

  slots: ['default'],
  setup({ props, slots }) {

    const methods = {
      toArray: (len: number) => new Array(len || 0).fill('')
    }

    return {
      render: () => (
        <tbody>
          {
            methods.toArray(props.layout?.trLen).map(() => (
              <tr>
                 { slots.default() }
              </tr>
            ))
          }
        </tbody>
      )
    }
  }
})

export default SaTbody