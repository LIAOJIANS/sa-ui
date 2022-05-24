import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, EditProps, StyleProps, unit, useEdit, useStyle } from "src/hooks";
import { StyleStatus, useStyles } from "src/hooks/use/useStyle";
import { computed, ComputedRef, PropType } from "vue";
import { FormRuleItem } from "../SaForm/form.validata";
import { formValidataUtil } from "../SaForm/form.validata.util";
import { FormCollector, FormLabelSite } from "../SaForm/SaForm";
import SaTooltip from '../SaTooltip/SaTooltip'
import SaIcon from '../SaIcon/SaIcon'

const SaFormItem = designComponent({

  name: 'sa-form-item',

  props: {
    ...StyleProps,
    ...EditProps,

    label: { type: String },
    labelWidth: { type: [String, Number] },
    require: { type: Boolean },
    prop: { type: String },
    column: { type: [String, Number], default: 1 },                      // 多列表单的列数
    labelColumnTipTheme: { type: String as PropType<'dark' | 'light'>, default: 'light' },             // 一列时超出提示的tip主题
    block: { type: Boolean },                                           // 是否是块级
    labelSite: { type: String as PropType<FormLabelSite | keyof typeof FormLabelSite> }, // label位置
    colon: { type: Boolean, default: null },                              // label的冒号
    rules: { type: [Array, Object] as PropType<FormRuleItem | FormRuleItem[]> }
  },
  inheritPropsType: HTMLDivElement,

  emits: {
    onBlur: () => true,
    onChange: () => true,
  },

  slots: ['default', 'suffix'],

  setup({ props, event: { emit }, slots }) {

    const form = FormCollector.child()

    const { styleComputed } = useStyle({
      adjust: ret => {
        !!invalidate.value && (ret.status = StyleStatus.error)
      }
    })

    const handler = {
      onEditChange: () => form.validateHandler.onEditChange(props.prop),
      onEditBlur: () => form.validateHandler.onBlurChange(props.prop),
    }

    useEdit({
      adjust: ret => {
          ret.onChange = handler.onEditChange
          ret.onBlur = handler.onEditBlur

          if (!!form.props.disabledProps && !!props.prop) {
              const fields = formValidataUtil.getPropArray(props.prop)
              if (!!fields && !!fields.find(f => form.props.disabledProps![f])) {
                  ret.disabled = true
              }
          }
          if (!!form.props.readonlyProps && !!props.prop) {
              const fields = formValidataUtil.getPropArray(props.prop)
              if (!!fields && !!fields.find(f => form.props.readonlyProps![f])) {
                  ret.readonly = true
              }
          }
      }})

    /* ---------------------------------------------- computer ------------------------------------------------- */

    const colonValue = computed(() => props.colon != null ? props.colon : form.props.colon)
    const labelSiteValue = computed(() => props.labelSite || form.props.labelSite || FormLabelSite.right)

    const labelWidthValue = computed(() => form.props.column === 1 ? undefined : (props.labelWidth || form.props.labelWidth || 120))

    const isRequired = computed(() => {
      const ruleProps = formValidataUtil.getPropArray(props.prop)

      if (!!props.rules) {
        formValidataUtil.getRuleArray(props.rules).forEach(r => {
          !!r.prop && ruleProps.push(...formValidataUtil.getPropArray(r.prop))
        })
      }

      return form.formRulesData.value.utils.isRequire(ruleProps)
    }) as ComputedRef<boolean>

    const classes = computed(() => classname([
      'sa-form-item',
      `sa-form-item-size-${styleComputed.value.size}`,
      `sa-form-item-label-align-${labelSiteValue.value}`,
      {
        'sa-form-item-block': props.block,
        'sa-form-item-required': isRequired.value,

        'sa-form-item-invalidate': !!invalidate.value
      }
    ]))

    const labelStyles = useStyles(style => {
      if (!!labelWidthValue.value || !form.props.verticalLabel) {
        style.width = unit(labelWidthValue.value)
        style.paddingLeft = unit(form.props.columnGutter)
      }
    })

    const bodyStyles = useStyles(style => {
      if (form.props.column === 1) {
        style.width = unit(form.props.contentWidth)
        style.flex = 'initial'
      }
    })

    const invalidate = computed(() => {
      const { allErrors } = form.childState

      const ruleProps = formValidataUtil.getPropArray(props.prop)

      if (!ruleProps) {
        return null
      }

      const fitErros = allErrors.find(err => ruleProps.indexOf(err.prop) > -1)
      


      return !fitErros ? null : {
        message: fitErros.message,
        prop: fitErros.prop,
      }
    })

    return {
      refer: {
        props
      },

      render: () => <div class={classes.value} >
        {!!props.label && (
          <div class="sa-form-item-label" style={labelStyles.value}>
            {(() => {
              const content = <>
                {isRequired.value && <span class="sa-form-item-required-dot">*</span>}
                <span>{props.label}</span>
                {!!props.label && !!props.label.trim() && !!colonValue.value && '：'}
              </>

              return form.props.column == 1 ? <SaTooltip tooltip={props.label} theme={props.labelColumnTipTheme}>
                <span>
                  {content}
                </span>
              </SaTooltip> : content
            })()}
          </div>
        )}
        <div class="sa-form-item-body" style={bodyStyles.value}>
          {slots.default.isExist() && slots.default()}
          {slots.suffix.isExist() && (
            <div class="sa-form-item-suffix">
              {slots.suffix()}
            </div>
          )}

          {!!invalidate.value && (
            <div class="sa-form-item-message">
              <SaIcon icon="el-icon-warning" status="error" />
              <span>{invalidate.value.message}</span>
            </div>
          )}
        </div>
      </div>
    }
  }
})



export default SaFormItem