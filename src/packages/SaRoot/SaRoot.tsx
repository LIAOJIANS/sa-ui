import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { delay, StyleProps, useRefList, useStyle } from "src/hooks";
import { markRaw, reactive, Teleport } from 'vue'
import './SaRoot.scss'
import { RootMapper } from "./utils/registryRootService";

export const SaRoot = designComponent({
  name: 'sa-root',
  slots: ['default'],
  provideRefer: true,
  props: {
    ...StyleProps
  },
  setup({ slots, ctx }) {

    useStyle()

    let { refList, onRefList } = useRefList()

    const state = reactive({
      managers: [] as {
        name: string,
        Component: { use: { class: any } },
        RenderComponent: any
      }[]
    })

    async function getManagerInstance<ManagerCompoonent extends { use: { class: any } }>(
      name: string,
      managerComponent: ManagerCompoonent
    ): Promise<ManagerCompoonent['use']['class']> {
      if (refList?.length > 0) {
        for (let i = 0; i < refList.length; i++) {
            const managerInstance = refList[i];
            if (!!managerInstance) {
                const {name: attrName, Component: attrComponent} = managerInstance.props
                if (name === attrName && managerComponent === attrComponent) {
                    return managerInstance as any
                }
            }
        }
    }

      state.managers.push({
        name,
        Component: managerComponent,
        RenderComponent: markRaw(managerComponent)
      })

      await delay(0)
      return getManagerInstance(name, managerComponent)
    }

    const refer = {
      getManagerInstance
    }

    
    RootMapper.set(ctx.proxy!.$root, refer)

    return {
      refer,
      render: () => <>
        {slots.default()}
      
        <Teleport to='body'>
          <div class="sa-root-service-container">
            {state.managers.map(({ name, Component, RenderComponent }, index) => (
              <RenderComponent
                key={index}
                {...{ name, Component }}
                ref={onRefList(index)}
              />
            ))}
          </div>
        </Teleport>
      </>
    }
  }
})

export type SaRootInstance = typeof SaRoot.use.class

export default SaRoot