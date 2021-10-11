import {ComponentInternalInstance} from "vue";

export function useDesignExpose(ctx: ComponentInternalInstance, refer: any, componentName?: string) {
    if (!refer) {return}
    const duplicateKey = Object.keys(refer || {}).find(i => i in ctx.proxy!)
    if (!!duplicateKey) {
        console.error(`designComponent:${componentName} key '${duplicateKey}' in refer is not allow here!`)
    } else {
        Object.assign(ctx.proxy, refer)
    }
}
