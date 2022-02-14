import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { delay, useRefList } from "src/hooks";
import { ref } from "vue";

export function createDefaultManager<Option>(
  managerName: string,
  serviceComponent: {
    use: {
      class: {
        isShow: { value: Boolean },
        isOpen: { value: Boolean },
        service: (option: Option) => any
      }
    }
  },
  isItemAvailable?: (refs: typeof serviceComponent.use.class[], opt: Option) => null | typeof serviceComponent.use.class,
) {
  return designComponent({
    name: managerName,
    props: {
      name: { required: true },
      Component: { required: true }
    },
    setup({ props }) {

      const options = ref([] as Option[])
      const { refList, onRefList } = useRefList(serviceComponent)

      const service = async (option: Option): Promise<void> => {
        if (isItemAvailable) {
          const item = isItemAvailable(refList, option)

          if (!!item) {
            return item.service(option)
          }
        } else {
          for (let i = 0; i < refList.length; i++) {
            const { isOpen, isShow, service } = refList[i]

            if (!isOpen.value && !isShow.value) {
              return service(option)
            }
          }
        }

        options.value.push(option as any)

        await delay()
      }

      return {
        refer: {
          managerName,
          props,
          service
        },
        render: () => {
          const ServiceComponent = serviceComponent as any
          
          return <div class={managerName}>
            {options.value.map((opt, i) => <ServiceComponent
              key={i}
              option={opt}
              ref={onRefList(i)}
            />)}
          </div>
        }
      }
    }
  })
}