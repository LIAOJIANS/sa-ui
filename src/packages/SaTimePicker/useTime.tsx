
import { createUseEditPopperAgent } from 'src/hooks'
import SaTimePanel from './SaTimePanel'

export const useTime = createUseEditPopperAgent({
    name: 'time',
    render: (attrs) => <SaTimePanel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'sa-transition-popper-drop',
    },

    
})
