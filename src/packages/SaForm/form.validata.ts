import Schema, { RuleItem } from "async-validator"
import { PlainObject } from "src/advancedComponentionsApi/emit"
import { defer } from "src/hooks"
import { formValidataUtil } from "./form.validata.util"

export enum FormValidateTrigger { // 触发方式枚举
  change = 'change',
  blur = 'blur',
}

export type FormRuleItem = Omit<RuleItem, 'required'> & {
  required?: boolean | FormRuleValidator,
  label?: string,
  trigger?: string,   // 触发方式

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

export type FormAssociateFields = Record<string, string | string[]>

export type FormValidateError = {
  prop: string,
  message: string,
  label: string,
}

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

    if (required) {

      prop ? console.error('SaFormItem.props.prop is required when PlForm.props.required is working!') : (() => {
        utils.addRequired(prop, required)
        const requiredRule: StatusRules = {
          prop,
          required,
        }
        utils.addStateRule(requiredRule)
      })()

    }

    if (rules) {
      formValidataUtil.getRuleArray(rules).forEach(r => {
        if (!!r.label) {
          utils.addLabel(r.prop || prop, r.label)
        }

        if (!r.prop) {
          !prop ? console.error('SaFormItem.props.prop is required when SaForm.props.rules[].prop is working!') : (() => {
            r.prop = prop
            if (r.required) {
              utils.addRequired(r.prop || prop, r.required)
            }
          })()
        }

        !!r.prop && utils.addStateRule({
          ...r,
          prop: r.prop!,
        })

      })
    }
  })

  const rules = state.stateRule.reduce((prev, rule) => {
    const {
      prop,
      transform: prevTransform,
      label,
      required,
      message,
      trigger,

      ...itemRule
    } = rule

    const errorMessage = (typeof message === 'function' ? message() : message) || reuqireMessage

    const requiredValidation: RuleItem['asyncValidator'] = async (
      rule,
      value,
      callback,
      source
    ) => {
      if (typeof required === 'function') {
        return callback(await required(value, source, rule) || undefined)
      }

      if (value == null) {
        return callback(errorMessage)
      }

      if (
        typeof value === "string" &&
        !value.trim()
      ) {
        return callback(errorMessage)
      }

      if (
        Array.isArray(value) &&
        value.length === 0
      ) {
        return callback(errorMessage)
      }

      return callback()
    }

    formValidataUtil.getPropArray(prop).forEach(p => {
      if (!prev[p]) {
        prev[p] = []
      }

      let transform: any = p.indexOf('.') === -1 ?
        prevTransform :
        (val: any, source: any) => formValidataUtil.getValueByProp(p, source, prevTransform)

      if (required) {
        prev[p].push({ trigger, transform, asyncValidator: requiredValidation })
      }

      if (Object.keys(itemRule).length > 0) {
        prev[p].push({
          ...itemRule,
          message,
          trigger,
          transform,
        })
      }
    })

    return prev

  }, {} as Record<string, (RuleItem & { trigger?: string })[]>)

  const methods = {
    getRules({
      prop,
      trigger,
      associateFields
    }: {
      prop: string | string[],
      trigger: FormValidateTrigger | undefined,
      associateFields?: FormAssociateFields,
    }) {
      const fs = (() => {
        const props = formValidataUtil.getPropArray(prop)
        !!associateFields && props.forEach((f) => {
          if (associateFields[f]) {
            props.push(...formValidataUtil.getPropArray(associateFields[f]))
          }
        })
        return props
      })()

      const fitRuleList = [] as (RuleItem & { trigger?: string })[]

      const fitRuleMap = {} as Record<string, (RuleItem & { trigger?: string })[]>

      Object.entries(rules).forEach(([p, rs]) => {
        if (fs.indexOf(p) > -1) {
          if (!fitRuleMap[p]) {
            fitRuleMap[p] = []
          }

          const fitRules = !trigger ? rs : rs.filter(i => (i.trigger || FormValidateTrigger.change) === trigger)

          fitRuleMap[p].push(...fitRules)
          fitRuleList.push(...fitRules)
        }
      })

      return {
        fitRuleList,
        fitRuleMap
      }
    },

    validateProp: ({
      rules,
      allErrors,
      formData,
    }: {
      rules: Record<string, RuleItem[]>,
      allErrors: FormValidateError[],
      formData: any,
    }) => {

      const validation = new Schema(rules)
      const dfd = defer<FormValidateError[]>()
      const ruleKeys = Object.keys(rules)

      validation.validate(formData, undefined, (errors) => {
        const newErrors = allErrors.filter(e => ruleKeys.indexOf(e.prop) === -1)
        dfd.resolve([...newErrors, ...errors.map(c => ({ ...c, prop: c.field })) || []].map(i => ({
          ...i,
          label: state.PropToLabel[i.prop]!,
        })))
      }).then()

      return dfd.promise
    },

    validate: (formData: any) => {
      const validation = new Schema(rules)
      const dfd = defer<FormValidateError[]>()
      validation.validate(formData, undefined, (errors) => {
          dfd.resolve((errors || []).map(i => ({
              ...i,
              prop: i.field,
              label: state.PropToLabel[i.field]!
          })))
      }).then()
      return dfd.promise
    }
  }

  
  return {
    utils,
    rules,
    ...state,
    methods,
  }
}


export type FormRuleData = ReturnType<typeof getFormRuleData>