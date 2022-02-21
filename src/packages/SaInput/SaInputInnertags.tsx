import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useRefs } from "src/hooks";
import { watch } from "vue";

export const SaInputInnertags = designComponent({
  name: 'sa-input-inner-tags',

  props: {
    data: { type: Array },
    maxTags: { type: Number, default: 3 },
    collapseTags: { type: Boolean, default: true },
    placeholder: { type: [Number, String] }
  },

  scopeSlots: {
    default: ( scope: { item: any, index: Number } ) => {}
  },

  inheritPropsType: HTMLDivElement,
  setup({ props, scopeSlots }) {
    const { refs, onRef } = useRefs({ el: HTMLDivElement })

    
    return {
      refer: {
        refs
      },
      render: () => (
        <div class="sa-input-inner-tags" ref={ onRef.el }>
          {
            (!props.data || props.data.length === 0) && (
              <span class="sa-input-custom-placeholder">{ props.placeholder }</span>
            )
          }

          {
            (props.collapseTags ? props.data!.slice(0, props.maxTags) : props.data!).map((item: any, index) => (
              <span key={index} class="sa-input-inner-tag-item">
                {scopeSlots.default({item, index}, null)}
              </span>
            ))
          }

          {
            props.collapseTags && 
            props.data!.length > props.maxTags && 
            <span class="sa-input-inner-tag-item">=+{props.data!.length - props.maxTags }</span>
          }
           <span class="sa-input-inner-tag-item sa-input-inner-tag-item-takeover">&nbsp;</span>
        </div>
      )
    }
  }
})