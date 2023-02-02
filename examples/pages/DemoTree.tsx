import { defineComponent } from "vue";
import { SaTree } from 'sa-ui'

export default defineComponent({
  setup() {

    return () => <div>
      <p>基础组件</p>
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
        highlightCurrent
        defaultExpandAll
        accordion
      />

      <p>checkbox选择树形</p>

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
                      label: '节点1-1-2',
                      childrens: [
                        {
                          label: '节点1-1-2-2'
                        },
                        {
                          label: '节点1-1-3-3'
                        }
                      ]
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
        checkbox
        defaultExpandAll
        checkStrictly
      />
    </div>
  }
})