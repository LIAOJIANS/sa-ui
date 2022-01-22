// 建立root 跟 app的对应关系
import SaRoot, { SaRootInstance } from "./SaRoot"
import { App, createApp } from 'vue'
import { RootMapper } from "./utils/registryRootService";

export function createUseService<_,
  ManagerComponent extends { use: { class: { props: { name: any, Component: any } } } },
  CreateService extends (getManager: () => Promise<ManagerComponent["use"]["class"]>) => any
>({
  name,
  optionsCallName,
  managerComponent,
  createService
}: {
  name: string,
  optionsCallName: string,
  managerComponent: ManagerComponent,
  createService: CreateService,
}) {

  // 根据不同的root，做相对于的映射
  let map = new WeakMap<any, ReturnType<CreateService>>()

  const use = (getRoot?: () => SaRootInstance | Promise<SaRootInstance>): ReturnType<CreateService> => {
    let root: SaRootInstance;
    if (!getRoot) {
      root = SaRoot.use.inject()
      let service = map.get(root)
      if (!!service) { return service }
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
            return use(() => RootMapper.get(this.$root))
          }
        }
      })
    },
  })
}