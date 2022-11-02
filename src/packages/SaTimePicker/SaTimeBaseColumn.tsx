import './time-base-column.scss'
import { delay } from "js-hodgepodge";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { EditProps, findOne, plainDateUtils, useEdit, useModel, useRefList, useRefs } from "src/hooks";
import { computed, onMounted, PropType } from "vue";
import SaScroll from "../SaScroll/SaScroll";
import { globalConfig } from "./SaTimePicker.utils";

export const SaTimeBaseColumn = designComponent({
  name: 'sa-time-base-column',

  props: {
    ...EditProps,

    modelValue: { required: true },
    max: { type: Number },
    min: { type: Number },
    layout: { type: String, default: 'h' },   // 模式，h：时，m：分，s：秒
    custom: { type: Function as PropType<(layout: string) => number[]> }, // 自定义选项函数

    checkDisabled: Function,                // 用来判断选项是否禁用的函数
    disableChangeOnScroll: { type: Boolean }, // 是否禁用在滚动的时候触发更新值动作
  },

  emits: {
    onUpdateModelValue: (val: number) => true,
    onClickItem: (i: number) => true
  },

  setup({ props, event: { emit } }) {

    const { editComputed } = useEdit()
    const { onRef, refs } = useRefs({
      scroll: SaScroll
    })
    const { refList: liList, onRefList } = useRefList<HTMLLIElement>()
    const model = useModel(() => props.modelValue as any, emit.onUpdateModelValue, { onChange: () => delay().then(methods.resetPosition) })

    /* ---------------------------------------- computed -------------------------------------*/

    const options = computed(() => {
      if (!!props.custom) {
        return props.custom(props.layout).map(c => plainDateUtils.zeroise(c, 2))
      }

      const count = props.layout == 'h' ? 24 : 60
      let options: string[] = []

      for (let i = 0; i < count; i++) {
        options.push(plainDateUtils.zeroise(i, 2))
      }

      return options

    })

    /* ---------------------------------------- method -------------------------------------- */
    const methods = {
      resetPosition: () => {
        let value = model.value || 0
        let start = 0
        let find = findOne(options.value, item => Number(item) == value, true) as { item: string, index: number }
        if (!!find.item) {
          start = find.index
          refs.scroll!.methods.scroll({ y: liList[start].offsetTop }, { noEmitScroll: true })
        }
      }
    }

    /* ----------------------------------------- handler ------------------------------------- */

    const handler = {
      onScroll: (e: any) => {
        if (props.disableChangeOnScroll) {
          return
        }

        let index = Math.max(0, Math.min(options.value.length - 1, Math.floor(e.target.scrollTop / globalConfig.size)))
        const val = options.value[index] == null ? null : Number(options.value[index])
        if (val != null && val !== model.value && !utils.checkDisabled(val)) {
          model.value = val
        }
      },

      clickItem: (item: string | number) => {
        item = Number(item)
        if (utils.checkDisabled(item)) {
          return
        }
        model.value = item
        emit.onClickItem(item)
        methods.resetPosition()
      }
    }


    /* ----------------------------------------- utils ------------------------------------- */

    const utils = {
      checkDisabled: (item: string | number) => {
        item = Number(item)
        if (editComputed.value.disabled) return true
        if (!!props.checkDisabled && props.checkDisabled(item, props.layout)) return true

        if (props.max != null && props.max < item) return true
        if (props.min != null && props.min > item) return true
        return false
      }
    }

    onMounted(methods.resetPosition)
    
    return {
      render: () => <div class="sa-time-base-column">
        <SaScroll ref={onRef.scroll} onScroll={handler.onScroll}>
          <ul class="sa-time-base-column-list">
            {[1, 2, 3].map((item, index) => (
              <li
                ref={val => liList[index] = val as any}
                class="sa-time-base-column-item"
                key={-item} />)
            )}

            {options.value.map((item, index) => (
              <li class={([
                'sa-time-base-column-item',
                'sa-time-base-column-option-item',
                {
                  'sa-time-base-column-item-current': model.value != null && model.value == Number(item),
                  'sa-time-base-column-item-disabled': utils.checkDisabled(item),
                }
              ])}
                key={item}
                onClick={() => handler.clickItem(item)}
                ref={onRefList(index + 3)}>
                {item}
              </li>
            ))}

            {[1, 2, 3].map(item => (<li class="sa-time-base-column-item" key={-item - 3} />))}
          </ul>
        </SaScroll>
      </div>
    }
  }
})


export default SaTimeBaseColumn