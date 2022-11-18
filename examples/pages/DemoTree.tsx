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
                      label: '节点1-1-1',
                      childrens: [
                        {
                          label: '节点1-1-1-1'
                        },
                        {
                          label: '节点1-1-2-2'
                        },
                        {
                          label: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      label: '节点1-1-2'
                    },
                    {
                      label: '节点1-1-3'
                    }
                  ]
                },
                {
                  label: '节点1-2'
                }
              ]
            },
            { 
              label: '节点2',
              childrens: [
                {
                  label: '节点2-1',
                }
              ]
            }
          ]
        }
      />
    </div>
  }
})