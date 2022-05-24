import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, EditProps, StyleProps, unit, useCollect, useEdit, useNumber, useStyle, useStyles, removeUnit } from "src/hooks";
import './SaForm.scss'
import { computed, PropType, reactive, watch } from 'vue'
import { FormAssociateFields, FormPropRules, FormValidateError, FormValidateTrigger, getFormRuleData } from "./form.validata";
import SaFormItem from "../SaFormItem/SaFormItem";
import SaLoadingMask from "../SaLoadingMask/SaLoadingMask";
import { useMessage } from "../SaMessage";
import { debounce } from "../SaPopper/popperUtils/popperUtils";

export enum FormLabelSite {
  left = 'left',
  center = 'center',
  right = 'right',
}

export const SaForm = designComponent({

  name: 'sa-form',

  props: {
    ...StyleProps,
    ...EditProps,

    model: { type: Object },                                             // from 绑定的值
    rules: { type: Object as PropType<FormPropRules> },                  // from 规则校验
    disabledProps: { type: Object as PropType<Record<string, boolean>> },  // 禁用字段
    readonlyProps: { type: Object as PropType<Record<string, boolean>> },  // 禁用字段
    width: { type: [Number, String] },                                     // form 表单宽度
    columnGutter: { type: [Number, String], default: 16 },                 // 列之间的间距
    labelWidth: { type: [String, Number] },                              // label 宽度
    labelSite: { type: String as PropType<FormLabelSite>, default: FormLabelSite.right }, // label位置
    contentWidth: { type: [String, Number] },                              // 内容宽度
    column: { type: [String, Number], default: 1 },                       // 多列表单的列数
    verticalLabel: { type: Boolean },                                     // 纵向的表单
    colon: { type: Boolean, default: true },                              // label的冒号
    requiredMessage: { type: String, default: '必填' },                  // 默认错误提示

    associateFields: { type: Object as PropType<FormAssociateFields> },    // 校验关联字段
  },

  slots: ['default'],

  emits: {
    onFieldValueChange: (field: string, newVal: any, oldVal: any) => true,
  },

  setup({ props, slots, event: { emit } }) {

    useStyle()  // 初始化样式

    useEdit({ adjust: data => { data.loading = false } })

    const { numberState } = useNumber(props, ['column', 'labelWidth'])

    const classes = computed(() => classname([
      'sa-form',
      `sa-form-column-${numberState.column}`,
      {
        'sa-form-vertical-label': props.verticalLabel,
      }
    ]))

    const styles = useStyles(style => {
      if (props.column !== 1) {
        style.width = `calc(${unit(props.width)} + ${unit(props.columnGutter)})`
        style.marginLeft = `-${Number(removeUnit(props.columnGutter)) / 2}px`
      }
    })

    const formItem = FormCollector.parent(true) as { value: { props: FormPropRules }[] }

    const formRulesData = computed(() => {
      return getFormRuleData({
        formProps: props,
        formItems: formItem,
        reuqireMessage: props.requiredMessage
      })
    })

    const childState = reactive({
      loading: false,
      allErrors: [] as FormValidateError[]
    })

    const loading = (() => {
      let time: null | number

      return {
        show: () => {
          time = setTimeout(() => {
            childState.loading = true
            time = null
          }, 500)
        },

        hide: () => {
          !!time ? clearTimeout(time) : childState.loading = false
        }
      }
    })()

    const validateMethods = {
      validate: async (config?: { autoLoading?: boolean, autoAlert?: boolean }) => {
        config = config || {}

        if (config.autoLoading != false) {
          loading.show()
        }

        childState.allErrors = await formRulesData.value.methods.validate(props.model)

        loading.hide()

        if (childState.allErrors.length > 0) {
          const { message, label } = childState.allErrors[0]

          const errMsg = !label ? message : `"${label}" 校验不通过，${message}`

          if (config.autoAlert !== false) {
            useMessage().warn(errMsg)
          }

        } else {
          return null
        }
      },

      clearValidate: () => {
        childState.allErrors = []
      },

      showError: (error: any) => useMessage().warn(!!error.message ? error.message : String(error))
    }

    const freezeState = {
      oldFormData: { ...(props.model || {}) }
    }

    const validateHandler = {
      validateChange: async (trigger: FormValidateTrigger, prop: string | string[] | undefined) => {
        if (!prop) {
          return
        }
        const { fitRuleList, fitRuleMap } = formRulesData.value.methods.getRules({
          prop,
          trigger,
          associateFields: props.associateFields,
        })
        if (fitRuleList.length === 0) { return }
        childState.allErrors = await formRulesData.value.methods.validateProp({
          formData: props.model,
          allErrors: childState.allErrors,
          rules: fitRuleMap,
        })
      },

      onEditChange: async (prop?: string | string[]) => await validateHandler.validateChange(FormValidateTrigger.change, prop),

      onBlurChange: async (prop?: string | string[]) => await validateHandler.validateChange(FormValidateTrigger.blur, prop),

      onPropChange: async (prop?: string | string[]) => await validateHandler.validateChange(FormValidateTrigger.change, prop),

      onFormDataChange: debounce((val: any) =>{
        
        const newFormData = val || {}
        const oldFormData = freezeState.oldFormData || {}

        const ruleProps = Object.keys(({ ...newFormData, ...oldFormData }))
        const changeProps: string[] = []


        ruleProps.forEach(p => {
          let newVal = newFormData[p]
          let oldVal = oldFormData[p]

          if(newVal !== oldVal) {
            changeProps.push(p)
            emit.onFieldValueChange(p, newVal, oldVal)
          }
        })

        freezeState.oldFormData = { ...val || {} }
        if(changeProps.length > 0) {
          validateHandler.onPropChange(changeProps)
        }

      }, 150, false)
      
    }

    watch(() => props.model, validateHandler.onFormDataChange, {deep: true})

    return {
      refer: {
        props,
        childState,
        validateHandler,
        ...validateMethods,
        numberState,
        formRulesData
      },
      render: () => <div
        class={classes.value}
        style={{ ...styles.value, ...props.style } as any}
      >
        {slots.default()}
        <SaLoadingMask modelValue={childState.loading || !!props.loading} fixedPosition />
      </div>
    }
  }
})

export default SaForm

export const FormCollector = useCollect(() => ({
  parent: SaForm,
  child: SaFormItem
}))