import {
  ExtractPropTypes,
  ComponentPropsOptions,
  defineComponent,
  SetupContext,
  getCurrentInstance
} from "vue";

export function designComponent<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  Props extends Readonly<ExtractPropTypes<PropsOptions>>,
  Refer
>(options: {
  name?: string,
  props?: Props,
  setup?: (props: Props, ctx: SetupContext) => {
    refer?: Refer
    render: () => any
  }
}) {
  const { setup, ...leftOptions } = options

  return {
    ...defineComponent({
      ...leftOptions,
      setup(props: Props, ctx: SetupContext) {
        const setupContext = getCurrentInstance() as any

        if (!setup) {
          console.error('designComponent: setup is require')

          return () => null
        }

        const { refer, render } = setup(props, ctx)
        
        setupContext._refer = refer

        return render
      }
    } as any),

    use: {
      ref: (refName: string) => {
        const ctx = (getCurrentInstance() as any).ctx
        
        return {
          get value() {
            return ((ctx as any).$refs[refName].$._refer) as Refer | null
          }
        }
      }
    }
  }

}