import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, EditProps, StyleProps, unit, useStyle } from "src/hooks";
import { StyleStatus, useStyles } from "src/hooks/use/useStyle";
import { computed, PropType } from "vue";
import { FormRuleItem } from "../SaForm/form.validata";
import { FormCollector, FormLabelSite } from "../SaForm/SaForm";
import SaTooltip from '../SaTooltip/SaTooltip'

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

  },

  slots: ['default', 'suffix'],

  setup({ props, event: { emit }, slots }) {

    const form = FormCollector.child()

    const { styleComputed } = useStyle({
      adjust: ret => {
        (ret.status = StyleStatus.error)
      }
    })

    /* ---------------------------------------------- computer ------------------------------------------------- */

    const colonValue = computed(() => props.colon != null ? props.colon : form.props.colon)
    const labelSiteValue = computed(() => props.labelSite || form.props.labelSite || FormLabelSite.right)

    const labelWidthValue = computed(() => form.props.column === 1 ? undefined : (props.labelWidth || form.props.labelWidth || 120))

    const isRequired = computed(() => true)

    const classes = computed(() => classname([
      'sa-form-item',
      `sa-form-item-size-${styleComputed.value.size}`,
      `sa-form-item-label-align-${labelSiteValue.value}`,
      {
        'sa-form-item-block': props.block,
        'sa-form-item-required': isRequired.value
      }
    ]))

    const labelStyles = useStyles(style => {
      if (!!labelWidthValue.value || !form.props.verticalLabel) {
        style.width = unit(labelWidthValue.value)
        style.paddingLeft = unit(form.props.columnGutter)
      }
    })

    const bodyStyles = useStyles(styles => {
      if (form.props.column === 1) {
        styles.width = unit(form.props.contentWidth)
        styles.flex = 'initial'
      }
    })

    return {
      render: () => <div class={classes.value}>
        {!!props.label && (
          <div class="sa-form-item-label" style={labelStyles.value}>
            {(() => {
              const content = <>
                <span class="sa-form-item-required-dot">*</span>
                <span>{props.label}</span>
                {!!props.label && !!props.label.trim() && !!colonValue.value && '：'}
              </>

              return form.props.column == 1 ? <SaTooltip tooltip={props.label} showWidth="100%" theme={props.labelColumnTipTheme}>
                <span>
                  {content}
                </span>
              </SaTooltip> : content
            })()}
          </div>
        )}
        <div class="sa-form-item-body" style={ bodyStyles.value }>
          {slots.default.isExist() && slots.default()}
          {slots.suffix.isExist() && (
            <div class="sa-form-item-suffix">
              {slots.suffix()}
            </div>
          )}
        </div>
      </div>
    }
  }
})


export default SaFormItem