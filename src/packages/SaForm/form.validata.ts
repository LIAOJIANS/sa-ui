import { RuleItem } from "async-validator"
import { PlainObject } from "src/advancedComponentionsApi/emit"
import { formValidataUtil } from "./form.validata.util"

export type FormRuleItem = Omit<RuleItem, 'required'> & {
  required?: boolean,
  label?: string,

  prop?: string | string[]
}

export type FormPropRules = Record<string, FormRuleItem | FormRuleItem[]>

export type FormRuleValidatorResult = string | null | undefined | void

export interface FormItemPropRules {
  label?: string,
  prop?: string | string[]
  required?: boolean | FormRuleValidator,
  rules?: FormRuleItem | FormRuleItem[]
}


export type FormRuleValidator = (
  val: any,
  row: PlainObject,
  rule: FormRuleItem
) => FormRuleValidatorResult | Promise<FormRuleValidatorResult>;


export function getFormRuleData({
  formProps,
  formItems,
  reuqireMessage
}: {
  formProps: { rules?: FormPropRules },
  formItems: { value: { props: FormItemPropRules }[] },
  reuqireMessage: string
}) {
  type StatusRules = Omit<FormRuleItem, 'prop'> & {
    prop?: string | string[]
  }

  const state = {
    stateRule: [] as StatusRules[],
    PropToLabel: {} as Record<string, string | undefined>,
    propReuqire: {} as Record<string, string | undefined | boolean>
  }

  const utils = {
    isRequire: (prop?: string | string[]) => {
      if (!prop) { return false }
      const props = [...formValidataUtil.getPropArray(prop)]
      return props.some(p => !!state.propReuqire[p])
    },

    addStateRule: (stateRule: StatusRules) => {
      state.stateRule.push(stateRule)
    },

    addLabel: (prop?: string | string[], label?: string) => {
      if (!prop || !label) { return }

      formValidataUtil.getPropArray(prop).forEach((f) => {
        state.PropToLabel[f] = label
      })

    },

    addRequired: (prop?: string | string[], required?: boolean | undefined | FormRuleValidator) => {
      formValidataUtil.getPropArray(prop).forEach(p => {
        if (required == null) {
          return
        }

        state.propReuqire[p] = typeof required !== "function" && !!required
      })
    }
  }

  if (!!formProps.rules) {
    Object.entries(formProps.rules).forEach(([k, r]) => {
      formValidataUtil.getRuleArray(r!).forEach((rule) => {
        utils.addLabel(rule.prop || k, rule.label)
        utils.addRequired(rule.prop || k, rule.required)
        utils.addStateRule({
          ...rule,
          prop: rule.prop || k,
        })
      })
    })
  }

  formItems.value.forEach(({ props: { label, prop, required, rules } }) => {
    utils.addLabel(prop, label)

    if(required) {
      // --- 后续
    }
  })
}