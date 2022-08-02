import { computed, inject, reactive, provide, onBeforeUnmount } from 'vue'
import useFunctionWrapper from './useFunctionWrapper'

export const EDIT_PROVIDE = '@@EDIT_PROVIDE'

interface IEditProvideData {
  disabled: boolean | null,
  readonly: boolean | null,
  loading: boolean | null,
  placeholder: string | null,

  onBlur?: (...args: any[]) => void,
  onChange?: (...args: any[]) => void
}

export const EditProps = {
  disabled: {type: Boolean, default: null},
  readonly: {type: Boolean, default: null},
  loading: {type: Boolean, default: null},
  placeholder: {type: String, default: null},
  customReadonly: {type: Boolean, default: null},
}


export const useEdit = useFunctionWrapper(
  'edit',
  (ctx, option: { adjust?: (dtaa: IEditProvideData) => void | IEditProvideData } = {}) => {
    
    const parentEditComputed = inject(EDIT_PROVIDE, null) as null | { value: IEditProvideData }

    const editState = reactive({ loading: null as null | boolean })

    const editComputed = computed(() => {
      const {
        disabled,
        readonly,
        loading,
        placeholder
      } = ctx.props as any as IEditProvideData

      let data = { disabled, readonly, loading, placeholder }

      if( data.disabled == null) { data.disabled = !!parentEditComputed ? parentEditComputed.value.disabled : false }
      if( data.readonly == null) { data.readonly = !!parentEditComputed ? parentEditComputed.value.readonly : false }
      if( data.placeholder == null ) { data.placeholder = !!parentEditComputed ? parentEditComputed.value.placeholder : null }
      
      if(editState.loading == null) {
        data.loading = data.loading != null ? data.loading : ( !!parentEditComputed ? parentEditComputed.value.loading : false )
      } else {
        data.loading = editState.loading
      }

      if(!!option.adjust) { data = option.adjust(data) || data }

      return {
        ...data,
        editable: !data.disabled && !data.readonly && !data.loading
      }
    })

    provide(EDIT_PROVIDE, editComputed)

    const event = (ctx as any).event

    if (!!parentEditComputed) {
      if (!!parentEditComputed.value.onBlur && !!event && !!event.on.onBlur) {
          event.on.onBlur(parentEditComputed.value.onBlur)
          onBeforeUnmount(() => event.off.onBlur(parentEditComputed.value.onBlur!))
      }
      if (!!parentEditComputed.value.onChange && !!event && !!event.on.onChange) {
          event.on.onChange(parentEditComputed.value.onChange)
          onBeforeUnmount(() => event.off.onChange(parentEditComputed.value.onChange!))
      }
  }
    return {
      editState,
      editComputed
    }
  }
)