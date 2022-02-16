import { computed, PropType, reactive, ref, watch } from 'vue';
import { designComponent } from '../../advancedComponentionsApi/designComponent';
import './input.scss';
import {
  classname,
  unit,
  StyleProps,
  useStyle,
  useStyles,
  useNumber,
  useModel,
  useRefs,
  useEdit,
} from '../../hooks';

import SaIcon from '../SaIcon/SaIcon';

export const SaInput = designComponent({
  name: 'sa-input',
  props: {
    ...StyleProps,
    textarea: { type: Boolean },

    number: { type: String as PropType<'integer' | 'negative'>, default: '' },
    toFixed: { type: [String, Number] },
    type: { type: String as PropType<'phone' | 'date' | 'time'> },

    block: { type: Boolean },
    clearIcon: { type: Boolean },
    prefixIcon: { type: String },
    suffixIcon: { type: String },

    width: {
      type: [Number, String] as PropType<string | number>,
      default: null,
    },
    minHeight: { type: [Number, String], default: 100 },
    maxHeight: {
      type: [Number, String] as PropType<string | number | null>,
      default: 156,
    },
    autoHeight: { type: Boolean },

    modelValue: { type: [String, Number] as PropType<string | number | null> },
    clearHandler: Function,
    asyncHandler: { type: Function },
    fillGroup: { type: Boolean },
    align: { type: String as PropType<'center' | 'left' | 'right'> },

    placeholder: { type: String },
    placeValue: {type: [String, Number]},
    inputInnerTabindex: { type: Number, default: 0 },
    readonly: { type: Boolean },
    nativeAttrs: {type: Object},
    isFocus: {type: Boolean}, 
  },

  inheritPropsType: HTMLDivElement,

  emits: {
    onUpdateModelValue: (val: any) => true,
    onFocus: (e: FocusEvent) => true,
    onBlur: (e: FocusEvent) => true,
    onKeydown: (e: KeyboardEvent) => true,
    onEnter: (e: KeyboardEvent) => true,
    onEsc: (e: KeyboardEvent) => true,

    onClickInput: (e: MouseEvent) => true,
    onClickPrefixIcon: (e: MouseEvent) => true,
    onClickSuffixIcon: (e: MouseEvent) => true,
    onClickClearIcon: (e: MouseEvent) => true,

    onInputChange: (row: { format: string; val: string }) => true,
  },

  slots: ['default', 'append', 'prepend', 'hidden'],

  setup({ props, event: { emit }, slots }) {
    // const inputValue = ref('')
    // const inputRef = ref(null as any as HTMLInputElement)

    const { refs, onRef } = useRefs({
      input: HTMLInputElement,
      hiddenInput: HTMLTextAreaElement,
    });

    const state = reactive({
      autoHeight: null as null | number,
      handlerEnter: null as null | ((e: KeyboardEvent) => void),
      handleEnterInner: async (e: KeyboardEvent) => {
        if (editComputed.value.editable) {
          if (!!props.asyncHandler) {
            editState.loading = true;
            try {
              await props.asyncHandler();
            } catch (e) {
              console.log(e);
            } finally {
              editState.loading = false;
            }
          } else {
            emit.onEnter(e);
          }
        }
      },
    });

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue);
    const { styleComputed } = useStyle({ status: undefined });
    const { editState, editComputed } = useEdit();
    const { numberState } = useNumber(props, [
      'width',
      'minHeight',
      'minHeight',
    ]);

    const styles = useStyles((styles) => {
      if (!numberState.width && !props.block) {
        styles.width = unit(numberState.width);
      }

      if (!!props.textarea) {
        if (!props.autoHeight || state.autoHeight == null) {
          styles.height = unit(state.autoHeight);
        } else {
          if (
            numberState.minHeight != null &&
            state.autoHeight > numberState.minHeight
          ) {
            styles.height = unit(numberState.minHeight);
          } else if (state.autoHeight < numberState.minHeight) {
            styles.height = unit(numberState.minHeight);
          } else {
            styles.height = unit(state.autoHeight);
          }

          if (!!props.type) {
            styles['text-align'] = 'center'
          }
        }
      }
      return styles;
    });
    const classes = computed(() =>
      classname([
        `sa-input-shape-${styleComputed.value.shape}`,
        `sa-input-size-${styleComputed.value.size}`,
        {
          [`sa-input-status-${styleComputed.value.status}`]: !!styleComputed.value.status,
          'sa-input-clear': !!props.clearIcon,
          'sa-input-prefix-padding': !!props.prefixIcon,
          'sa-input-disabled': !!editComputed.value.disabled,
          'sa-input-suffix-padding':
            !!props.suffixIcon ||
            !!props.clearIcon ||
            editComputed.value.loading,
          'sa-input-prefix': !!props.prefixIcon,
          'sa-input-suffix': !!props.suffixIcon || editComputed.value.loading,
          'sa-input-empty': !model.value && !props.placeValue,
          'sa-input-not-editable': !editComputed.value.editable,
          'sa-input-fill-group': props.fillGroup,
          [`sa-input-align-${props.align}`]: !!props.align,
          'pl-input-focus': props.isFocus
        },
      ]),
    );

    const methods = {
      clearValue: () => {
        model.value = undefined;
      },

      format: (val: string) => {
        if (val.length > 11) {
          val = val.substring(0, 11);
        }

        let format = '';
        val.split('').forEach((c, i) => {
          if (i === 3 || i === 7) {
            format += ' - ';
          }

          format += c;
        });

        emit.onInputChange({ format: format, val });
        model.value = format;
      },

      dateFormat: (val: string) => {
        if (val.length > 8) {
          val = val.substring(0, 8);
        }

        let format = '';
        val.split('').forEach((c, i) => {
          if (i === 4 || (i > 4 && i % 2 === 0)) {
            format += ' - ';
          }

          emit.onInputChange({ format, val });
          format += c;
        });

        model.value = format;
      },

      timeFormat: (val: string) => {
        if (val.length > 6) {
          val = val.substring(0, 6);
        }

        let format = '';
        val.split('').forEach((c, i) => {
          if ([2, 4].indexOf(i) > -1) {
            format += ' : ';
          }
          format += c;
        });

        emit.onInputChange({ format, val });
        model.value = format;
      },

      focus: () => {
        if (!!refs.input && !!refs.input.focus) {
          refs.input.focus()
        }
      },
    };

    const handler = {
      clickClearIcon: (e: MouseEvent) => {
        
        if (!editComputed.value.editable) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();
        emit.onClickClearIcon(e);
        props.clearHandler ? props.clearHandler() : methods.clearValue();
      },

      clickSuffixIcon: (e: MouseEvent) => {
        if (!editComputed.value.editable) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        emit.onClickSuffixIcon(e);
      },

      ClickPrefixIcon: (e: MouseEvent) => {
        if (!editComputed.value.editable) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();
        emit.onClickPrefixIcon(e);
      },

      input: (e: any) => {
        const { toFixed, number, type, textarea } = props;

        if (!!textarea || (!type && !number)) {
          model.value = e.target.value;
          return;
        }

        if (!!type && !!number) {
          return console.error('type and number only one can exist！');
        }

        let val = e.target.value;
        let numberValue = '';
        if (/\D/g.test(val)) {
          val = val.replace(/\D/g, '');
        }

        if (!!type) {
          model.value = val
          switch (type) {
            case 'phone':
              return methods.format(val);
            case 'date':
              return methods.dateFormat(val);
            case 'time':
              return methods.timeFormat(val);
          }
        } else if (!!number) {

          model.value = ''; // 为了出发computer 更新input值 ？？？   后续看有没有更优的办法

          numberValue = (val.length === 1 ? val.replace(/[^1-9]/g, '') : val)
            .split('')
            .filter((c: string) => /^[1-9]\d*$/.test(c))
            .join('');
          if (number === 'negative') {
            numberValue = `-${numberValue}`
          }
        }

        if (!!toFixed && !type && !textarea) {
          model.value = `${numberValue}.${new Array(parseInt(toFixed as any))
            .fill('0')
            .join('')}`;
        } else {
          model.value = numberValue
        }
      },
    };

    const publicProps = computed(
      () =>
      ({
        style: styles.value,
        disabled: editComputed.value.disabled,
        readonly:
          props.readonly ||
          editComputed.value.readonly ||
          editComputed.value.loading,
        ...(props.nativeAttrs || {}),

        value: model.value || '',
        placeholder: props.placeholder,

      //   ...(!slots.default.isExist() ? {
      //     onInput: (e: Event) => {
      //         /*ie 下不知道为什么页面初始化的之后这里默认就执行了一次，这里判断绕过这个问题*/
      //         if (e.target === document.activeElement) {
      //           handler.input(e as any)
      //         }
      //     },
      // } : {}),

        onInput: handler.input,
        onClick: emit.onClickInput,
        onFocus: (e: FocusEvent) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          emit.onFocus;
        },
        onBlur: (e: FocusEvent) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          emit.onBlur(e);
        },
        ref: onRef.input,
      } as any),
    );

    return {
      refer: {
        refs,
        state,
        numberState,
        methods,
        model,
      },
      render: () => {
        if (props.textarea) {
          return (
            <div class={'sa-textarea ' + classes.value}>
              <textarea
                class="sa-textarea-inner"
                {...publicProps.value}
              ></textarea>
            </div>
          );
        } else {
          const input = (
            <div class={'sa-input ' + classes.value}>
              {!!props.prefixIcon && (
                <span
                  class="sa-input-prefix-icon"
                  onClick={handler.ClickPrefixIcon}
                >
                  <SaIcon icon={props.prefixIcon} />
                </span>
              )}
              {slots.default.isExist() ? (
                <div
                  tabIndex={props.inputInnerTabindex}
                  class="sa-input-inner"
                  {...publicProps.value}
                >
                  
                 {slots.default()}
                </div>
              ) : (
                <input class="sa-input-inner" {...publicProps.value} />
              )}
              {!!props.suffixIcon && (
                <span class="sa-input-suffix-icon">
                  {typeof props.suffixIcon === 'function' ? (
                    (props.suffixIcon as any)()
                  ) : (
                    <SaIcon
                      icon={props.suffixIcon}
                      onMousedown={handler.clickSuffixIcon}
                    />
                  )}
                </span>
              )}

              {!!props.clearIcon && (
                <span class="sa-input-suffix-icon sa-input-clear-icon">
                  <SaIcon
                    onMousedown={handler.clickClearIcon}
                    icon="el-icon-error"
                  />
                </span>
              )}

              {!!editComputed.value.loading && <span>loading</span>}

              {slots.hidden.isExist() && (
                <div class="sa-input-inner-hidden">{slots.hidden()}</div>
              )}
            </div>
          );

          if (!slots.prepend.isExist() && !slots.append.isExist()) {
            return input;
          } else {
            return (
              <div class="sa-input-container">
                {slots.prepend.isExist() && (
                  <div class="sa-input-prepend">{slots.prepend()}</div>
                )}
                {input}
                {slots.append.isExist() && (
                  <div class="sa-input-append">{slots.append()}</div>
                )}
              </div>
            );
          }
        }
      },
    };
  },
});

export default SaInput;
