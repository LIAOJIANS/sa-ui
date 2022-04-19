import { RuleItem } from "async-validator"


export type FormRuleItem = Omit<RuleItem, 'required'> & {
  required?: boolean,
  label?: string
}

export type FormPropRules = Record<string, FormRuleItem | FormRuleItem[]>