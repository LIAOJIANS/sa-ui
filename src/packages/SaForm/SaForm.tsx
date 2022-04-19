import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, EditProps, StyleProps, unit, useCollect, useEdit, useNumber, useStyle, useStyles, removeUnit } from "src/hooks";
import './SaForm.scss'
import { computed, PropType } from 'vue'
import { FormPropRules } from "./form.validata";
import SaFormItem from "../SaFormItem/SaFormItem";

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
    width: { type: [Number, String] },                                     // form 表单宽度
    columnGutter: { type: [Number, String], default: 16 },                 // 列之间的间距
    labelWidth: { type: [String, Number] },                              // label 宽度
    labelSite: { type: String as PropType<FormLabelSite>, default: FormLabelSite.left }, // label位置
    column: { type: [String, Number], default: 1 },                       // 多列表单的列数
    verticalLabel: { type: Boolean },                                     // 纵向的表单
  },

  slots: ['default'],

  setup({ props, slots }) {

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


    return {
      refer: {

      },
      render: () => <div
        class={classes.value}
        style={{ ...styles.value, ...props.style } as any}
      >
        {slots.default()}
      </div>
    }
  }
})

export default SaForm

export const FormCollector = useCollect(() => ({
  parent: SaForm,
  child: SaFormItem
}))