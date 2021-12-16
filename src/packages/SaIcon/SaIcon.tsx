import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { VueNode } from "src/advancedComponentionsApi/designComponent.utils";
import { classname } from "src/hooks";
import { computed, ref, watch } from "vue";
import './icon.scss'

interface IconGetter {
  (icon: string): VueNode | Promise<VueNode>
}

const register = (() => {
  const icons: { prefix: string, getter: IconGetter }[] = []

  return Object.assign((prefix: string, getter: IconGetter) => {
    icons.unshift({ prefix, getter })
  }, {
    icons
  })
})()

register('el-icon-', async (icon) => {
  try {
    const modules = await import('./icons/' + icon + '.json')
    return (
      <svg {...{
            innerHTML: modules.default[0],
            class: `el-svg-icon ${ icon }`,
            viewBox: '0 0 1024 1024',
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg'
          }}/>
    )
    
  } catch(e) {
    throw e
  }
})

const SaIcon = designComponent({
  name: 'sa-icon',

  props: {
    icon: { type: String },
    status: { type: String },
    size: { type: [Number, String] },
    color: { type: String }
  },

  expose: {register},

  setup({ props }) {
    const icon = ref(null as any)

    const classes = computed(() => ([
      'sa-icon',
      {
        [`sa-icon-status-${props.status}`]: !!props.status
      }
    ]))

    const utils = {
      getIconVNode: async (iconName: string) => {
        for(let i = 0; i < register.icons.length; i++) {
          const registerIcon = register.icons[i]

          if(iconName.indexOf(registerIcon.prefix) === 0) {
            return await registerIcon.getter(iconName)
          }
        }

        return null
      },

      reset: async (iconName: string) => {
        const Icon = await utils.getIconVNode(iconName)

        icon.value = Icon || null
      }
    }

    watch(() => props.icon, val => !!val && utils.reset(val), { immediate: true })

    return {
      render: () => {
        const { value: Icon } = icon
        return !!Icon ? { 
          ...Icon, 
          props: { 
            ...Icon.props,
            class: `${Icon.props.class || ''} ${classname(classes.value)}`,
            style: { fontSize: `${ props.size || '12' }px`, color: `${props.color}` }
           } 
        }: <i class="sa-icon" />
      }
    }
  }
})

export default SaIcon