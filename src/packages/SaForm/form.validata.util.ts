import { FormRuleItem } from "./form.validata"
import { decopy } from 'js-hodgepodge'

export const formValidataUtil = {
  getPropArray: (prop: string | string[] | undefined): string[] => {
    if (!prop) {
      return []
    }

    return Array.isArray(prop) ? [...prop] : [prop]
  },

  getRuleArray: (rule: FormRuleItem | FormRuleItem[]): FormRuleItem[] => {
    return decopy(Array.isArray(rule) ? [...rule] : [rule])
  },

  getValueByProp: (
    prop: string,
    formData: Record<string, any> | null | undefined,
    transform?: (val: any) => any
  ) => {
    if (!formData) {
      return null
    }

    let val: any;
    if (prop.indexOf('.') === -1) {
      val = formData[prop]
    } else {
      const fields = prop.split('.')
      let index = 0, len = fields.length
      let value = formData[fields[index]]

      while (index < len - 1 && value != null) {
        value = value[fields[++index]]
      }
      val = index == len - 1 ? value : null
    }
    return !transform ? val : transform(val)

  }
}