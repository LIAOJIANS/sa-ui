import { Transition } from "vue";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { addClass, removeClass } from "src/hooks";

export const SaCollapseTransition = designComponent({
  name: 'sa-collapse-transition',

  emits: {
    onAfterLeave: () => true
  },

  slots: ['default'],

  setup({ slots, event: { emit } }) {

    const handler = {
      beforeEnter: (el: HTMLElement) => {
        addClass(el, 'sa-collapse-transition')
        if (!el.dataset) (el as any).dataset = {};

        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;

        el.style.height = '0';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
      },

      enter(el: HTMLElement) {
        el.dataset.oldOverflow = el.style.overflow;
        if (el.scrollHeight !== 0) {
          el.style.height = el.scrollHeight + 'px';
          el.style.paddingTop = el.dataset.oldPaddingTop as string; 
          el.style.paddingBottom = el.dataset.oldPaddingBottom as string;
        } else {
          el.style.height = '';
          el.style.paddingTop = el.dataset.oldPaddingTop as string;
          el.style.paddingBottom = el.dataset.oldPaddingBottom as string;
        }

        el.style.overflow = 'hidden';
      },
      afterEnter(el: HTMLElement) {
        removeClass(el, 'sa-collapse-transition');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow as string;
      },
      beforeLeave(el: HTMLElement) {
        if (!el.dataset) (el as any).dataset = {};
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;
        el.dataset.oldOverflow = el.style.overflow;
        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
      },
      leave(el: HTMLElement) {
        if (el.scrollHeight != 0) {
          addClass(el, 'sa-collapse-transition');
          el.style.transitionProperty = 'height'
          el.style.height = "0";
          el.style.paddingTop = '0';
          el.style.paddingBottom = '0';
        }
      },
      afterLeave(el: HTMLElement) {
        removeClass(el, 'sa-collapse-transition');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow as string;
        el.style.paddingTop = el.dataset.oldPaddingTop as string;
        el.style.paddingBottom = el.dataset.oldPaddingBottom as string;
        emit.onAfterLeave()
      }
    }

    return {
      render: () => (
        <Transition
          {...{
            onBeforeEnter: handler.beforeEnter,
            onEnter: handler.enter,
            onAfterEnter: handler.afterEnter,
            onBeforeLeave: handler.beforeLeave,
            onLeave: handler.leave,
            onAfterLeave: handler.afterLeave,
          } as any}
          
        >
          {slots.default()} 
        </Transition>
      )
    }
  }
})

export default SaCollapseTransition