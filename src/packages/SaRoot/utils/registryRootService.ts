import { App } from "vue"
import { SaRoot, SaRootInstance } from "../SaRoot"



export const RootMapper = (() => {
  const get = (appRootInstance: any): SaRootInstance => {
    return appRootInstance._SA_ROOT
  }

  const set = (appRootInstance: any, rootInstance: SaRootInstance) => {
    
    if(!!appRootInstance._SA_ROOT) {
      return console.log('sa-root: 在一个app中只能使用一次', {newRoot: rootInstance, oldRoot: appRootInstance._SA_ROOT})
    }

    appRootInstance._SA_ROOT = rootInstance
  }

  return {
    get,
    set
  }
})()

export function createUseService<_, 
  ManagerComponent extends { use: { class: { props: { name: any, Component: any } } } },
  CreateService extends ( getManger: () => Promise<ManagerComponent['use']['class'] > ) => any>(
    {
      name,
      optionsCallName,
      managerComponent,
      createService
    }: {
      name: string,
      optionsCallName: string,
      managerComponent: ManagerComponent,
      createService: CreateService
    }
  ) {
    const map = new WeakMap<any, ReturnType<CreateService>>()

    const use = (getRoot?: () => SaRootInstance | Promise<SaRootInstance> ): ReturnType<CreateService> => {
      let root: SaRootInstance

      if(!getRoot) {
        root = SaRoot.use.inject()
        let service = map.get(root)

        if(!!service) {
          return service
        }

        service = createService(async () => root!.getManagerInstance(name, managerComponent))
        map.set(root, service!)

        return service!
      } else {
        return createService(async () => {
          const root = await getRoot()

          return root.getManagerInstance(name, managerComponent)
        })
      }
    }

    return Object.assign(use, {
      install(app: App) {
        app.mixin({
          computed: {
            [optionsCallName]() {
              return use(() => RootMapper.get(this.$rout))
            }
          }
        })
      }
    })
}

