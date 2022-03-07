import { designComponent } from "src/advancedComponentionsApi/designComponent"

export const SaItem = designComponent({
    name: 'sa-item',
    props: {
        block: {type: Boolean},
        tag: {type: String, default: 'div'},
    },
    slots: ['default'],
    setup({props, slots}) {
        return {
            render: () => {
                const {tag: Tag} = props as any
                return (
                    <Tag {...{class: `sa-item ${!!props.block ? 'sa-item-block' : ''}`}}>
                        {slots.default()}
                    </Tag>
                )
            }
        }
    },
})
