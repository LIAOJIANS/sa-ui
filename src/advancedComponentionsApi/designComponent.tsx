import {
  ExtractPropTypes,
  ComponentPropsOptions,
  defineComponent,
  SetupContext,
  getCurrentInstance,
  DefineComponent,
  EmitsOptions,
  ComponentInternalInstance,
  provide,
  ref,
  inject,
  App,
  Ref,
  ComputedOptions,
  MethodOptions,
  ComponentOptionsMixin
} from "vue";
import { getComponentEmitOptions, ObjectEmitOptions, EmitToProp, useSetupEvent, ComponentEvent } from "./emit"
import { SlotProps, useSetupSlots } from './sort'
import { ScopeSlotProps, useSetupScopeSlots } from './scopeSlot'
import { InheritAttributes } from './inherit'
import { renderNothing, VueNode } from './designComponent.utils'
import { useDesignExpose } from "./expose"

function useReference<T = any>(defaultValue?: T) {
  return ref<null | T>(defaultValue || null)
}

interface InjectValue<Refer> {
  (): Refer,
  <DefaultValue>(defaultValue?: DefaultValue): Refer | DefaultValue
}


export interface UseType<Refer, Props, InheritProps> {
  ref: () => Ref<Refer | null>,
  inject: InjectValue<Refer>
  class: Refer,
  props: Props,
  inheritProps: InheritProps,
}

export function designComponent<_,
  RawBindings,
  D,
  Refer,
  Expose extends object,
  Props extends Readonly<ExtractPropTypes<PropsOptions>>,
  SetupProps extends Readonly<ExtractPropTypes<PropsOptions> & { children: any }>,
  PropsOptions extends Readonly<ComponentPropsOptions> = {},
  EmitOptions extends ObjectEmitOptions = {},
  InheritPropsType extends (((props: any) => any) | (new () => any) | Record<string, any>) = {},
  E extends EmitsOptions = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  EE extends string = string,
  SlotKeys extends string = '',
  ScopeSlots extends { [k: string]: (scope: any) => void } = {},
  FcPropsType = PropsOptions & (Props extends { modelValue?: any } ? { 'v-model'?: Props['modelValue'] } : {}) &
  { ref?: any } & EmitToProp<EmitOptions> &
  { 'v-slots'?: (SlotProps<SlotKeys, ScopeSlots> & ScopeSlotProps<SlotKeys, ScopeSlots>) },
  TargetInheritPropsType = (Omit<InheritPropsType extends { use: { inheritProps: infer R } } ? R : InheritAttributes<InheritPropsType>, keyof FcPropsType>) | any
>(options: {
  name?: string,
  props?: PropsOptions,
  emits?: EmitOptions,
  scopeSlots?: ScopeSlots,
  provideRefer?: boolean,
  inheritPropsType?: InheritPropsType,
  slots?: SlotKeys[],
  expose?: Expose,
  setup?: (data: {
    attrs: Record<string, any>,
    props: Props,
    event: ComponentEvent<EmitOptions>,
    slots: { [k in SlotKeys]: ((defaultReactNode?: VueNode) => VueNode) & { isExist: () => boolean } },
    scopeSlots: { [k in keyof ScopeSlots]: ((scope: Parameters<ScopeSlots[k]>[0], defaultNode?: VueNode) => VueNode) & { isExist: () => boolean } },

    setupContext: SetupContext<E>,
    ctx: ComponentInternalInstance,
  }) => ({ refer?: Refer, render: () => any } | (() => any)),
}): DefineComponent<FcPropsType & TargetInheritPropsType,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE
> & { use: UseType<Refer, SetupProps, Props & EmitToProp<EmitOptions> & TargetInheritPropsType> } & Expose & { install: (app: App) => void } {
  const { name, provideRefer, setup, emits, scopeSlots, slots, expose, ...leftOptions } = options

  const Component = Object.assign(
    defineComponent({
      ...(leftOptions as any || {}),
      props: leftOptions.props as PropsOptions,
      emits: getComponentEmitOptions(emits),
      setup(props: any, ctx: any) {

        if (!setup) {
          return renderNothing
        } else {
          const setupContext = getCurrentInstance()!
          const evetn = useSetupEvent(ctx, emits);
          (setupContext as any).event = evetn
          const setupData = setup({
            props,
            attrs: ctx.attrs,
            event: evetn,
            slots: useSetupSlots(ctx, slots),
            scopeSlots: useSetupScopeSlots(ctx, scopeSlots),
            setupContext: ctx,
            ctx: setupContext
          })

          if (typeof setupData === 'function') {
            return setupData
          } else {
            const { render, refer } = setupData
            useDesignExpose(setupContext, refer, name)

            if (provideRefer) {
              !options.name
                ? console.error('component name is necessary when provideRefer is true!')
                : provide(`@@${name}`, refer)
            }

            return render || (renderNothing)
          }
        }


      }
    }),
    {
      use: {
        inject: (defaultValue?: any) => inject(`@@${name}`, defaultValue) as Refer,
        ref: () => useReference<Refer>(),
      },
      install: (app: App) => {
        if (!name) {
          console.log('组件未定义name，无法注册！')
          return console.log('component', Component)
        }
        app.component(name, Component)
      },
      ...expose
    }
  ) as any


  return Component
}