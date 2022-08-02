import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './time-picker.scss'
import { EditProps, StyleProps, plainDate, useModel, delay, useEditPopperAgent, unit } from "src/hooks";
import { computed, PropType } from "vue";
import { TimePanelProps, TimeRangePanelType } from "./SaTimePicker.utils";
import SaPopper from '../SaPopper/SaPopper'
import SaInput from "../SaInput/SaInput";
import { useDateTime } from '../SaDateTimeInput/useDate'
import SaDateTimeInput from '../SaDateTimeInput/SaDateTimeInput'
import { useTime } from './useTime'

export const SaTimePicker = designComponent({

  name: 'sa-time-picker',

  props: {
    ...StyleProps,
    ...EditProps,
    ...TimePanelProps,
    popperAttrs: { type: Object as PropType<Partial<typeof SaPopper.use.props>> },
  },

  emits: {
    onUpdateModelValue: (val?: string) => true,
    onUpdateStart: (val?: string) => true,
    onUpdateEnd: (val?: string) => true,
    onBlur: (e: FocusEvent) => true,
    onFocus: (e: FocusEvent) => true,
  },

  slots: ['foot'],
  expose: { plainDate },
  inheritPropsType: SaInput,
  setup({ props, event: { emit }, slots, attrs }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const startModel = useModel(() => props.start, emit.onUpdateStart)
    const endModel = useModel(() => props.end, emit.onUpdateEnd)

    const today = plainDate.today(props.displayFormat, props.valueFormat)

    const formatData = computed(() => ({
      value: !model.value ? null : plainDate(model.value, props),
      start: !startModel.value ? null : plainDate(startModel.value, props),
      end: !endModel.value ? null : plainDate(endModel.value, props),
    }))

    const maxmin = computed(() => {
      return {
        max: !props.max ? null : plainDate(props.max, props),
        min: !props.min ? null : plainDate(props.min, props),
      }
    })

    const serviceHandler = {
      onChange: (
        val: string | undefined,
        type?: TimeRangePanelType
      ) => {
        if (!props.range) {
          model.value = val
        } else {
          if (type === TimeRangePanelType.start) {
            startModel.value = val
          } else {
            endModel.value = val
          }
        }
      },

      onMousedownBasePanel: async () => {
        agentState.state.focusCounter++
        await delay(0)
        refs.valueInput!.methods.focus()
      },

      onMousedownStartPanel: async () => {
        agentState.state.focusCounter++
        await delay(0)
        refs.startInput!.methods.focus()
      },

      onMousedownEndPanel: async () => {
        agentState.state.focusCounter++
        await delay(0)
        refs.endInput!.methods.focus()
      }
    }

    const agentState = useEditPopperAgent({
      event: { emit },
      serviceGetter: useTime,
      option: {
        reference: () => refs.saInput?.refs.input,
        popperAttrs: props.popperAttrs as any,
        renderAttrs: () => ({
          ...(Object.keys(TimePanelProps).reduce((ret: any, key) => {
            ret[key] = (props as any)[key]
            return ret
          }, {})),
          modelValue: model.value,
          start: startModel.value,
          end: endModel.value,
          ...serviceHandler,
          foot: slots.foot.isExist() ? slots.foot : undefined,
        })
      }
    })

    const {
      refs,
      handler,
      inputValue,
      onRef,
    } = useDateTime({
      value: model,
      start: startModel,
      end: endModel,
      props,
      agentState,
      emit,
    })

    const customHandler = {
      change: (
        val: string | undefined,
        type: 'start' | 'end' | 'value'
      ) => {
        const jdView = 'Hms'
        let { start: spd, end: epd } = formatData.value
        if (!val) {
          if (type === 'value') { model.value = undefined }
          return
        }

        let pd = today.useDisplay(val)

        if (!pd.getDayJs().isValid()) { // 判断格式
          return
        }

        const { max, min } = maxmin.value
        if (!!max && max[jdView] < pd[jdView]) pd = max
        if (!!min && min[jdView] > pd[jdView]) pd = min

        switch (type) {
          case 'value':
            model.value = pd.getValue()
            break
          case 'start':
            startModel.value = pd.getDisplay()
            if (!epd || (pd[jdView] > epd[jdView])) { endModel.value = startModel.value }
            break
          case 'end':
            endModel.value = pd.getDisplay()
            if (!spd || (pd[jdView] < spd[jdView])) { startModel.value = endModel.value }
            break
        }
      }
    }

    return {
      render: () => (
        <SaInput
          ref={ onRef.saInput }
          class="sa-time pl-input-custom"
          modelValue={inputValue.value}
          placeholder={props.placeholder}
          suffixIcon="el-icon-time"
          clearIcon
          isFocus={agentState.state.focusCounter > 0}
          width={attrs.width != null ? unit(attrs.width) : null as any}
          inputInnerTabindex={null as any}
          clearHandler={handler.clearHandler}
          onClickInput={handler.clickInput}
          onKeydown={handler.keydown}
        >
          <div class="sa-input-custom-inner" {...{ range: String(props.range) }}>
            { props.range ? (
              <SaDateTimeInput 
                ref={onRef.valueInput}
                modelValue={!formatData.value.value ? undefined : formatData.value.value.getDisplay()}
                displayFormat={props.displayFormat}
                onChange={(val: string | undefined) => customHandler.change(val, 'value')}
                onFocus={handler.customInputFocus}
                onBlur={handler.customInputBlur}
              />
            ) : (
              <>
                <SaDateTimeInput 
                  modelValue={!formatData.value.start ? undefined : formatData.value.start.getDisplay()}
                  displayFormat={props.displayFormat}
                  onChange={(val: string | undefined) => customHandler.change(val, 'start')}
                  onFocus={handler.customInputFocus}
                  onBlur={handler.customInputBlur}
                />
                <span> ~ </span>
                <SaDateTimeInput 
                  ref={onRef.endInput}
                  width="100"
                  modelValue={!formatData.value.end ? undefined : formatData.value.end.getDisplay()}
                  displayFormat={props.displayFormat}
                  onChange={(val: string | undefined) => customHandler.change(val, 'end')}
                  onFocus={handler.customInputFocus}
                  onBlur={handler.customInputBlur}
                />
              </>
            )  }
          </div>
        </SaInput>
      )
    }
  }
})

export default SaTimePicker
