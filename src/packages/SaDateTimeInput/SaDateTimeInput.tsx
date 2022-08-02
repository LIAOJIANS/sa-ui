import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { EditProps, unit, useEdit, useModel, useNumber, useRefs, useStyles } from "src/hooks";
import { computed } from "vue";

export const SaDateTimeInput = designComponent({
  name: 'sa-data-time-input',

  props: {
    ...EditProps,
    width: { type: [String, Number], default: 138 },
    modelValue: { type: String },
    displayFormat: { type: String }
  },

  emits: {
    onUpdateModelValue: (val?: string) => true,
    onFocus: (e: FocusEvent) => true,
    onBlur: (e: FocusEvent) => true,
  },
  setup({ props, event: { emit } }) {

    const { onRef, refs } = useRefs({
      input: HTMLInputElement
    })

    const { editComputed } = useEdit()

    const { numberState } = useNumber(props, ['width'])

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue, { autoEmit: false })

    const styles = useStyles(style => { style.width = unit(numberState.width) })

    const regexp = computed(() => new RegExp('^' + props.displayFormat!.replace(/[a-zA-Z]/g, '\\d') + '$'))

    const methods = {
      focus: () => {
        !!refs.input && refs.input.focus()
      }
    }

    const handler = {
      input: (e: Event) => {
        model.value = (e as any).target.value
        if (!model.value || regexp.value.test(model.value)) {
          emit.onUpdateModelValue(model.value)
        }
      },
      blur: (e: FocusEvent) => {
        model.value = props.modelValue
        emit.onBlur(e)
      },
      focus: (e: FocusEvent) => {
        emit.onFocus(e)
      },
    }

    return {
      refer: {
        refs,
        methods,
      },
      render: () => (
        <input
          type="text"
          ref={onRef.input}
          class="sa-date-time-inner-input sa-input-custom-inner-input"
          style={styles.value}
          value={model.value || ''}
          placeholder={editComputed.value.placeholder || ''}
          onInput={handler.input}
          onBlur={handler.blur}
          onFocus={handler.focus}
          disabled={editComputed.value.disabled as any}
          readonly={editComputed.value.readonly as any}
        />
      )
    }
  }
})

export default SaDateTimeInput