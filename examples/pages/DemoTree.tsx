import { defineComponent } from "vue";
import { SaTree } from 'sa-ui'

export default defineComponent({
  setup() {

    return () => <div>
      <SaTree 
        data={
          [
            { 
              label: '节点1',
              childrens: [
                {
                  label: '节点1-1',
                  childrens: [
                    {
                      label: '节点1-1-1'
                    }
                  ]
                }
              ]
            },
            { 
              label: '节点2'
            }
          ]
        }
      />
    </div>
  }
})