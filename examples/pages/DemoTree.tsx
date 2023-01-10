import { defineComponent } from "vue";
import { SaTree } from 'sa-ui'

export default defineComponent({
  setup() {

    return () => <div>
      <SaTree 
        data={
          [
            { 
              title: '节点1',
              data: [
                {
                  title: '节点1-1',
                  data: [
                    {
                      title: '节点1-1-1',
                      data: [
                        {
                          title: '节点1-1-1-1'
                        },
                        {
                          title: '节点1-1-2-2'
                        },
                        {
                          title: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      title: '节点1-1-2',
                      data: [
                        {
                          title: '节点1-1-2-2'
                        },
                        {
                          title: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      title: '节点1-1-3'
                    }
                  ]
                },
                {
                  title: '节点1-2'
                }
              ]
            },
            { 
              title: '节点2',
              data: [
                {
                  title: '节点2-1',
                }
              ]
            }
          ]
        }
        props={{
          label: 'title',
          childrens: 'data'
        }}
      />
    </div>
  }
})